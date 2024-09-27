import express from "express";
const router = express.Router();
import { uploadFile, searchData } from "../controller/upload.controller.js";
import { upload } from "../../middleware/uploadFile.js";

//* to render the layout file
router.get("/", (req, res) => {
  return res.render("layout.ejs", { render: "layout" });
});
// * to upload the file to the storage system
router.route("/upload").post(upload, uploadFile);
router.route("/search").get(searchData);
//* To show the contents of the file

export default router;
