import { createEmbedding } from "./embedding.service.js";
import { searchVectors } from "./pinecone.service.js";
import { generateAnswer } from "./openai.service.js";

export async function askRAG(
  question: string
): Promise<{
  answer: string;
  sources: Array<{
    text: string;
    source: string;
    chunkIndex: number;
    score: number | undefined;
  }>;
}> {
  // 1. Convert question into embedding
  const questionEmbedding =
    await createEmbedding(question);

  // 2. Search similar vectors
  const matches = await searchVectors(
    questionEmbedding,
    5
  );

  // 3. Extract relevant context
  const context = matches
    .map((match) => {
      const metadata = match.metadata as
        | {
            text?: string;
            source?: string;
            chunkIndex?: number;
          }
        | undefined;

      return metadata?.text ?? "";
    })
    .filter(Boolean)
    .join("\n\n---\n\n");

  // 4. Generate answer using retrieved context
  const answer = await generateAnswer(
    question,
    context
  );

  // 5. Return answer + sources
  const sources = matches
    .map((match) => {
      const metadata = match.metadata as
        | {
            text?: string;
            source?: string;
            chunkIndex?: number;
          }
        | undefined;

      if (!metadata?.text) {
        return null;
      }

      return {
        text: metadata.text,
        source: metadata.source ?? "Unknown",
        chunkIndex: metadata.chunkIndex ?? 0,
        score: match.score,
      };
    })
    .filter(
      (
        source
      ): source is {
        text: string;
        source: string;
        chunkIndex: number;
        score: number | undefined;
      } => source !== null
    );

  return {
    answer,
    sources,
  };
}