"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, DollarSign } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { CountryMatch } from "@/src/lib/data/countries";
import { formatScoreLabel, getScoreTone, readinessColor } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/Button";

type CountryCardProps = {
  country: CountryMatch;
  isActive?: boolean;
  onSelect?: (country: CountryMatch) => void;
};

const CountryCard = ({ country, isActive = false, onSelect }: CountryCardProps) => {
  const interactive = typeof onSelect === "function";
  const Container = interactive ? motion.button : motion.div;

  return (
    <Container
      whileHover={{ y: interactive ? -2 : -6 }}
      type={interactive ? "button" : undefined}
      onClick={interactive ? () => onSelect?.(country) : undefined}
      className={cn(
        "rounded-3xl border border-white/40 bg-white/80 p-5 text-left shadow-lg transition",
        interactive && "w-full border-border/60 bg-card/90 shadow-sm hover:border-primary/30",
        isActive && "ring-2 ring-primary/20",
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{country.region}</p>
          <h3 className="text-xl font-semibold text-slate-900">{country.name}</h3>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100/80 text-sm font-semibold text-blue-600">
          {country.code}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Match Score</p>
          <p className="text-3xl font-bold text-slate-900">{country.matchScore}</p>
          <p className={`text-xs font-semibold ${getScoreTone(country.matchScore)}`}>
            {formatScoreLabel(country.matchScore)}
          </p>
        </div>
        <div className="flex-1">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Avg import price
          </div>
          <div className="mt-1 flex items-center gap-2 text-slate-700">
            <DollarSign className="h-4 w-4 text-blue-500" />
            <span>${country.avgImportPrice.toFixed(1)}/kg</span>
          </div>
          <div className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Lead time
          </div>
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
        {interactive ? (
          <span className={cn("text-xs font-semibold", isActive ? "text-primary" : "text-muted-foreground")}>
            {isActive ? "Sedang dianalisis" : "Pilih negara"}
          </span>
        ) : (
          <Button variant="outline" size="sm" className="text-xs" asChild>
            <Link href={`/market-analysis/${country.id}`} className="inline-flex items-center gap-2">
              Detail
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </Container>
  );
};

export default CountryCard;
