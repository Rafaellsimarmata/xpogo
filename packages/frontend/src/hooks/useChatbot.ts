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

export function useChatbot() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

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
      clearPending,
    [
      analyzePending,
      clearPending,
      compliancePending,
      joinPending,
      sendPending,
      shippingPending,
      strategyPending,
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

  const appendAssistantMessage = (content: string) => {
    setMessages((prev) => [...prev, createMessage("assistant", content)]);
  };

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
      appendAssistantMessage(response.response ?? response.message ?? "");
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
      appendAssistantMessage(response.analysis ?? response.response ?? "");
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
      appendAssistantMessage(response.strategy ?? response.response ?? "");
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
      appendAssistantMessage(response.guidance ?? response.response ?? "");
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
      appendAssistantMessage(response.guidance ?? response.response ?? "");
    } catch (err) {
      throw new Error(handleError(err));
    }
  }, [shippingRequest]);

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
    joinChat: join,
    sendMessage,
    analyzeProduct,
    getMarketStrategy,
    getComplianceGuidance,
    getShippingGuidance,
    clearChat,
  };
}
