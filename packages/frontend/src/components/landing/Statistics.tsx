"use client";

import { useEffect, useState } from "react";
import { motion, animate } from "framer-motion";

type StatCardProps = {
  label: string;
  value: number;
  suffix?: string;
};

const StatCard = ({ label, value, suffix = "+" }: StatCardProps) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    });
    return controls.stop;
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      className="rounded-3xl border border-blue-100/80 bg-gradient-to-b from-white to-blue-50/60 p-6 text-center shadow shadow-blue-100"
    >
      <p className="text-sm uppercase tracking-[0.4em] text-blue-400">{label}</p>
      <motion.p className="mt-3 text-4xl font-semibold text-slate-900">
        {displayValue}
        <span>{suffix}</span>
      </motion.p>
    </motion.div>
  );
};

const Statistics = () => (
  <section className="bg-gradient-to-b from-white to-blue-50/40 py-16">
    <div className="mx-auto grid max-w-5xl gap-6 px-6 md:grid-cols-4">
      <StatCard label="Produk Tersedia" value={120} suffix="+" />
      <StatCard label="Negara Tujuan" value={35} suffix="+" />
      <StatCard label="Success Rate" value={96} suffix="%" />
      <StatCard label="Checklist selesai" value={1800} suffix="+" />
    </div>
  </section>
);

export default Statistics;
