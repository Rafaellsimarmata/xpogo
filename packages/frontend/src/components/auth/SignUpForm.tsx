"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import GoogleButton from "./GoogleButton";

type SignUpValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

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
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async () => {
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      reset();
    }, 1500);
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
      {success && <p className="text-sm text-green-600">Registrasi berhasil! Silakan masuk.</p>}
      <Button type="submit" className="w-full">
        Buat Akun
      </Button>
      <GoogleButton onClick={() => console.log("google signup")} />
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
