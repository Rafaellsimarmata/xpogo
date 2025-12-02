import SignUpForm from "@/src/components/auth/SignUpForm";
import Card from "@/src/components/ui/Card";

const SignUpPage = () => (
  <section className="bg-gradient-to-b from-blue-50/40 to-white py-20">
    <div className="mx-auto grid max-w-5xl gap-8 px-6 md:grid-cols-2">
      <div className="space-y-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-500">
          Buat Akun Gratis
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          Daftar dan dapatkan akses Market Intelligence & DocuAssist
        </h1>
        <ul className="space-y-3 text-sm text-slate-600">
          <li>✓ Analisis 5 produk gratis setiap bulan</li>
          <li>✓ Checklist dokumen otomatis sesuai negara tujuan</li>
          <li>✓ Rekomendasi importer setelah dokumen lengkap</li>
        </ul>
      </div>
      <Card className="rounded-[28px] p-8 shadow-2xl">
        <SignUpForm />
      </Card>
    </div>
  </section>
);

export default SignUpPage;
