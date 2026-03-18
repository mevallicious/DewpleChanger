import ytdl from "@distube/ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";

ffmpeg.setFfmpegPath(ffmpegPath);

/**
 * Fetches video metadata (title, duration, thumbnail) using @distube/ytdl-core natively.
 * @param {string} url - YouTube video URL
 * @returns {{ title: string, thumbnail: string, duration: number }}
 */
export async function getVideoInfo(url) {
    const info = await ytdl.getInfo(url);
    const videoDetails = info.videoDetails;
    return {
        title: videoDetails.title,
        thumbnail: videoDetails.thumbnails[videoDetails.thumbnails.length - 1].url,
        duration: parseInt(videoDetails.lengthSeconds, 10),
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

    const audioStream = ytdl(url, { filter: "audioonly", quality: "highestaudio" });

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