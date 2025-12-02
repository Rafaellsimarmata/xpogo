"use client";

import { motion } from "framer-motion";

const activities = [
  {
    title: "Checklist dokumen Jepang 80% selesai",
    time: "Baru saja",
    status: "success",
  },
  {
    title: "Analisis pasar untuk Kopi disimpan",
    time: "1 jam lalu",
    status: "info",
  },
  {
    title: "Upload kontrak dagang draft",
    time: "Kemarin",
    status: "warning",
  },
];

const statusColor: Record<string, string> = {
  success: "bg-green-100 text-green-700",
  info: "bg-blue-100 text-blue-700",
  warning: "bg-amber-100 text-amber-700",
};

const RecentActivity = () => (
  <div className="rounded-3xl border border-white/40 bg-white/80 p-6 shadow">
    <h3 className="text-lg font-semibold text-slate-900">Aktivitas Terbaru</h3>
    <div className="mt-4 space-y-4">
      {activities.map((activity) => (
        <motion.div
          key={activity.title}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="flex items-start gap-4"
        >
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[activity.status]}`}>
            {activity.time}
          </span>
          <p className="text-sm text-slate-600">{activity.title}</p>
        </motion.div>
      ))}
    </div>
  </div>
);

export default RecentActivity;
