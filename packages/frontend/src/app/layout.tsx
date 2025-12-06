import type { Metadata } from "next";
import { Cabin } from "next/font/google";
import "../styles/globals.css";
import { AuthProvider } from "@/src/context/AuthContext";
import { UserProvider } from "@/src/context/UserContext";
import { QueryProvider } from "@/src/components/providers/QueryProvider";
import { WorkspaceProvider } from "@/src/store/workspaceStore";
import WorkspaceLayoutProvider from "@/src/components/providers/WorkspaceLayoutProvider";

const cabin = Cabin({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "XPOGO - Export On The Go",
  description:
    "Platform market intelligence dan asistensi dokumen untuk membantu UMKM Indonesia menembus pasar ekspor.",
  keywords: ["ekspor", "UMKM", "market intelligence", "dokumen ekspor", "XPOGO"],
  metadataBase: new URL("https://xpogo.local"),
  icons: {
    icon: '/logo/XPOGO_small.png', 
    shortcut: '/logo/XPOGO_small.png',
    apple: '/logo/XPOGO_small.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${cabin.variable} dark`}>
      <body className="bg-background text-foreground antialiased">
        <QueryProvider>
          <AuthProvider>
            <UserProvider>
              <WorkspaceProvider>
                <WorkspaceLayoutProvider>{children}</WorkspaceLayoutProvider>
              </WorkspaceProvider>
            </UserProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
