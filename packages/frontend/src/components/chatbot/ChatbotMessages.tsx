"use client";

import { Loader2 } from "lucide-react";
import MarkdownTyping from "../ui/MarkdownTyping";

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
};

type ChatbotMessagesProps = {
  messages: Message[];
  isLoading: boolean;
  onBotTyping: () => void;
};

export default function ChatbotMessages({ messages, isLoading, onBotTyping }: ChatbotMessagesProps) {
  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <h3 className="text-lg font-semibold">Welcome to Export Assistant</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-xs">
          Ask me about products, market strategies, compliance requirements, or shipping logistics.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-3 ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {message.role === "assistant" && (
            <div className="h-8 w-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-primary" />
            </div>
          )}

          <div
            className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-2 text-sm leading-relaxed break-words ${
              message.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground"
            }`}
          >
            {message.role === "assistant" ? (
              <MarkdownTyping text={message.content} onProgress={onBotTyping} />
            ) : (
              message.content
            )}
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
            <div className="h-4 w-4 rounded-full bg-primary" />
          </div>
          <div className="rounded-2xl bg-muted px-4 py-3">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
}
