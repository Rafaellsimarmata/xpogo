"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut, Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const { signOut } = useAuth();
  const { profile } = useUser();

  console.log("[WorkspaceNav] Rendering with profile:", profile?.fullName || "null");

  // Handle null profile during hydration
  const initials = profile?.fullName
    ? profile.fullName
        .split(" ")
        .map((name) => name.charAt(0).toUpperCase())
        .slice(0, 2)
        .join("")
    : "U";
  const profileName = profile?.fullName ?? profile?.username ?? "Pengguna XP";
  const profileCompany = profile?.company ?? profile?.businessName ?? "Perusahaan belum diatur";

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!profileMenuRef.current) return;
      if (profileMenuRef.current.contains(event.target as Node)) return;
      setProfileMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  try {
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
          onClick={() => {
            setMenuOpen((prev) => !prev);
            setProfileMenuOpen(false);
          }}
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
          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              className="flex items-center gap-2 rounded-2xl border border-border/60 px-3 py-2 text-sm font-semibold text-foreground hover:border-primary/40"
              onClick={() => setProfileMenuOpen((prev) => !prev)}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                {initials}
              </span>
              <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition", profileMenuOpen && "rotate-180")} />
            </button>
            {profileMenuOpen && (
              <div className="absolute bg-background right-0 top-full mt-2 w-64 rounded-2xl border border-border/60 p-4 shadow-lg">
                <div className="mb-3 border-b border-border/60 pb-3">
                  <p className="text-md font-semibold text-foreground">{profileName}</p>
                  <p className="text-sm text-muted-foreground">{profileCompany}</p>
                </div>
                <div className="space-y-2">
                  <Link
                    href="/profile"
                    className="block rounded-2xl border border-border/50 px-4 py-2 text-sm font-semibold text-foreground hover:border-primary/30"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    Ubah data
                  </Link>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-2xl border border-border/50 px-4 py-2 text-sm font-semibold text-destructive hover:border-destructive/40 cursor-pointer"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      signOut();
                    }}
                  >
                    Keluar
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="border-t border-border/60 bg-card/90 px-4 py-4 lg:hidden">
          <div className="space-y-3">
            <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
              <p className="text-sm font-semibold text-foreground">{profileName}</p>
              <p className="text-xs text-muted-foreground">{profileCompany}</p>
              <div className="mt-3 space-y-2">
                <Link
                  href="/profile"
                  className="block rounded-xl border border-border/50 px-4 py-2 text-sm font-semibold text-foreground"
                  onClick={() => setMenuOpen(false)}
                >
                  Ubah data
                </Link>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-xl border border-destructive/40 px-4 py-2 text-sm font-semibold text-destructive"
                  onClick={() => {
                    setMenuOpen(false);
                    signOut();
                  }}
                >
                  Keluar
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
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
          </div>
        </div>
      )}
    </header>
    );
  } catch (error) {
    console.error("[WorkspaceNav] Error rendering:", error);
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
            className="flex items-center gap-2 rounded-2xl border border-destructive/40 px-3 py-2 text-sm font-semibold text-destructive"
            onClick={() => window.location.reload()}
          >
            Error - Reload
          </button>
        </div>
      </header>
    );
  }
};

export default WorkspaceNav;
