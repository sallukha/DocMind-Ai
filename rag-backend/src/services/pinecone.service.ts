import { pineconeIndex } from "../config/pinecone.js";

interface VectorMetadata {
  [key: string]: string | number;
  text: string;
  source: string;
  chunkIndex: number;
}

export async function upsertVectors(
  vectors: Array<{
    id: string;
    values: number[];
    metadata: VectorMetadata;
  }>
) {
  await pineconeIndex.upsert({ records: vectors });
}

export async function searchVectors(
  embedding: number[],
  topK = 5
) {
  const result = await pineconeIndex.query({
    vector: embedding,
    topK,
    includeMetadata: true,
  });

  return result.matches ?? [];
}