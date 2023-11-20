import express from "express";
import {authMiddleware} from "../middleWares/authMiddleware.js";
import {profilePhotoUploadMiddleware,
    reportResizeMiddleware,
} from "../middleWares/fileUploadMiddleware.js";

import {createReport, getAllReport, getSingleReporter, getSingleReport, deleteReport} from "../controller/reportController.js"
const reportRoute = express.Router();

reportRoute.post("/add", authMiddleware, profilePhotoUploadMiddleware.single("image"),reportResizeMiddleware,createReport);
reportRoute.get("/",authMiddleware,getAllReport);
reportRoute.get("/user", authMiddleware,getSingleReporter);
reportRoute.get("/rpt", authMiddleware,getSingleReport);
reportRoute.delete("/:id", authMiddleware,deleteReport);

export default reportRoute;