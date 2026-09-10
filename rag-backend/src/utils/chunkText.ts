export interface TextChunk {
  text: string;
  index: number;
}

export function chunkText(
  text: string,
  chunkSize = 1000,
  overlap = 200
): TextChunk[] {
  const chunks: TextChunk[] = [];

  let start = 0;
  let index = 0;

  while (start < text.length) {
    const end = Math.min(
      start + chunkSize,
      text.length
    );

    const chunk = text.slice(start, end).trim();

    if (chunk.length > 0) {
      chunks.push({
        text: chunk,
        index,
      });

      index++;
    }

    if (end >= text.length) {
      break;
    }

    start = end - overlap;
  }

  return chunks;
}