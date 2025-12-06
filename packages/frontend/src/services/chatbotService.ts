import { apiFetch } from "@/src/services/apiClient";
import type { ChatbotResponse } from "@/src/types/chat";

export const joinChat = (userName: string) =>
  apiFetch<ChatbotResponse>("api/chatbot/join", {
    method: "POST",
    body: { userName },
  });

export const sendChatMessage = (message: string) =>
  apiFetch<ChatbotResponse>("api/chatbot/send-message", {
    method: "POST",
    body: { message },
  });

export const analyzeChatProduct = (productInfo: string) =>
  apiFetch<ChatbotResponse>("api/chatbot/analyze-product", {
    method: "POST",
    body: { productInfo },
  });

export const fetchMarketStrategy = (marketInfo: string) =>
  apiFetch<ChatbotResponse>("api/chatbot/market-strategy", {
    method: "POST",
    body: { marketInfo },
  });

export const fetchComplianceGuidance = (complianceQuery: string) =>
  apiFetch<ChatbotResponse>("api/chatbot/compliance-guidance", {
    method: "POST",
    body: { complianceQuery },
  });

export const fetchShippingGuidance = (shippingInfo: string) =>
  apiFetch<ChatbotResponse>("api/chatbot/shipping-guidance", {
    method: "POST",
    body: { shippingInfo },
  });

export const clearChatSession = () =>
  apiFetch<ChatbotResponse>("api/chatbot/clear", {
    method: "POST",
  });

/**
 * Streaming functions for word-by-word response generation
 */

interface StreamChunk {
  type: "start" | "chunk" | "finish" | "error";
  content?: string;
  fullResponse?: string;
  message?: string;
  error?: string;
  tokenCount?: number;
}

/**
 * Get auth token from localStorage
 */
const getAuthToken = (): string => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token") || "";
  }
  return "";
};

/**
 * Stream message response word-by-word
 */
export const streamSendMessage = async (
  message: string,
  onChunk: (chunk: StreamChunk) => void,
  onComplete: (fullResponse: string) => void,
  onError: (error: string) => void
): Promise<void> => {
  try {
    const token = getAuthToken();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    const response = await fetch(
      `${apiUrl}/api/chatbot/send-message-stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Response body not available for streaming");
    }

    const decoder = new TextDecoder();
    let buffer = "";
    let fullResponse = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");

      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim()) continue;
        if (!line.startsWith("data: ")) continue;

        const data = line.slice(6).trim();
        
        if (data === "[DONE]") {
          onComplete(fullResponse);
          return;
        }

        try {
          const chunk = JSON.parse(data) as StreamChunk;
          
          if (chunk.type === "chunk" && chunk.content) {
            fullResponse += chunk.content;
            onChunk({
              type: "chunk",
              content: chunk.content,
              fullResponse: fullResponse,
            });
          } else if (chunk.type === "finish") {
            onComplete(chunk.fullResponse || fullResponse);
            return;
          } else if (chunk.type === "error") {
            onError(chunk.error || "Unknown streaming error");
            return;
          } else if (chunk.type === "start") {
            onChunk(chunk);
          }
        } catch (e) {
          console.warn("Failed to parse stream chunk:", e, "Line:", line);
        }
      }
    }
    
    if (fullResponse) {
      onComplete(fullResponse);
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Streaming error occurred";
    onError(message);
  }
};

/**
 * Stream product analysis response
 */
export const streamAnalyzeProduct = async (
  productInfo: string,
  onChunk: (chunk: StreamChunk) => void,
  onComplete: (fullResponse: string) => void,
  onError: (error: string) => void
): Promise<void> => {
  try {
    const token = getAuthToken();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    const response = await fetch(
      `${apiUrl}/api/chatbot/analyze-product-stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productInfo }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Response body not available for streaming");
    }

    const decoder = new TextDecoder();
    let buffer = "";
    let fullResponse = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");

      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim()) continue;
        if (!line.startsWith("data: ")) continue;

        const data = line.slice(6).trim();
        
        if (data === "[DONE]") {
          onComplete(fullResponse);
          return;
        }

        try {
          const chunk = JSON.parse(data) as StreamChunk;
          
          if (chunk.type === "chunk" && chunk.content) {
            fullResponse += chunk.content;
            onChunk({
              type: "chunk",
              content: chunk.content,
              fullResponse: fullResponse,
            });
          } else if (chunk.type === "finish") {
            onComplete(chunk.fullResponse || fullResponse);
            return;
          } else if (chunk.type === "error") {
            onError(chunk.error || "Unknown streaming error");
            return;
          } else if (chunk.type === "start") {
            onChunk(chunk);
          }
        } catch (e) {
          console.warn("Failed to parse stream chunk:", e, "Line:", line);
        }
      }
    }
    
    if (fullResponse) {
      onComplete(fullResponse);
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Streaming error occurred";
    onError(message);
  }
};

