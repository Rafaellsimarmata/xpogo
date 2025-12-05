"use client";

import { useState, useCallback } from "react";
import { Send, Loader2 } from "lucide-react";

type ChatbotInputProps = {
  onSend: (message: string) => Promise<void>;
  isLoading: boolean;
};

export default function ChatbotInput({ onSend, isLoading }: ChatbotInputProps) {
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading || isSending) return;

      setIsSending(true);
      try {
        await onSend(input);
        setInput("");
      } finally {
        setIsSending(false);
      }
    },
    [input, isLoading, isSending, onSend]
  );

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about products, markets, compliance..."
        disabled={isLoading || isSending}
        className="flex-1 rounded-xl border border-border/60 bg-background px-4 py-2 text-sm placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isLoading || isSending || !input.trim()}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </button>
    </form>
  );
}
