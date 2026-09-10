import { Router } from "express";
import multer from "multer";

import {
  uploadDocumentController,
} from "../controllers/document.controller.js";

const router = Router();

const upload = multer({
  dest: "documents/",
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype === "application/pdf") {
      callback(null, true);
    } else {
      callback(
        new Error("Only PDF files are allowed.")
      );
    }
  },
});

router.post(
  "/upload",
  upload.single("file"),
  uploadDocumentController
);

export default router;