/**
 * Stream market strategy response
 */
export const streamMarketStrategy = async (
  marketInfo: string,
  onChunk: (chunk: StreamChunk) => void,
  onComplete: (fullResponse: string) => void,
  onError: (error: string) => void
): Promise<void> => {
  try {
    const token = getAuthToken();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    const response = await fetch(
      `${apiUrl}/api/chatbot/market-strategy-stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ marketInfo }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Response body not available for streaming");
    }

    const decoder = new TextDecoder();
    let buffer = "";
    let fullResponse = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");

      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim()) continue;
        if (!line.startsWith("data: ")) continue;

        const data = line.slice(6).trim();
        
        if (data === "[DONE]") {
          onComplete(fullResponse);
          return;
        }

        try {
          const chunk = JSON.parse(data) as StreamChunk;
          
          if (chunk.type === "chunk" && chunk.content) {
            fullResponse += chunk.content;
            onChunk({
              type: "chunk",
              content: chunk.content,
              fullResponse: fullResponse,
            });
          } else if (chunk.type === "finish") {
            onComplete(chunk.fullResponse || fullResponse);
            return;
          } else if (chunk.type === "error") {
            onError(chunk.error || "Unknown streaming error");
            return;
          } else if (chunk.type === "start") {
            onChunk(chunk);
          }
        } catch (e) {
          console.warn("Failed to parse stream chunk:", e, "Line:", line);
        }
      }
    }
    
    if (fullResponse) {
      onComplete(fullResponse);
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Streaming error occurred";
    onError(message);
  }
};

/**
 * Stream compliance guidance response
 */
export const streamComplianceGuidance = async (
  complianceQuery: string,
  onChunk: (chunk: StreamChunk) => void,
  onComplete: (fullResponse: string) => void,
  onError: (error: string) => void
): Promise<void> => {
  try {
    const token = getAuthToken();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    const response = await fetch(
      `${apiUrl}/api/chatbot/compliance-guidance-stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ complianceQuery }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Response body not available for streaming");
    }

    const decoder = new TextDecoder();
    let buffer = "";
    let fullResponse = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");

      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim()) continue;
        if (!line.startsWith("data: ")) continue;

        const data = line.slice(6).trim();
        
        if (data === "[DONE]") {
          onComplete(fullResponse);
          return;
        }

        try {
          const chunk = JSON.parse(data) as StreamChunk;
          
          if (chunk.type === "chunk" && chunk.content) {
            fullResponse += chunk.content;
            onChunk({
              type: "chunk",
              content: chunk.content,
              fullResponse: fullResponse,
            });
          } else if (chunk.type === "finish") {
            onComplete(chunk.fullResponse || fullResponse);
            return;
          } else if (chunk.type === "error") {
            onError(chunk.error || "Unknown streaming error");
            return;
          } else if (chunk.type === "start") {
            onChunk(chunk);
          }
        } catch (e) {
          console.warn("Failed to parse stream chunk:", e, "Line:", line);
        }
      }
    }
    
    if (fullResponse) {
      onComplete(fullResponse);
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Streaming error occurred";
    onError(message);
  }
};

/**
 * Stream shipping guidance response
 */
export const streamShippingGuidance = async (
  shippingInfo: string,
  onChunk: (chunk: StreamChunk) => void,
  onComplete: (fullResponse: string) => void,
  onError: (error: string) => void
): Promise<void> => {
  try {
    const token = getAuthToken();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    const response = await fetch(
      `${apiUrl}/api/chatbot/shipping-guidance-stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ shippingInfo }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Response body not available for streaming");
    }

    const decoder = new TextDecoder();
    let buffer = "";
    let fullResponse = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");

      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const chunk = JSON.parse(line.slice(6)) as StreamChunk;
            
            if (chunk.type === "chunk" && chunk.content) {
              fullResponse += chunk.content;
              onChunk({
                type: "chunk",
                content: chunk.content,
                fullResponse: fullResponse,
              });
            } else if (chunk.type === "finish") {
              onComplete(chunk.fullResponse || fullResponse);
            } else if (chunk.type === "error") {
              onError(chunk.error || "Unknown streaming error");
            }
          } catch (e) {
            console.error("Failed to parse stream chunk:", e);
          }
        }
      }
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Streaming error occurred";
    onError(message);
  }
};
