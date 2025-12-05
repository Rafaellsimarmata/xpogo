"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";

type SignUpValues = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  businessName: string;
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const SignUpForm = () => {
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<SignUpValues>({
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      businessName: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
  const payload = {
    email: data.email,
    username: data.username,
    business_name: data.businessName,
    password: data.password,
  };

  const res = await fetch(`${BACKEND_URL}auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      reset();
    }, 1500);
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
        <label className="mb-2 block text-sm font-semibold text-slate-600">
          Nama Bisnis
        </label>
        <Input
          type="text"          
          placeholder="CV RempahIndoNusa"
          {...register("businessName", { required: "Nama Perusahaan Wajib diisi" })}
          error={errors.businessName?.message}
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-600">Username</label>
        <Input
          type="text"
          placeholder="username kamu"
          {...register("username", { required: "Username wajib diisi" })}
          error={errors.username?.message}
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-600">Password</label>
        <Input
          type="password"
          placeholder="Minimal 8 karakter"
          {...register("password", {
            required: "Password wajib diisi",
            minLength: { value: 8, message: "Minimal 8 karakter" },
          })}
          error={errors.password?.message}
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-600">
          Konfirmasi Password
        </label>
        <Input
          type="password"
          placeholder="Ulangi password"
          {...register("confirmPassword", {
            validate: (value) => value === getValues("password") || "Password tidak sama",
          })}
          error={errors.confirmPassword?.message}
        />
      </div>      
      {success && (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-600">
          Registrasi berhasil! Silakan cek email untuk aktivasi akun.
        </div>
      )}
      <Button
        type="submit"
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Buat Akun
      </Button>
      <p className="text-center text-sm text-slate-500">
        Sudah punya akun?{" "}
        <Link href="/signin" className="font-semibold text-blue-500">
          Masuk
        </Link>
      </p>
    </form>
  );
};

export default SignUpForm;