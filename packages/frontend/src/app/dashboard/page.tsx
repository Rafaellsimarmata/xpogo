'use client';

import { useMemo } from "react";
import { TrendingUp, Globe2, FileCheck2 } from "lucide-react";
import { motion } from "framer-motion";
import StatsCard from "@/src/components/dashboard/StatsCard";
import QuickActions from "@/src/components/dashboard/QuickActions";
import RecentActivity from "@/src/components/dashboard/RecentActivity";
import { useUser } from "@/src/context/UserContext";
import { countries } from "@/src/lib/data/countries";

const DashboardPage = () => {
  const { profile } = useUser();
  const recommended = useMemo(() => countries.slice(0, 3), []);

  return (
    <section className="bg-gradient-to-b from-blue-50/30 to-white py-12">
      <div className="mx-auto max-w-6xl space-y-8 px-6">
        <div className="rounded-[32px] border border-white/50 bg-white/80 p-8 shadow-lg">
          <p className="text-sm text-slate-500">Selamat datang kembali</p>
          <h1 className="text-3xl font-semibold text-slate-900">Halo, {profile.fullName}</h1>
          <p className="mt-2 text-sm text-slate-500">
            Kelola ekspor untuk {profile.company}. Berikut status terbaru hari ini.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatsCard
            label="Produk Dilacak"
            value="12"
            subtext="3 produk baru pekan ini"
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <StatsCard
            label="Negara Dianalisis"
            value="8"
            subtext="2 pasar baru siap"
            icon={<Globe2 className="h-5 w-5" />}
          />
          <StatsCard
            label="Dokumen Lengkap"
            value="10/12"
            subtext="80% progress"
            icon={<FileCheck2 className="h-5 w-5" />}
          />
        </div>

        <QuickActions />

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/40 bg-white/80 p-6 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Recommended Countries
                  </h3>
                  <p className="text-sm text-slate-500">
                    Berdasarkan minat buyer dan dokumen yang siap.
                  </p>
                </div>
                <span className="text-xs font-semibold text-blue-500">Live updated</span>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {recommended.map((country) => (
                  <motion.div
                    key={country.id}
                    whileHover={{ y: -4 }}
                    className="rounded-2xl border border-blue-50 bg-blue-50/50 p-4 text-sm"
                  >
                    <p className="text-xs uppercase tracking-[0.4em] text-blue-400">
                      {country.code}
                    </p>
                    <p className="text-lg font-semibold text-slate-900">{country.name}</p>
                    <p className="text-xs text-slate-500">Score {country.matchScore}/100</p>
                    <div className="mt-3 h-1.5 rounded-full bg-white/70">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                        style={{ width: `${country.matchScore}%` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <RecentActivity />
          </div>
          <div className="rounded-3xl border border-white/40 bg-white/80 p-6 shadow">
            <h3 className="text-lg font-semibold text-slate-900">Export Readiness</h3>
            <p className="text-sm text-slate-500">Persentase kesiapan dokumen & pasar.</p>
            <div className="mt-6 flex items-center justify-center">
              <div className="relative h-40 w-40">
                <div className="absolute inset-0 rounded-full bg-[conic-gradient(#2563eb_0deg,#60a5fa_288deg,#e2e8f0_288deg)]" />
                <div className="absolute inset-2 rounded-full bg-white" />
                <div className="absolute inset-6 flex flex-col items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-inner">
                  <span className="text-3xl font-semibold">80%</span>
                  <span className="text-xs text-slate-500">Siap ekspor</span>
                </div>
              </div>
            </div>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li>✓ Checklist dokumen 80% selesai</li>
              <li>✓ Buyer meeting dijadwalkan</li>
              <li>• Sample batch siap dikirim</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
