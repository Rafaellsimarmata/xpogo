"use client";

import { motion } from "framer-motion";
import { StoreOption } from "@/src/lib/data/countries";
import { Lock, Building2, Mail } from "lucide-react";

type StoreSelectorProps = {
  stores: StoreOption[];
  unlocked: boolean;
};

const StoreSelector = ({ stores, unlocked }: StoreSelectorProps) => (
  <div className="rounded-3xl border border-white/40 bg-white/80 p-6 shadow">
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Store & Importer</h3>
        <p className="text-sm text-slate-500">Tersedia setelah checklist dokumen lengkap.</p>
      </div>
      {!unlocked && (
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
          <Lock className="h-3 w-3" />
          Locked
        </span>
      )}
    </div>
    {unlocked ? (
      <div className="grid gap-4 md:grid-cols-2">
        {stores.map((store) => (
          <motion.div
            key={store.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="rounded-2xl border border-blue-100 bg-white/60 p-4"
          >
            <p className="text-lg font-semibold text-slate-900">{store.name}</p>
            <p className="text-sm text-slate-500">{store.specialization}</p>
            <p className="mt-2 text-xs text-blue-500">Rating {store.rating}</p>
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
              <Building2 className="h-4 w-4 text-blue-500" />
              {store.location}
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
              <Mail className="h-4 w-4 text-blue-500" />
              {store.contact}
            </div>
            <button className="mt-3 w-full rounded-2xl border border-blue-200 bg-blue-50/70 px-4 py-2 text-sm font-semibold text-blue-600">
              Connect
            </button>
          </motion.div>
        ))}
      </div>
    ) : (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-6 text-center text-sm text-slate-500">
        Checklist dokumen minimal 90% untuk membuka daftar importer terverifikasi.
      </div>
    )}
  </div>
);

export default StoreSelector;
