import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // ✅ Ruta correcta cuando public está dentro de src
    callback(null, path.join(__dirname, "../public/img"));
  },
  filename: (req, file, callback) => {
    const newFileName = Date.now() + "-" + file.originalname;
    callback(null, newFileName);
  },
});

const uploader = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes"));
    }
  },
});

export default uploader;