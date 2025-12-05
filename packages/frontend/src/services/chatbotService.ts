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
