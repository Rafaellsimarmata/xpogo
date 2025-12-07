"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import { useUser } from "@/src/context/UserContext";

type OnboardingValues = {
  fullName: string;
  username: string;
  company: string;
  businessType: string;
};

const businessTypes = [
  "Kopi & Minuman",
  "Pertanian",
  "Kerajinan",
  "Furniture",
  "Tekstil",
  "Rempah",
];

const OnboardingPage = () => {
  const { profile, updateProfile, setOnboardingComplete } = useUser();
  const completion = useMemo(() => (profile?.onboardingComplete ? 100 : 70), [profile]);
  const { register, handleSubmit } = useForm<OnboardingValues>({
    defaultValues: {
      fullName: profile?.fullName ?? "",
      username: profile?.username ?? "",
      company: profile?.company ?? "",
      businessType: profile?.businessType ?? "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    updateProfile(values);
    setOnboardingComplete(true);
  });

  return (
    <section className="bg-linear-to-b from-white to-blue-50/40 py-16">
      <div className="mx-auto max-w-3xl rounded-4xl border border-white/40 bg-white/80 p-10 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-blue-500">Onboarding</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">Lengkapi Profil UMKM Anda</h1>
        <p className="mt-2 text-sm text-slate-500">Data ini digunakan untuk personalisasi rekomendasi.</p>
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Progress</span>
            <span>{completion}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-linear-to-r from-blue-600 to-cyan-400"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>
        <form onSubmit={onSubmit} className="mt-8 grid gap-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">Nama Lengkap</label>
            <Input placeholder="Nama sesuai KTP" {...register("fullName")} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">Username</label>
            <Input placeholder="nama-umkm" {...register("username")} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">Nama Perusahaan</label>
            <Input placeholder="PT / CV" {...register("company")} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">Jenis Usaha</label>
            <select
              {...register("businessType")}
              className="w-full rounded-xl border border-white/60 bg-white/80 px-4 py-3 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              {businessTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            <Button type="submit" className="flex-1">
              Simpan & Lanjutkan
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => setOnboardingComplete(true)}
            >
              Skip untuk sekarang
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default OnboardingPage;
