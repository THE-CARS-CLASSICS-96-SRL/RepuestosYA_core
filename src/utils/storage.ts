import multer from "multer";
import path from "path";
import fs from "fs";
import mime from "mime";

const UPLOADS_DIR = 'uploads/';

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const ALLOWED_EXTS = [".jpg", ".jpeg", ".png", ".gif"];

function getFileExtension(file: Express.Multer.File): string {
  const extFromOriginal = path.extname(file.originalname || "").toLowerCase();
  if (extFromOriginal) return extFromOriginal;
  const extFromMime = mime.extension(file.mimetype);
  return extFromMime ? `.${extFromMime}` : "";
}

function sanitizeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9-_\.]/g, "-").replace(/-+/g, "-").slice(0, 120);
}

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = getFileExtension(file);
    const base = sanitizeName(path.basename(file.originalname || "file", path.extname(file.originalname || "")));
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${base}-${unique}${ext}`;
    cb(null, filename);
  },
});

const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  const ext = getFileExtension(file).toLowerCase();
  if (!ext || !ALLOWED_EXTS.includes(ext)) {
    return cb(new Error(`Tipo de archivo no permitido: ${ext}`) as any, false);
  }
  cb(null, true);
};

const upload = multer({
  storage: diskStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;