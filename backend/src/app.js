import express from "express";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import convertRouter from "./routes/convert.routes.js"; 
const app = express()

app.use(express.json())
app.use(cookieParser())


app.use("/api/auth",authRouter)
app.use("/api/v1/convert",convertRouter)

export default app