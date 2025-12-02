"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, DollarSign } from "lucide-react";
import Button from "@/src/components/ui/Button";
import { CountryMatch } from "@/src/lib/data/countries";
import { formatScoreLabel, getScoreTone, readinessColor } from "@/src/lib/utils";

type CountryCardProps = {
  country: CountryMatch;
};

const CountryCard = ({ country }: CountryCardProps) => (
  <motion.div
    whileHover={{ y: -6 }}
    className="glass-panel rounded-3xl border border-white/40 bg-white/80 p-5 shadow-lg"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{country.region}</p>
        <h3 className="text-xl font-semibold text-slate-900">{country.name}</h3>
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100/80 text-sm font-semibold text-blue-600">
        {country.code}
      </div>
    </div>
    <div className="mt-4 flex items-center gap-4">
      <div>
        <p className="text-sm text-slate-500">Match Score</p>
        <p className="text-3xl font-semibold text-slate-900">{country.matchScore}</p>
        <p className={`text-xs font-semibold ${getScoreTone(country.matchScore)}`}>
          {formatScoreLabel(country.matchScore)}
        </p>
      </div>
      <div className="flex-1">
        <div className="text-sm text-slate-500">Average Import Price</div>
        <div className="mt-1 flex items-center gap-2 text-slate-700">
          <DollarSign className="h-4 w-4 text-blue-500" />
          <span>${country.avgImportPrice.toFixed(1)}/kg</span>
        </div>
        <div className="mt-3 text-sm text-slate-500">Estimated Export Time</div>
        <div className="mt-1 flex items-center gap-2 text-slate-700">
          <Clock className="h-4 w-4 text-blue-500" />
          <span>{country.estimatedTime} hari</span>
        </div>
      </div>
    </div>
    <div className="mt-4 flex items-center justify-between">
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${readinessColor(country.readiness)}`}>
        {country.readiness}
      </span>
      <Button variant="outline" size="sm" icon={<ArrowUpRight className="h-4 w-4" />} asChild>
        <Link href={`/market-analysis/${country.id}`}>Lihat Detail</Link>
      </Button>
    </div>
  </motion.div>
);

export default CountryCard;
