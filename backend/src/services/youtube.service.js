import ytDlpExec from "yt-dlp-exec";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import { spawn } from "child_process";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import os from "os";

ffmpeg.setFfmpegPath(ffmpegPath);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const ytDlpBin = path.join(
    path.dirname(require.resolve("yt-dlp-exec/package.json")),
    "bin",
    process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp"
);

/**
 * Writes YOUTUBE_COOKIES env var to a temp file and returns the path.
 * Returns null if env var is not set.
 */
function getCookiesFilePath() {
    const cookiesContent = process.env.YOUTUBE_COOKIES;
    if (!cookiesContent) return null;

    const tmpPath = path.join(os.tmpdir(), "yt_cookies.txt");
    fs.writeFileSync(tmpPath, cookiesContent, "utf-8");
    return tmpPath;
}

/**
 * Fetches video metadata (title, duration, thumbnail) via yt-dlp.
 * @param {string} url - YouTube video URL
 * @returns {{ title: string, thumbnail: string, duration: number }}
 */
export async function getVideoInfo(url) {
    const cookiesPath = getCookiesFilePath();

    const options = {
        dumpSingleJson: true,
        noWarnings: true,
        noPlaylist: true,
        noCheckCertificates: true,
        preferFreeFormats: true,
    };

    if (cookiesPath) {
        options.cookies = cookiesPath;
    }

    const info = await ytDlpExec(url, options);

    return {
        title: info.title,
        thumbnail: info.thumbnail,
        duration: info.duration,
    };
}

/**
 * Streams YouTube audio transcoded to MP3 directly into an HTTP response.
 * @param {string} url   - YouTube video URL
 * @param {string} title - Used for the Content-Disposition filename
 * @param {import("http").ServerResponse} res - Express response object
 */
export function streamMp3(url, title, res) {
    const safeTitle = title.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "_") || "audio";

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", `attachment; filename="${safeTitle}.mp3"`);

    const cookiesPath = getCookiesFilePath();

    const args = [
        "-f", "bestaudio",
        "--no-playlist",
        "-o", "-",
        url,
    ];

    if (cookiesPath) {
        args.unshift("--cookies", cookiesPath);
    }

    const ytDlpProcess = spawn(ytDlpBin, args);

    ffmpeg(ytDlpProcess.stdout)
        .audioBitrate(128)
        .audioCodec("libmp3lame")
        .format("mp3")
        .on("error", (err) => {
            console.error("[ffmpeg] conversion error:", err.message);
            if (!res.headersSent) {
                res.status(500).json({ success: false, message: "Conversion failed" });
            }
        })
        .pipe(res, { end: true });

    ytDlpProcess.stderr.on("data", (data) => {
        console.error("[yt-dlp]", data.toString());
    });

    ytDlpProcess.on("error", (err) => {
        console.error("[yt-dlp] spawn error:", err.message);
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: "yt-dlp failed to start" });
        }
    });
}
