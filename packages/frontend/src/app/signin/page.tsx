import SignInForm from "@/src/components/auth/SignInForm";
import Card from "@/src/components/ui/Card";

const SignInPage = () => (
  <section className="bg-gradient-to-b from-slate-50 via-blue-50/50 to-white py-20">
    <div className="mx-auto grid max-w-5xl gap-8 px-6 md:grid-cols-2">
      <div className="space-y-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-500">
          Selamat Datang Kembali
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          Kelola ekspor dengan dashboard yang lebih cerdas
        </h1>
        <p className="text-slate-500">
          Masuk dan lanjutkan analisis pasar, checklist dokumen, atau hubungkan dengan importer.
        </p>
        <div className="rounded-3xl border border-white/40 bg-white/70 p-6 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">Tips</p>
          <p className="mt-2">
            Aktifkan autentikasi dua faktor untuk melindungi data dokumen dan kontrak ekspor Anda.
          </p>
        </div>
      </div>
      <Card className="rounded-[28px] p-8 shadow-2xl">
        <SignInForm />
      </Card>
    </div>
  </section>
);

export default SignInPage;
