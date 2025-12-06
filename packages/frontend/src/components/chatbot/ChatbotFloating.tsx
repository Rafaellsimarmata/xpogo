"use client";

import { MessageCircle } from "lucide-react";
import { useState } from "react";
import ChatbotContainer from "@/src/components/chatbot/ChatbotContainer";

const ChatbotFloating = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition hover:bg-primary/90"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Buka Export Assistant</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-end bg-background/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="m-4 w-full max-w-4xl rounded-3xl border border-border/60 bg-card/95 p-4 shadow-2xl"
            style={{ maxHeight: "90vh" }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  Export Assistant
                </p>
                <h2 className="text-lg font-semibold text-foreground">Chatbot</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-border/60 px-3 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                Tutup
              </button>
            </div>
            <div className="mt-4 max-h-[70vh] overflow-y-auto">
              <ChatbotContainer />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotFloating;
