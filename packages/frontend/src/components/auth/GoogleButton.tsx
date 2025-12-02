"use client";

import { motion } from "framer-motion";

type GoogleButtonProps = {
  onClick?: () => void;
};

const GoogleButton = ({ onClick }: GoogleButtonProps) => (
  <motion.button
    type="button"
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white"
  >
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-black text-blue-500 shadow">
      G
    </span>
    Masuk dengan Google
  </motion.button>
);

export default GoogleButton;
