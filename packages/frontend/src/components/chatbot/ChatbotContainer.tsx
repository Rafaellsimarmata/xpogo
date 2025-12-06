"use client";

import { useCallback, useRef, useEffect } from "react";
import { useAuth } from "@/src/context/AuthContext";
import ChatbotMessages from "./ChatbotMessages";
import ChatbotInput from "./ChatbotInput";
import ChatbotActions from "./ChatbotActions";
import { useChatbot } from "@/src/hooks/useChatbot";

export default function ChatbotContainer() {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const {
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
  } = useChatbot();

  // init chat
  useEffect(() => {
    if (user?.id) {
      joinChat(user.name || "User").catch(() => {});
    }
  }, [user?.id, user?.name, joinChat]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // scroll ketika ada pesan baru
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = useCallback(
    async (message: string) => {
      await sendMessage(message);
    },
    [sendMessage],
  );

  const handleAnalyzeProduct = useCallback(
    async (productInfo: string) => {
      await analyzeProduct(productInfo);
    },
    [analyzeProduct],
  );

  const handleGetMarketStrategy = useCallback(
    async (marketInfo: string) => {
      await getMarketStrategy(marketInfo);
    },
    [getMarketStrategy],
  );

  const handleGetComplianceGuidance = useCallback(
    async (complianceQuery: string) => {
      await getComplianceGuidance(complianceQuery);
    },
    [getComplianceGuidance],
  );

  const handleGetShippingGuidance = useCallback(
    async (shippingInfo: string) => {
      await getShippingGuidance(shippingInfo);
    },
    [getShippingGuidance],
  );

  const handleClearChat = useCallback(async () => {
    await clearChat();
  }, [clearChat]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="flex h-[70vh] max-h-[600px] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6">
            <ChatbotMessages
              messages={messages}
              isLoading={isLoading}
              onBotTyping={scrollToBottom}
            />
            <div ref={messagesEndRef} />
          </div>

          {/* Error */}
          {error && (
            <div className="border-t border-border/60 bg-destructive/10 p-4">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-border/60 p-4">
            <ChatbotInput onSend={handleSendMessage} isLoading={isLoading} />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="flex flex-col gap-4">
        <ChatbotActions
          onAnalyzeProduct={handleAnalyzeProduct}
          onGetMarketStrategy={handleGetMarketStrategy}
          onGetComplianceGuidance={handleGetComplianceGuidance}
          onGetShippingGuidance={handleGetShippingGuidance}
          onClearChat={handleClearChat}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
