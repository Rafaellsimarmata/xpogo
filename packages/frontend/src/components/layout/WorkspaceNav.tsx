"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { useState } from "react";
import { cn } from "@/src/lib/utils";
import { useAuth } from "@/src/context/AuthContext";
import { useUser } from "@/src/context/UserContext";

const workspaceNav = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Market Intelligence", href: "/market-analysis" },
  { label: "Document Center", href: "/documents" },
];

const WorkspaceNav = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { signOut } = useAuth();
  const { profile } = useUser();

  const initials = profile.fullName
    .split(" ")
    .map((name) => name.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("") || "U";

  return (
    <header className="border-b border-border/60 bg-card/90 shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
            Workspace
          </p>
          <p className="text-lg font-semibold text-foreground">XPOGO</p>
        </div>
        <button
          type="button"
          className="rounded-lg border border-border/70 p-2 text-muted-foreground hover:text-foreground lg:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <Menu className="h-5 w-5" />
        </button>
        <nav className="hidden items-center gap-2 lg:flex">
          {workspaceNav.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-2xl px-4 py-2 text-sm font-semibold transition",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/profile"
            className="flex items-center gap-2 rounded-2xl border border-border/60 px-3 py-2 text-sm font-semibold text-foreground hover:border-primary/30"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
              {initials}
            </span>
            <span>Profile</span>
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-2xl border border-border/60 px-4 py-2 text-xs font-semibold text-foreground hover:border-primary/30"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="border-t border-border/60 bg-card/90 px-4 py-4 lg:hidden">
          <div className="space-y-2">
            <Link
              href="/profile"
              className="block rounded-xl border border-border/60 px-4 py-3 text-sm font-semibold text-foreground"
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </Link>
            {workspaceNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block rounded-xl px-4 py-3 text-sm font-semibold",
                  pathname.startsWith(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              className="block w-full rounded-xl border border-border/60 px-4 py-3 text-left text-sm font-semibold text-foreground"
              onClick={() => {
                setMenuOpen(false);
                signOut();
              }}
            >
              Keluar
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default WorkspaceNav;
