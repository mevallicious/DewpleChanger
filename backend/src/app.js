import express from "express";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import convertRouter from "./routes/convert.routes.js"; 
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/v1/convert", convertRouter);

app.use(express.static(path.join(__dirname, "../public")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

export default app;