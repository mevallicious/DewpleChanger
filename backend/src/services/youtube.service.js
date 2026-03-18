import ytdl from "@distube/ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import fs from "fs";
import path from "path";
import os from "os";

ffmpeg.setFfmpegPath(ffmpegPath);

// Build agent from cookies env var
function getAgent() {
    if (!process.env.YT_COOKIES) return undefined;

    // Write cookies to a temp file (ytdl needs a file path)
    const cookiePath = path.join(os.tmpdir(), "yt_cookies.txt");
    fs.writeFileSync(cookiePath, process.env.YT_COOKIES);
    return ytdl.createAgent(fs.readFileSync(cookiePath, "utf-8"));  // or pass cookies array
}

const agent = getAgent();

export async function getVideoInfo(url) {
    const info = await ytdl.getInfo(url, agent ? { agent } : {});
    const videoDetails = info.videoDetails;
    return {
        title: videoDetails.title,
        thumbnail: videoDetails.thumbnails[videoDetails.thumbnails.length - 1].url,
        duration: parseInt(videoDetails.lengthSeconds, 10),
    };
}

export function streamMp3(url, title, res) {
    const safeTitle = title.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "_") || "audio";

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", `attachment; filename="${safeTitle}.mp3"`);

    // Pass agent here too
    const audioStream = ytdl(url, {
        filter: "audioonly",
        quality: "highestaudio",
        ...(agent && { agent }),
    });

    ffmpeg(audioStream)
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