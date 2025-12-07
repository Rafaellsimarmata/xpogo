"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import { register as registerAccount } from "@/src/services/authService";
import type { SignUpPayload } from "@/src/types/auth";
import { useAuth } from "@/src/context/AuthContext";
import { ROUTES } from "@/src/constants";

type SignUpValues = Omit<SignUpPayload, "business_name"> & {
  businessName: string;
  confirmPassword: string;
};

const SignUpForm = () => {
  const [error, setError] = useState("");
  const { signIn, loading: authLoading } = useAuth();
  const registerMutation = useMutation({ mutationFn: registerAccount });
  const {
    register,
    handleSubmit,
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
    setError("");

    try {
      await registerMutation.mutateAsync({
        email: data.email,
        username: data.username,
        password: data.password,
        business_name: data.businessName,
      });

      await signIn(
        {
          email: data.email,
          password: data.password,
        },
        { redirectTo: ROUTES.workspace.profile },
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registrasi gagal, coba lagi.");
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
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

      <div className="grid md:grid-cols-2 gap-4">
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
      </div>

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50/80 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={registerMutation.isPending || authLoading}
      >
        {registerMutation.isPending || authLoading ? "Memproses..." : "Buat Akun"}
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
