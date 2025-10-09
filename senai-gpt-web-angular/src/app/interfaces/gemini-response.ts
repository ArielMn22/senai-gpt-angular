export interface GeminiResponse {
  candidates: Candidate[];
  usageMetadata: UsageMetadata;
  modelVersion: string;
  responseId: string;
}

export interface Candidate {
  content: Content;
  finishReason: "STOP" | string;
  avgLogprobs: number;
}

export interface Content {
  parts: Part[];
  role: "model" | "user" | "system" | string;
}

export interface Part {
  text: string;
}

export interface UsageMetadata {
  promptTokenCount: number;
  candidatesTokenCount: number;
  totalTokenCount: number;
  promptTokensDetails: TokenDetail[];
  candidatesTokensDetails: TokenDetail[];
}

export interface TokenDetail {
  modality: "TEXT" | "AUDIO" | "IMAGE" | "VIDEO" | string;
  tokenCount: number;
}
