import { useState, useCallback } from "react";
import { useAuth } from "@/src/context/AuthContext";

export type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export function useChatbot() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = useCallback(() => {
    return localStorage.getItem("auth_token") || "";
  }, []);

  const fetchAPI = useCallback(
    async (endpoint: string, method: string = "POST", body?: unknown) => {
      try {
        const token = getAuthToken();
        const response = await fetch(`${BACKEND_URL}${endpoint}`, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || errorData.message || "API request failed"
          );
        }

        return await response.json();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        throw err;
      }
    },
    [getAuthToken]
  );

  const joinChat = useCallback(
    async (userName: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await fetchAPI("api/chatbot/join", "POST", { userName });
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAPI]
  );

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim()) return;

      // Add user message to UI
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: message,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchAPI("api/chatbot/send-message", "POST", {
          message,
        });

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.response || response.message || "",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAPI]
  );

  const analyzeProduct = useCallback(
    async (productInfo: string) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: `Analyze this product for export: ${productInfo}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchAPI("api/chatbot/analyze-product", "POST", {
          productInfo,
        });

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.analysis || response.response || "",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAPI]
  );

  const getMarketStrategy = useCallback(
    async (marketInfo: string) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: `Get market strategy: ${marketInfo}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchAPI(
          "api/chatbot/market-strategy",
          "POST",
          { marketInfo }
        );

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.strategy || response.response || "",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAPI]
  );

  const getComplianceGuidance = useCallback(
    async (complianceQuery: string) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: `Compliance question: ${complianceQuery}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchAPI(
          "api/chatbot/compliance-guidance",
          "POST",
          { complianceQuery }
        );

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.guidance || response.response || "",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAPI]
  );

  const getShippingGuidance = useCallback(
    async (shippingInfo: string) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: `Shipping question: ${shippingInfo}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchAPI(
          "api/chatbot/shipping-guidance",
          "POST",
          { shippingInfo }
        );

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.guidance || response.response || "",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAPI]
  );

  const clearChat = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await fetchAPI("api/chatbot/clear", "POST");
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchAPI]);

  return {
    messages,
    isLoading,
    error,
    joinChat,
    sendMessage,
    analyzeProduct,
    getMarketStrategy,
    getComplianceGuidance,
    getShippingGuidance,
    clearChat,
  };
}
