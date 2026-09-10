import type { Request, Response } from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import { extractTextFromPDF } from "../utils/pdfParser.js";
import { chunkText } from "../utils/chunkText.js";
import { createEmbedding } from "../services/embedding.service.js";
import { upsertVectors } from "../services/pinecone.service.js";

export async function uploadDocumentController(
  req: Request,
  res: Response
) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "PDF file is required.",
      });
    }

    const filePath = path.resolve(
      req.file.path
    );

    // 1. Extract text
    const text =
      await extractTextFromPDF(filePath);

    if (!text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Could not extract text from PDF.",
      });
    }

    // 2. Split text into chunks
    const chunks = chunkText(text);

    // 3. Create embeddings + vectors
    const vectors = [];

    for (const chunk of chunks) {
      const embedding =
        await createEmbedding(chunk.text);

      vectors.push({
        id: randomUUID(),

        values: embedding,

        metadata: {
          text: chunk.text,
          source: req.file.originalname,
          chunkIndex: chunk.index,
        },
      });
    }

    // 4. Store vectors in Pinecone
    await upsertVectors(vectors);

    return res.status(201).json({
      success: true,
      message: "Document processed successfully.",
      data: {
        filename: req.file.originalname,
        chunks: chunks.length,
      },
    });
  } catch (error) {
    console.error(
      "Document upload error:",
      error
    );

    const apiError = error as {
      status?: number;
      code?: string;
    };
    const isQuotaError =
      apiError.status === 429 ||
      apiError.code === "RESOURCE_EXHAUSTED";

    return res.status(isQuotaError ? 429 : 500).json({
      success: false,
      message: isQuotaError
        ? "Gemini API quota or rate limit reached."
        : "Failed to process document.",
    });
  }
}