"use client";

import { motion } from "framer-motion";

export type ActivityItem = {
  title: string;
  detail: string;
  time: string;
  status: "done" | "progress" | "waiting";
};

type RecentActivityProps = {
  items: ActivityItem[];
};

const statusStyles: Record<ActivityItem["status"], string> = {
  done: "bg-emerald-500",
  progress: "bg-amber-400",
  waiting: "bg-slate-300",
};

const RecentActivity = ({ items }: RecentActivityProps) => (
  <div className="rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm">
    <h3 className="text-base font-semibold text-foreground">Linimasa Aktivitas</h3>
    <div className="mt-5 space-y-4">
      {items.map((activity, index) => (
        <motion.div
          key={`${activity.title}-${index}`}
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="flex items-start gap-3"
        >
          <span className={`mt-1 h-2 w-2 rounded-full ${statusStyles[activity.status]}`} />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{activity.title}</p>
            <p className="text-xs text-muted-foreground">{activity.detail}</p>
          </div>
          <span className="text-xs text-muted-foreground">{activity.time}</span>
        </motion.div>
      ))}
    </div>
  </div>
);

export default RecentActivity;
