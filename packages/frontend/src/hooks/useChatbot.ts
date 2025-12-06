"use client";

import { useCallback, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/src/context/AuthContext";
import type { ChatMessage } from "@/src/types/chat";
import {
  analyzeChatProduct,
  clearChatSession,
  fetchComplianceGuidance,
  fetchMarketStrategy,
  fetchShippingGuidance,
  joinChat,
  sendChatMessage,
  streamSendMessage,
  streamAnalyzeProduct,
  streamMarketStrategy,
  streamComplianceGuidance,
  streamShippingGuidance,
} from "@/src/services/chatbotService";

const createMessage = (
  role: ChatMessage["role"],
  content: string,
): ChatMessage => ({
  id:
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}`,
  role,
  content,
  timestamp: new Date().toISOString(),
});

const formatAssistantMarkdown = (content?: string) => {
  const trimmed = content?.trim();
  if (!trimmed) {
    return "_Maaf, saya belum menemukan jawaban untuk pertanyaan itu._";
  }
  return trimmed;
};

export function useChatbot() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleError = (err: unknown) => {
    const message =
      err instanceof Error ? err.message : "Terjadi kesalahan pada chatbot.";
    setError(message);
    return message;
  };

  const {
    mutateAsync: joinRequest,
    isPending: joinPending,
  } = useMutation({
    mutationFn: joinChat,
    onError: handleError,
  });

  const {
    mutateAsync: sendRequest,
    isPending: sendPending,
  } = useMutation({
    mutationFn: sendChatMessage,
    onError: handleError,
  });

  const {
    mutateAsync: analyzeRequest,
    isPending: analyzePending,
  } = useMutation({
    mutationFn: analyzeChatProduct,
    onError: handleError,
  });

  const {
    mutateAsync: strategyRequest,
    isPending: strategyPending,
  } = useMutation({
    mutationFn: fetchMarketStrategy,
    onError: handleError,
  });

  const {
    mutateAsync: complianceRequest,
    isPending: compliancePending,
  } = useMutation({
    mutationFn: fetchComplianceGuidance,
    onError: handleError,
  });

  const {
    mutateAsync: shippingRequest,
    isPending: shippingPending,
  } = useMutation({
    mutationFn: fetchShippingGuidance,
    onError: handleError,
  });

  const {
    mutateAsync: clearRequest,
    isPending: clearPending,
  } = useMutation({
    mutationFn: clearChatSession,
    onError: handleError,
  });

  const isLoading = useMemo(
    () =>
      joinPending ||
      sendPending ||
      analyzePending ||
      strategyPending ||
      compliancePending ||
      shippingPending ||
      clearPending ||
      isStreaming,
    [
      analyzePending,
      clearPending,
      compliancePending,
      joinPending,
      sendPending,
      shippingPending,
      strategyPending,
      isStreaming,
    ],
  );

  const join = useCallback(async (userName: string) => {
    setError(null);
    try {
      await joinRequest(userName);
      setMessages([]);
    } catch (err) {
      throw new Error(handleError(err));
    }
  }, [joinRequest]);

  const appendAssistantMessage = (content?: string) => {
    setMessages((prev) => [
      ...prev,
      createMessage("assistant", formatAssistantMarkdown(content)),
    ]);
  };

  const updateLastAssistantMessage = (content: string) => {
    setMessages((prev) => {
      const updated = [...prev];
      const lastIndex = updated.length - 1;
      if (lastIndex >= 0 && updated[lastIndex].role === "assistant") {
        updated[lastIndex] = {
          ...updated[lastIndex],
          content,
        };
      }
      return updated;
    });
  };

  // Non-streaming versions (original)
  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;
    const senderName = user?.name ?? "User";

    setMessages((prev) => [
      ...prev,
      createMessage("user", `[${senderName}]: ${message}`),
    ]);
    setError(null);

    try {
      const response = await sendRequest(message);
      appendAssistantMessage(response.response ?? response.message);
    } catch (err) {
      throw new Error(handleError(err));
    }
  }, [sendRequest, user?.name]);

  const analyzeProduct = useCallback(async (productInfo: string) => {
    setMessages((prev) => [
      ...prev,
      createMessage("user", `Analyze this product: ${productInfo}`),
    ]);
    setError(null);

    try {
      const response = await analyzeRequest(productInfo);
      appendAssistantMessage(response.analysis ?? response.response);
    } catch (err) {
      throw new Error(handleError(err));
    }
  }, [analyzeRequest]);

  const getMarketStrategy = useCallback(async (marketInfo: string) => {
    setMessages((prev) => [
      ...prev,
      createMessage("user", `Market strategy request: ${marketInfo}`),
    ]);
    setError(null);

    try {
      const response = await strategyRequest(marketInfo);
      appendAssistantMessage(response.strategy ?? response.response);
    } catch (err) {
      throw new Error(handleError(err));
    }
  }, [strategyRequest]);

  const getComplianceGuidance = useCallback(async (complianceQuery: string) => {
    setMessages((prev) => [
      ...prev,
      createMessage("user", `Compliance question: ${complianceQuery}`),
    ]);
    setError(null);

    try {
      const response = await complianceRequest(complianceQuery);
      appendAssistantMessage(response.guidance ?? response.response);
    } catch (err) {
      throw new Error(handleError(err));
    }
  }, [complianceRequest]);

  const getShippingGuidance = useCallback(async (shippingInfo: string) => {
    setMessages((prev) => [
      ...prev,
      createMessage("user", `Shipping info: ${shippingInfo}`),
    ]);
    setError(null);

    try {
      const response = await shippingRequest(shippingInfo);
      appendAssistantMessage(response.guidance ?? response.response);
    } catch (err) {
      throw new Error(handleError(err));
    }
  }, [shippingRequest]);

  // Streaming versions (new - word-by-word)
  const sendMessageStream = useCallback(async (message: string) => {
    if (!message.trim()) return;
    const senderName = user?.name ?? "User";

    setMessages((prev) => [
      ...prev,
      createMessage("user", `[${senderName}]: ${message}`),
    ]);
    setError(null);
    setIsStreaming(true);

    // Add empty assistant message to populate
    appendAssistantMessage("");

    try {
      await streamSendMessage(
        message,
        (chunk) => {
          if (chunk.type === "chunk" && chunk.content) {
            updateLastAssistantMessage(chunk.fullResponse || "");
          } else if (chunk.type === "start") {
            updateLastAssistantMessage("Generating response...");
          }
        },
        (fullResponse) => {
          updateLastAssistantMessage(formatAssistantMarkdown(fullResponse));
          setIsStreaming(false);
        },
        (error) => {
          handleError(new Error(error));
          setIsStreaming(false);
        }
      );
    } catch (err) {
      throw new Error(handleError(err));
    }
  }, [user?.name]);

  const analyzeProductStream = useCallback(async (productInfo: string) => {
    setMessages((prev) => [
      ...prev,
      createMessage("user", `Analyze this product: ${productInfo}`),
    ]);
    setError(null);
    setIsStreaming(true);

    appendAssistantMessage("");

    try {
      await streamAnalyzeProduct(
        productInfo,
        (chunk) => {
          if (chunk.type === "chunk" && chunk.content) {
            updateLastAssistantMessage(chunk.fullResponse || "");
          } else if (chunk.type === "start") {
            updateLastAssistantMessage("Analyzing product...");
          }
        },
        (fullResponse) => {
          updateLastAssistantMessage(formatAssistantMarkdown(fullResponse));
          setIsStreaming(false);
        },
        (error) => {
          handleError(new Error(error));
          setIsStreaming(false);
        }
      );
    } catch (err) {
      throw new Error(handleError(err));
    }
  }, []);

  const getMarketStrategyStream = useCallback(async (marketInfo: string) => {
    setMessages((prev) => [
      ...prev,
      createMessage("user", `Market strategy request: ${marketInfo}`),
    ]);
    setError(null);
    setIsStreaming(true);

    appendAssistantMessage("");

    try {
      await streamMarketStrategy(
        marketInfo,
        (chunk) => {
          if (chunk.type === "chunk" && chunk.content) {
            updateLastAssistantMessage(chunk.fullResponse || "");
          } else if (chunk.type === "start") {
            updateLastAssistantMessage("Developing strategy...");
          }
        },
        (fullResponse) => {
          updateLastAssistantMessage(formatAssistantMarkdown(fullResponse));
          setIsStreaming(false);
        },
        (error) => {
          handleError(new Error(error));
          setIsStreaming(false);
        }
      );
    } catch (err) {
      throw new Error(handleError(err));
    }
  }, []);

  const getComplianceGuidanceStream = useCallback(
    async (complianceQuery: string) => {
      setMessages((prev) => [
        ...prev,
        createMessage("user", `Compliance question: ${complianceQuery}`),
      ]);
      setError(null);
      setIsStreaming(true);

      appendAssistantMessage("");

      try {
        await streamComplianceGuidance(
          complianceQuery,
          (chunk) => {
            if (chunk.type === "chunk" && chunk.content) {
              updateLastAssistantMessage(chunk.fullResponse || "");
            } else if (chunk.type === "start") {
              updateLastAssistantMessage("Looking up compliance...");
            }
          },
          (fullResponse) => {
            updateLastAssistantMessage(formatAssistantMarkdown(fullResponse));
            setIsStreaming(false);
          },
          (error) => {
            handleError(new Error(error));
            setIsStreaming(false);
          }
        );
      } catch (err) {
        throw new Error(handleError(err));
      }
    },
    []
  );

  const getShippingGuidanceStream = useCallback(async (shippingInfo: string) => {
    setMessages((prev) => [
      ...prev,
      createMessage("user", `Shipping info: ${shippingInfo}`),
    ]);
    setError(null);
    setIsStreaming(true);

    appendAssistantMessage("");

    try {
      await streamShippingGuidance(
        shippingInfo,
        (chunk) => {
          if (chunk.type === "chunk" && chunk.content) {
            updateLastAssistantMessage(chunk.fullResponse || "");
          } else if (chunk.type === "start") {
            updateLastAssistantMessage("Checking shipping options...");
          }
        },
        (fullResponse) => {
          updateLastAssistantMessage(formatAssistantMarkdown(fullResponse));
          setIsStreaming(false);
        },
        (error) => {
          handleError(new Error(error));
          setIsStreaming(false);
        }
      );
    } catch (err) {
      throw new Error(handleError(err));
    }
  }, []);

  const clearChat = useCallback(async () => {
    setError(null);
    try {
      await clearRequest();
      setMessages([]);
    } catch (err) {
      throw new Error(handleError(err));
    }
  }, [clearRequest]);

  return {
    messages,
    isLoading,
    error,
    isStreaming,
    joinChat: join,
    // Non-streaming (original)
    sendMessage,
    analyzeProduct,
    getMarketStrategy,
    getComplianceGuidance,
    getShippingGuidance,
    // Streaming (word-by-word)
    sendMessageStream,
    analyzeProductStream,
    getMarketStrategyStream,
    getComplianceGuidanceStream,
    getShippingGuidanceStream,
    clearChat,
  };
}
