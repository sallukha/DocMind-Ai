import type { Request, Response } from "express";
import { askRAG } from "../services/rag.service.js";

export async function chatController(
  req: Request,
  res: Response
) {
  try {
    const { question } = req.body;

    if (
      typeof question !== "string" ||
      question.trim().length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Question is required.",
      });
    }

    const result = await askRAG(
      question.trim()
    );

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Chat error:", error);

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
        : "Failed to process question.",
    });
  }
}