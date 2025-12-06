import Image from "next/image";
import SignInForm from "@/src/components/auth/SignInForm";

const SignInPage = () => (
  <div className="relative w-full min-h-screen">
    {/* Background Image */}
    <Image 
      src="/img/Logistic2.png" 
      alt="Background"
      fill
      className="object-cover"
      priority
    />
    
    {/* Overlay - berbeda untuk dark/light mode */}
    <div className="absolute inset-0 bg-black/70 z-10"></div>
    
    {/* Konten - Two Column Layout */}
    <div className="relative z-20 flex items-center justify-center min-h-screen p-4 md:p-8 pt-24 md:pt-20">
      <div className="w-full max-w-6xl bg-white/5 backdrop-blur-md rounded-[30px] md:rounded-[30px] shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          
          {/* Kolom Kiri - Welcome Section - HIDDEN di mobile */}
          <div className="hidden md:flex flex-col justify-between p-8 md:p-12 lg:p-16 text-white min-h-[600px]">
            {/* Top Badge - User Count */}
            <div className="flex items-center gap-3">
              <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full font-bold text-sm shadow-lg">
                500+
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm uppercase tracking-wide">
                  UMKM BERGABUNG!
                </span>
                <span className="text-xs text-white/70">
                  Ekspor jadi lebih mudah
                </span>
              </div>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-primary drop-shadow-lg">
                Selamat Datang Kembali
              </h1>
              <p className="text-md md:text-md text-white/80 max-w-md">
                Lanjutkan perjalanan ekspor Anda dengan platform market intelligence terpercaya untuk UMKM Indonesia.
              </p>
            </div>
          </div>

          {/* Kolom Kanan - Form Section */}
          <div className="bg-slate-900 rounded-[30px] md:rounded-r-[30px] md:rounded-l-none p-8 md:p-10 lg:p-12 overflow-y-hidden max-h-screen">
            <div className="max-w-md mx-auto">
              <div className="mb-8 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Masuk</p>
                <h2 className="mt-3 text-3xl font-bold text-white">
                  Dashboard XPOGO
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Gunakan email bisnis yang terdaftar untuk melanjutkan.
                </p>
              </div>
              
              {/* SignInForm Component */}
              <SignInForm />
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
);

export default SignInPage;