"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LogIn, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Button from "@/src/components/ui/Button";
import { cn } from "@/src/lib/utils";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/market-analysis", label: "Market Analysis" },
  { href: "/dashboard", label: "Dashboard" },
];

const Navbar = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/40 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <span className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 px-3 py-1 text-sm text-white shadow-lg">
            XPOGO
          </span>
          <span className="hidden text-sm text-slate-500 sm:block">Export Intelligence</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative transition hover:text-blue-600",
                  active && "text-blue-600",
                )}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="navbar-underline"
                    className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="secondary" size="sm" icon={<LogIn className="h-4 w-4" />} asChild>
            <Link href="/signin">Masuk</Link>
          </Button>
          <Button size="sm" icon={<LayoutDashboard className="h-4 w-4" />} asChild>
            <Link href="/dashboard">Buka Dashboard</Link>
          </Button>
        </div>

        <button
          className="rounded-2xl border border-white/50 p-2 text-slate-600 hover:text-blue-600 md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-white/40 bg-white/90 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-700"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button variant="secondary" className="w-full" asChild>
              <Link href="/signin">Masuk</Link>
            </Button>
            <Button className="w-full" asChild>
              <Link href="/signup">Daftar</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
