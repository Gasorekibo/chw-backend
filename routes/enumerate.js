import express from "express";
import {
  testPhotoUploadMiddleware,
  csvResizeMiddleware,
} from "../middleWares/fileUploadMiddleware.js";
import { createTesting, addSingleUser, fetchUsers, editUser } from "../controller/enumerateController.js";
const enumerateRoute = express.Router();


enumerateRoute.post(
  "/csv-add-user",
  testPhotoUploadMiddleware.single("image"),
  csvResizeMiddleware,
  createTesting
);
enumerateRoute.post("/add/user", addSingleUser)
enumerateRoute.get("/users", fetchUsers)
enumerateRoute.put("/edit/:id", editUser)
export default enumerateRoute;
