import { gemini } from "../config/openai.js";

export async function generateAnswer(
  question: string,
  context: string
): Promise<string> {
  const response = await gemini.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: `
You are DocMind AI, a document question-answering assistant.

Rules:

1. Answer using the provided context.
2. Do not invent information.
3. If the answer is not available in the context, say:
   "I couldn't find that information in the provided documents."
4. Keep the answer clear and concise.
`,
  },
  contents: `
Context:

${context}


Question:

${question}
`,
  });

  return response.text ?? "";
}