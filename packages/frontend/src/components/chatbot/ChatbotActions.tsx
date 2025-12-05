"use client";

import { useState } from "react";
import {
  Package,
  TrendingUp,
  CheckCircle2,
  Truck,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";

type ChatbotActionsProps = {
  onAnalyzeProduct: (productInfo: string) => Promise<void>;
  onGetMarketStrategy: (marketInfo: string) => Promise<void>;
  onGetComplianceGuidance: (complianceQuery: string) => Promise<void>;
  onGetShippingGuidance: (shippingInfo: string) => Promise<void>;
  onClearChat: () => Promise<void>;
  isLoading: boolean;
};

export default function ChatbotActions({
  onAnalyzeProduct,
  onGetMarketStrategy,
  onGetComplianceGuidance,
  onGetShippingGuidance,
  onClearChat,
  isLoading,
}: ChatbotActionsProps) {
  const [expandedAction, setExpandedAction] = useState<string | null>(null);
  const [formInputs, setFormInputs] = useState({
    product: "",
    market: "",
    compliance: "",
    shipping: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleActionSubmit = async (
    action: string,
    input: string,
    callback: (input: string) => Promise<void>
  ) => {
    if (!input.trim()) return;
    setIsSubmitting(true);
    try {
      await callback(input);
      setFormInputs((prev) => ({ ...prev, [action]: "" }));
      setExpandedAction(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const actions = [
    {
      id: "product",
      icon: Package,
      label: "Analyze Product",
      description: "Get export viability analysis",
      placeholder: "e.g., Premium Ethiopian coffee beans, 1kg bags",
      callback: onAnalyzeProduct,
    },
    {
      id: "market",
      icon: TrendingUp,
      label: "Market Strategy",
      description: "Get market entry strategy",
      placeholder: "e.g., Product: Coffee, Target: USA, Current: 2 countries",
      callback: onGetMarketStrategy,
    },
    {
      id: "compliance",
      icon: CheckCircle2,
      label: "Compliance Check",
      description: "Get compliance requirements",
      placeholder: "e.g., Certifications needed for organic coffee to Europe",
      callback: onGetComplianceGuidance,
    },
    {
      id: "shipping",
      icon: Truck,
      label: "Shipping Guide",
      description: "Get shipping logistics",
      placeholder: "e.g., 1000kg coffee from Ethiopia to USA",
      callback: onGetShippingGuidance,
    },
  ];

  return (
    <div className="space-y-3">
      {actions.map(({ id, icon: Icon, label, description, placeholder, callback }) => (
        <Card key={id} className="p-0 overflow-hidden">
          <button
            onClick={() =>
              setExpandedAction(expandedAction === id ? null : id)
            }
            disabled={isLoading || isSubmitting}
            className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform ${
                expandedAction === id ? "rotate-180" : ""
              }`}
            />
          </button>

          {expandedAction === id && (
            <div className="border-t border-border/60 bg-muted/30 p-4 space-y-3">
              <input
                type="text"
                value={formInputs[id as keyof typeof formInputs]}
                onChange={(e) =>
                  setFormInputs((prev) => ({
                    ...prev,
                    [id]: e.target.value,
                  }))
                }
                placeholder={placeholder}
                disabled={isLoading || isSubmitting}
                className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-xs placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
              />
              <Button
                onClick={() =>
                  handleActionSubmit(
                    id,
                    formInputs[id as keyof typeof formInputs],
                    callback
                  )
                }
                disabled={
                  !formInputs[id as keyof typeof formInputs].trim() ||
                  isLoading ||
                  isSubmitting
                }
                className="w-full h-9"
              >
                {isSubmitting ? "Analyzing..." : "Analyze"}
              </Button>
            </div>
          )}
        </Card>
      ))}

      {/* Clear Chat Button */}
      <Card className="p-0">
        <button
          onClick={onClearChat}
          disabled={isLoading || isSubmitting}
          className="w-full p-4 flex items-center gap-3 hover:bg-destructive/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="h-5 w-5 text-destructive flex-shrink-0" />
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-foreground">Clear Chat</p>
            <p className="text-xs text-muted-foreground">Start fresh conversation</p>
          </div>
        </button>
      </Card>
    </div>
  );
}