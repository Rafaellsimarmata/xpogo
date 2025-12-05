"use client";

import { useState } from "react";
import {
  Package,
  TrendingUp,
  CheckCircle2,
  Truck,
  Trash2,
  ChevronDown,
  AlertCircle,
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

type FormErrors = {
  [key: string]: { [field: string]: string };
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
    product: { name: "", description: "", specifications: "" },
    market: { product: "", targetCountry: "", currentMarkets: "" },
    compliance: { productType: "", destination: "", certifications: "" },
    shipping: { weight: "", origin: "", destination: "" },
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (actionId: string): boolean => {
    const errors: { [field: string]: string } = {};

    if (actionId === "product") {
      const { name, description } = formInputs.product;
      if (!name.trim()) errors.name = "Product name is required";
      if (!description.trim()) errors.description = "Product description is required";
    } else if (actionId === "market") {
      const { product, targetCountry } = formInputs.market;
      if (!product.trim()) errors.product = "Product name is required";
      if (!targetCountry.trim()) errors.targetCountry = "Target country is required";
    } else if (actionId === "compliance") {
      const { productType, destination } = formInputs.compliance;
      if (!productType.trim()) errors.productType = "Product type is required";
      if (!destination.trim()) errors.destination = "Destination country is required";
    } else if (actionId === "shipping") {
      const { weight, origin, destination } = formInputs.shipping;
      if (!weight.trim()) errors.weight = "Weight/quantity is required";
      if (!origin.trim()) errors.origin = "Origin country is required";
      if (!destination.trim()) errors.destination = "Destination country is required";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors((prev) => ({ ...prev, [actionId]: errors }));
      return false;
    }

    setFormErrors((prev) => ({ ...prev, [actionId]: {} }));
    return true;
  };

  const buildMessage = (actionId: string): string => {
    if (actionId === "product") {
      const { name, description, specifications } = formInputs.product;
      return `Product: ${name}. Description: ${description}${specifications ? `. Specifications: ${specifications}` : ""}.`;
    } else if (actionId === "market") {
      const { product, targetCountry, currentMarkets } = formInputs.market;
      return `Product: ${product}. Target Market: ${targetCountry}${currentMarkets ? `. Currently exporting to: ${currentMarkets}` : ""}.`;
    } else if (actionId === "compliance") {
      const { productType, destination, certifications } = formInputs.compliance;
      return `Product Type: ${productType}. Destination: ${destination}${certifications ? `. Current certifications: ${certifications}` : ""}.`;
    } else if (actionId === "shipping") {
      const { weight, origin, destination } = formInputs.shipping;
      return `Shipment: ${weight}. From: ${origin}. To: ${destination}.`;
    }
    return "";
  };

  const handleActionSubmit = async (
    actionId: string,
    callback: (input: string) => Promise<void>
  ) => {
    if (!validateForm(actionId)) return;

    setIsSubmitting(true);
    try {
      const message = buildMessage(actionId);
      await callback(message);
      
      // Reset form
      if (actionId === "product") {
        setFormInputs((prev) => ({
          ...prev,
          product: { name: "", description: "", specifications: "" },
        }));
      } else if (actionId === "market") {
        setFormInputs((prev) => ({
          ...prev,
          market: { product: "", targetCountry: "", currentMarkets: "" },
        }));
      } else if (actionId === "compliance") {
        setFormInputs((prev) => ({
          ...prev,
          compliance: { productType: "", destination: "", certifications: "" },
        }));
      } else if (actionId === "shipping") {
        setFormInputs((prev) => ({
          ...prev,
          shipping: { weight: "", origin: "", destination: "" },
        }));
      }
      
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
      fields: [
        { key: "name", label: "Product Name", placeholder: "e.g., Ethiopian Coffee Beans" },
        { key: "description", label: "Description *", placeholder: "e.g., Premium grade, medium roast, 1kg bags" },
        { key: "specifications", label: "Specifications (Optional)", placeholder: "e.g., Organic certified, Fair Trade" },
      ],
      callback: onAnalyzeProduct,
    },
    {
      id: "market",
      icon: TrendingUp,
      label: "Market Strategy",
      description: "Get market entry strategy",
      fields: [
        { key: "product", label: "Product Name *", placeholder: "e.g., Coffee" },
        { key: "targetCountry", label: "Target Country *", placeholder: "e.g., USA, European Union" },
        { key: "currentMarkets", label: "Current Markets (Optional)", placeholder: "e.g., Indonesia, Malaysia" },
      ],
      callback: onGetMarketStrategy,
    },
    {
      id: "compliance",
      icon: CheckCircle2,
      label: "Compliance Check",
      description: "Get compliance requirements",
      fields: [
        { key: "productType", label: "Product Type *", placeholder: "e.g., Organic Coffee, Textiles" },
        { key: "destination", label: "Destination Country *", placeholder: "e.g., European Union, USA, Japan" },
        { key: "certifications", label: "Current Certifications (Optional)", placeholder: "e.g., ISO 9001, Fair Trade" },
      ],
      callback: onGetComplianceGuidance,
    },
    {
      id: "shipping",
      icon: Truck,
      label: "Shipping Guide",
      description: "Get shipping logistics",
      fields: [
        { key: "weight", label: "Weight/Quantity *", placeholder: "e.g., 1000kg, 50 tons, 5000 units" },
        { key: "origin", label: "Origin Country *", placeholder: "e.g., Indonesia, Ethiopia" },
        { key: "destination", label: "Destination Country *", placeholder: "e.g., USA, Germany, Singapore" },
      ],
      callback: onGetShippingGuidance,
    },
  ];

  return (
    <div className="space-y-3">
      {actions.map(({ id, icon: Icon, label, description, fields, callback }) => (
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
            <div className="border-t border-border/60 bg-muted/30 p-4 space-y-4">
              {/* Form Fields */}
              <div className="space-y-3">
                {fields.map(({ key, label: fieldLabel, placeholder }) => (
                  <div key={key}>
                    <label className="text-xs font-medium text-foreground mb-1.5 block">
                      {fieldLabel}
                    </label>
                    <input
                      type="text"
                      value={
                        formInputs[id as keyof typeof formInputs][
                          key as keyof (typeof formInputs)[keyof typeof formInputs]
                        ] as string
                      }
                      onChange={(e) =>
                        setFormInputs((prev) => ({
                          ...prev,
                          [id]: {
                            ...prev[id as keyof typeof prev],
                            [key]: e.target.value,
                          },
                        }))
                      }
                      placeholder={placeholder}
                      disabled={isLoading || isSubmitting}
                      className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-xs placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                    />
                    {formErrors[id]?.[key] && (
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3 flex-shrink-0" />
                        <span>{formErrors[id][key]}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Required Fields Note */}
              <p className="text-xs text-muted-foreground">* Required field</p>

              {/* Submit Button */}
              <Button
                onClick={() => handleActionSubmit(id, callback)}
                disabled={
                  isLoading ||
                  isSubmitting ||
                  Object.keys(formErrors[id] || {}).length > 0
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
