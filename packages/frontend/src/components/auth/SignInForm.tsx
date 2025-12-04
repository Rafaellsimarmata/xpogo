"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import { useAuth } from "@/src/context/AuthContext";

type SignInValues = {
  email: string;
  password: string;
  remember: boolean;
};

const SignInForm = () => {
  const { signIn, loading } = useAuth();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError("");
    try {
      await signIn({ email: values.email, password: values.password });
    } catch (err) {
      console.error(err);
      setError("Gagal masuk, coba lagi.");
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-600">Email</label>
        <Input
          type="email"
          placeholder="nama@perusahaan.com"
          {...register("email", { required: "Email wajib diisi" })}
          error={errors.email?.message}
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-600">Password</label>
        <Input
          type="password"
          placeholder="Masukkan password"
          {...register("password", {
            required: "Password wajib diisi",
            minLength: { value: 6, message: "Minimal 6 karakter" },
          })}
          error={errors.password?.message}
        />
      </div>
      <div className="flex items-center justify-between text-sm">
        <label className="inline-flex items-center gap-2 text-slate-600">
          <input type="checkbox" {...register("remember")} className="rounded border-slate-300" />
          Ingat saya
        </label>
        <Link href="#" className="text-blue-500 hover:text-blue-600">
          Lupa password?
        </Link>
      </div>
      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50/80 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
      <Button
        type="submit"
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={loading}
      >
        {loading ? "Memproses..." : "Masuk"}
      </Button>
      <p className="text-center text-sm text-slate-500">
        Belum punya akun?{" "}
        <Link href="/signup" className="font-semibold text-blue-500">
          Daftar
        </Link>
      </p>
    </form>
  );
};

export default SignInForm;
