"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export type QuickActionItem = {
  label: string;
  description: string;
  status?: string;
  icon: LucideIcon;
};

type QuickActionsProps = {
  items: QuickActionItem[];
};

const QuickActions = ({ items }: QuickActionsProps) => (
  <div className="space-y-3">
    {items.map((action) => (
      <motion.button
        key={action.label}
        type="button"
        whileHover={{ y: -2 }}
        className="flex w-full items-start justify-between rounded-2xl border border-border/60 bg-card/90 px-4 py-3 text-left shadow-sm transition hover:border-primary/40"
      >
        <div className="flex items-start gap-3">
          <span className="rounded-xl bg-primary/10 p-2 text-primary">
            <action.icon className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">{action.label}</p>
            <p className="text-xs text-muted-foreground">{action.description}</p>
          </div>
        </div>
        {action.status && (
          <span className="rounded-full bg-foreground/5 px-3 py-1 text-xs font-semibold text-foreground">
            {action.status}
          </span>
        )}
      </motion.button>
    ))}
  </div>
);

export default QuickActions;
