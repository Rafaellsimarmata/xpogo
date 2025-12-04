"use client";

import { motion } from "framer-motion";

const GlowingBorder = ({ children }: { children: React.ReactNode }) => (
  <div className="relative">
    <motion.div
      animate={{
        background: [
          "linear-gradient(90deg, #3b82f6, #06b6d4, #3b82f6)",
          "linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6)",
        ],
      }}
      transition={{ duration: 3, repeat: Infinity }}
      className="absolute -inset-px rounded-[2rem] blur-sm opacity-70"
    />
    <div className="relative bg-white rounded-[31px]">
      {children}
    </div>
  </div>
);

export default GlowingBorder;
