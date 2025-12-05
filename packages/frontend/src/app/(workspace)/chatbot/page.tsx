import ChatbotContainer from "@/src/components/chatbot/ChatbotContainer";

export default function ChatbotPage() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Export Assistant</h1>
          <p className="mt-2 text-muted-foreground">
            Get AI-powered guidance on products, markets, compliance, and shipping.
          </p>
        </div>
        <ChatbotContainer />
      </div>
    </div>
  );
}
