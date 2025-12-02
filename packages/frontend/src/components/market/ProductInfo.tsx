"use client";

import { motion } from "framer-motion";
import { Product } from "@/src/lib/data/products";

type ProductInfoProps = {
  product: Product;
};

const ProductInfo = ({ product }: ProductInfoProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-3xl border border-white/40 bg-white/80 p-6 shadow-lg"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm uppercase tracking-widest text-blue-500">Produk Dipilih</p>
        <h3 className="text-2xl font-semibold text-slate-900">{product.name}</h3>
        <p className="text-sm text-slate-500">{product.hsCode}</p>
      </div>
      <span className="rounded-full border border-blue-100 bg-blue-50 px-4 py-1 text-xs font-semibold text-blue-600">
        {product.category}
      </span>
    </div>
    <p className="mt-4 text-sm text-slate-600">{product.description}</p>
    <div className="mt-6 grid gap-4 md:grid-cols-4">
      <div className="rounded-2xl bg-blue-50/70 p-3 text-center">
        <p className="text-xs uppercase text-blue-500">Demand Index</p>
        <p className="text-2xl font-semibold text-blue-700">{product.stats.demandIndex}</p>
      </div>
      <div className="rounded-2xl bg-blue-50/70 p-3 text-center">
        <p className="text-xs uppercase text-blue-500">Price Index</p>
        <p className="text-2xl font-semibold text-blue-700">{product.stats.priceIndex}</p>
      </div>
      <div className="rounded-2xl bg-blue-50/70 p-3 text-center">
        <p className="text-xs uppercase text-blue-500">Growth</p>
        <p className="text-2xl font-semibold text-blue-700">{product.stats.growth}</p>
      </div>
      <div className="rounded-2xl bg-blue-50/70 p-3 text-center">
        <p className="text-xs uppercase text-blue-500">Readiness</p>
        <p className="text-lg font-semibold text-blue-700">{product.stats.readiness}</p>
      </div>
    </div>
    <div className="mt-6 rounded-2xl border border-dashed border-blue-200 p-4 text-sm text-slate-600">
      <p className="font-semibold text-slate-900">Best Practices</p>
      <ul className="mt-2 list-disc space-y-2 pl-5">
        {product.bestPractices.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
    </div>
  </motion.div>
);

export default ProductInfo;
