import { gemini } from "../config/openai.js";

const EMBEDDING_MODEL = "gemini-embedding-001";

export async function createEmbedding(
  text: string
): Promise<number[]> {
  const response = await gemini.models.embedContent({
    model: EMBEDDING_MODEL,
    contents: text,
    config: {
      outputDimensionality: 1536,
    },
  });

  const embedding = response.embeddings?.[0]?.values;
  if (!embedding) {
    throw new Error("No embedding returned from Gemini");
  }

  return embedding;
}