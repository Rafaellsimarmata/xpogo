import SignInForm from "@/src/components/auth/SignInForm";
import Card from "@/src/components/ui/Card";

const SignInPage = () => (
  <section className="bg-gradient-to-br from-background via-primary/10 to-background py-24">
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4">
      <Card className="w-full rounded-[32px] border border-white/40 bg-white/95 p-10 shadow-2xl">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Masuk</p>
          <h1 className="mt-3 text-3xl font-bold text-foreground">Dashboard XPOGO</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Gunakan email bisnis yang terdaftar untuk melanjutkan.
          </p>
        </div>
        <SignInForm />
      </Card>
    </div>
  </section>
);

export default SignInPage;
