import SignUpForm from "@/src/components/auth/SignUpForm";
import Card from "@/src/components/ui/Card";

const SignUpPage = () => (
  <section className="bg-gradient-to-br from-background via-accent/10 to-background py-24">
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4">
      <Card className="w-full rounded-[32px] border border-white/40 bg-white/95 p-10 shadow-2xl">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Daftar</p>
          <h1 className="mt-3 text-3xl font-bold text-foreground">Buat Akun XPOGO</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Isi form singkat di bawah ini untuk memulai.
          </p>
        </div>
        <SignUpForm />
      </Card>
    </div>
  </section>
);

export default SignUpPage;
