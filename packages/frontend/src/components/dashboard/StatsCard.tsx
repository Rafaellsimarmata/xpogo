"use client";

import { motion } from "framer-motion";

type StatsCardProps = {
  label: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
  footnote?: string;
};

const StatsCard = ({ label, value, subtext, icon, footnote }: StatsCardProps) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="rounded-2xl border border-border/60 bg-card/90 p-5 shadow-sm shadow-slate-900/5"
  >
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">{label}</p>
        <p className="mt-3 text-3xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{subtext}</p>
      </div>
      <div className="rounded-xl bg-primary/10 p-3 text-primary">{icon}</div>
    </div>
    {footnote && <p className="mt-4 text-xs text-muted-foreground">{footnote}</p>}
  </motion.div>
);

export default StatsCard;
