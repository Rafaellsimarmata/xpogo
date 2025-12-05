export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
}

export interface ChatbotResponse {
  response?: string;
  message?: string;
  analysis?: string;
  strategy?: string;
  guidance?: string;
}
