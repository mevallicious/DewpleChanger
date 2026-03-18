import youtubedl from "yt-dlp-exec";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";

ffmpeg.setFfmpegPath(ffmpegPath);

/**
 * Fetches video metadata (title, duration, thumbnail) using yt-dlp.
 * @param {string} url - YouTube video URL
 * @returns {{ title: string, thumbnail: string, duration: number }}
 */
export async function getVideoInfo(url) {
    const info = await youtubedl(url, {
        dumpSingleJson: true,
        noCheckCertificates: true,
        noWarnings: true,
        preferFreeFormats: true,
        // Using mobile clients helps bypass datacenter IP blocks without cookies
        extractorArgs: "youtube:player_client=android,ios",
    });

    return {
        title: info.title,
        thumbnail: info.thumbnail,
        duration: info.duration, // seconds as number
    };
}

/**
 * Streams YouTube audio transcoded to MP3 directly into an HTTP response.
 *
 * @param {string} url   - YouTube video URL
 * @param {string} title - Used for the Content-Disposition filename
 * @param {import("http").ServerResponse} res - Express response object to pipe into
 */
export function streamMp3(url, title, res) {
    const safeTitle = title.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "_") || "audio";

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", `attachment; filename="${safeTitle}.mp3"`);

    const ytProc = youtubedl.exec(url, {
        format: "bestaudio",
        output: "-",
        quiet: true,
        // Apply the same bot-bypass to the download stream
        extractorArgs: "youtube:player_client=android,ios",
    }, { stdio: ["ignore", "pipe", "ignore"] });

    ffmpeg(ytProc.stdout)
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
}
