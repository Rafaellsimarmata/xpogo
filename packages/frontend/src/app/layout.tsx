import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import { AuthProvider } from "@/src/context/AuthContext";
import { UserProvider } from "@/src/context/UserContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "XPOGO - Export Intelligence Platform",
  description:
    "Platform market intelligence dan asistensi dokumen untuk membantu UMKM Indonesia menembus pasar ekspor.",
  keywords: ["ekspor", "UMKM", "market intelligence", "dokumen ekspor", "XPOGO"],
  metadataBase: new URL("https://xpogo.local"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="bg-background text-foreground antialiased">
        <AuthProvider>
          <UserProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
