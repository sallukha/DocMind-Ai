import "dotenv/config";

const requiredEnvVariables = [
  "GEMINI_API_KEY",
  "PINECONE_API_KEY",
  "PINECONE_INDEX",
];

for (const variable of requiredEnvVariables) {
  if (!process.env[variable]) {
    throw new Error(`Missing environment variable: ${variable}`);
  }
}

export const env = {
  port: Number(process.env.PORT) || 5000,

  geminiApiKey: process.env.GEMINI_API_KEY as string,

  pineconeApiKey: process.env.PINECONE_API_KEY as string,

  pineconeIndex: process.env.PINECONE_INDEX as string,
};