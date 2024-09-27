import multer from "multer";
import path from "path";

//# Set storage engine
const storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

//? Initialize upload
export const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
}).single("myFile");
