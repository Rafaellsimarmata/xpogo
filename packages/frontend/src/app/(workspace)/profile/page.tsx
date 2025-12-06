'use client';

import { useProfileController } from "@/src/controllers/workspace/profileController";
import Input from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";

const ProfilePage = () => {
  const { form, productOptions, onSubmit } = useProfileController();
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <section className="bg-background py-12">
      <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6">
        <div className="rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Profil Bisnis
          </p>
          <h1 className="mt-3 text-3xl font-bold text-foreground">Perbarui profil usaha Anda</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Informasi ini dipakai untuk menampilkan rekomendasi produk dan negara tujuan di dashboard.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Nama Lengkap</label>
              <Input
                placeholder="Nama sesuai KTP"
                {...register("fullName", { required: "Nama wajib diisi" })}
                error={errors.fullName?.message}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Username</label>
              <Input
                placeholder="nama-umkm"
                helperText="Ditampilkan pada workspace & dokumen."
                {...register("username", { required: "Username wajib diisi" })}
                error={errors.username?.message}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">Nama Perusahaan</label>
            <Input
              placeholder="Contoh: PT Nusantara Craft"
              helperText="Gunakan nama resmi agar otomatis muncul pada checklist."
              {...register("company", { required: "Nama perusahaan wajib diisi" })}
              error={errors.company?.message}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">Produk Fokus</label>
            <select
              {...register("focusProduct", { required: "Pilih salah satu produk" })}
              className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {productOptions.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
            {errors.focusProduct && (
              <p className="mt-1 text-xs text-destructive">{errors.focusProduct.message}</p>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              Produk ini menjadi prioritas pertama pada dashboard dan analisis pasar.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan & buka Dashboard"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ProfilePage;
