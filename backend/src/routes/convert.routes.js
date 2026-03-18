import { Router } from "express";
import { getInfo, downloadMp3 } from "../controllers/convert.controller.js";

const convertRouter = Router();


convertRouter.post("/info", getInfo);

convertRouter.get("/download", downloadMp3);

export default convertRouter;
