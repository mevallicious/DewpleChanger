import { getVideoInfo, streamMp3 } from "../services/youtube.service.js";

/**
 * POST /api/v1/convert/info
 * Body: { url: string }
 * Returns video metadata (title, thumbnail, duration) as JSON.
 */
export async function getInfo(req, res) {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ success: false, message: "URL is required" });
        }

        const data = await getVideoInfo(url);

        return res.status(200).json({ success: true, data });
    } catch (err) {
        console.error("[getInfo] error:", err.message);
        return res.status(500).json({ success: false, message: err.message });
    }
}

/**
 * GET /api/v1/convert/download?url=<yt-url>
 * Streams the YouTube audio transcoded to MP3 as a file download.
 */
export async function downloadMp3(req, res) {
    try {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({ success: false, message: "URL query param is required" });
        }

        const { title } = await getVideoInfo(url);

        streamMp3(url, title, res);
    } catch (err) {
        console.error("[downloadMp3] error:", err.message);
        if (!res.headersSent) {
            return res.status(500).json({ success: false, message: err.message });
        }
    }
}