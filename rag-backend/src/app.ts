 import express from "express";
import cors from "cors";

import chatRoutes from "./routes/chat.routes.js";
import documentRoutes from "./routes/document.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message:
      "DocMind AI RAG Backend is running 🚀",
  });
});

app.use("/api/chat", chatRoutes);

app.use(
  "/api/documents",
  documentRoutes
);

export default app;