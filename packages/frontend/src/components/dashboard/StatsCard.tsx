"use client";

import { motion } from "framer-motion";
import Card from "@/src/components/ui/Card";

type StatsCardProps = {
  label: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
};

const StatsCard = ({ label, value, subtext, icon }: StatsCardProps) => (
  <motion.div whileHover={{ y: -4 }}>
    <Card className="glass-panel rounded-3xl border border-white/50 bg-white/80 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
          <p className="text-xs text-slate-400">{subtext}</p>
        </div>
        <div className="rounded-2xl bg-blue-50 p-3 text-blue-500">{icon}</div>
      </div>
    </Card>
  </motion.div>
);

export default StatsCard;
