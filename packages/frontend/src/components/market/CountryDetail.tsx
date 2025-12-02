"use client";

import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import Button from "@/src/components/ui/Button";
import { CountryMatch } from "@/src/lib/data/countries";
import { formatCurrency, getScoreTone, readinessColor } from "@/src/lib/utils";

type CountryDetailProps = {
  country: CountryMatch;
};

const CountryDetail = ({ country }: CountryDetailProps) => (
  <div className="space-y-8">
    <div className="rounded-[32px] border border-white/40 bg-white/80 p-8 shadow">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.5em] text-blue-500">Market Detail</p>
          <h1 className="text-4xl font-semibold text-slate-900">{country.name}</h1>
          <p className="mt-2 text-sm text-slate-500">{country.region}</p>
          <p className="mt-4 text-sm text-slate-600">{country.easeOfLogistics}</p>
        </div>
        <div className="rounded-3xl bg-slate-900/90 p-6 text-white shadow">
          <p className="text-sm uppercase tracking-[0.4em] text-white/60">Match Score</p>
          <p className="mt-2 text-4xl font-semibold">{country.matchScore}</p>
          <p className={`mt-1 text-sm ${getScoreTone(country.matchScore)}`}>Kecocokan tinggi</p>
          <span className={`mt-3 inline-block rounded-full px-4 py-1 text-xs ${readinessColor(country.readiness)}`}>
            {country.readiness}
          </span>
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-blue-50 bg-blue-50/60 p-4">
          <p className="text-xs text-blue-500">Nilai Impor</p>
          <p className="text-2xl font-semibold text-slate-900">{formatCurrency(country.importValue)}</p>
          <p className="text-xs text-slate-500">per tahun</p>
        </div>
        <div className="rounded-2xl border border-blue-50 bg-blue-50/60 p-4">
          <p className="text-xs text-blue-500">GDP</p>
          <p className="text-2xl font-semibold text-slate-900">{country.gdp}</p>
        </div>
        <div className="rounded-2xl border border-blue-50 bg-blue-50/60 p-4">
          <p className="text-xs text-blue-500">Populasi</p>
          <p className="text-2xl font-semibold text-slate-900">{country.population}</p>
        </div>
        <div className="rounded-2xl border border-blue-50 bg-blue-50/60 p-4">
          <p className="text-xs text-blue-500">Lead Time</p>
          <p className="text-2xl font-semibold text-slate-900">{country.estimatedTime} hari</p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold text-blue-600">
        {country.tradeAgreements.map((agreement) => (
          <span key={agreement} className="rounded-full border border-blue-200 px-4 py-1">
            {agreement}
          </span>
        ))}
      </div>
      <Button variant="secondary" className="mt-8" asChild icon={<ArrowLeft className="h-4 w-4" />}>
        <Link href="/market-analysis">Kembali ke market analysis</Link>
      </Button>
    </div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="grid gap-6 lg:grid-cols-2"
    >
      <div className="rounded-3xl border border-white/40 bg-white/80 p-6 shadow">
        <h3 className="text-lg font-semibold text-slate-900">Top Import Products</h3>
        <div className="mt-4 space-y-4">
          {country.topImports.map((item) => (
            <div key={item.name} className="rounded-2xl border border-slate-100 bg-white/70 p-4">
              <p className="font-semibold text-slate-900">{item.name}</p>
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Volume: {item.volume}</span>
                <span className="text-green-500">{item.growth}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-3xl border border-white/40 bg-white/80 p-6 shadow">
        <h3 className="text-lg font-semibold text-slate-900">Business Culture Tips</h3>
        <ul className="mt-4 space-y-3 text-sm text-slate-600">
          {country.businessTips.map((tip) => (
            <li key={tip} className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              {tip}
            </li>
          ))}
        </ul>
        <div className="mt-6 rounded-2xl border border-dashed border-blue-200 p-4">
          <p className="text-sm font-semibold text-slate-900">Kontak Perdagangan</p>
          <div className="mt-3 space-y-3 text-sm text-slate-600">
            {country.contacts.map((contact) => (
              <div key={contact.office}>
                <p className="font-semibold text-slate-900">{contact.office}</p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-500" />
                  {contact.phone}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  {contact.email}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  </div>
);

export default CountryDetail;
