"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/src/components/ui/Button";

const navLinks = [
  { label: "Beranda", href: "#hero" },
  { label: "Fitur", href: "#features" },
  { label: "Cara Kerja", href: "#how-it-works" },
  { label: "Testimoni", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#hero");

  // Detect active section on scroll - only on homepage
  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const handleScroll = () => {
      const sections = navLinks.map(link => link.href);
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.querySelector(section);
        if (element) {
          const { offsetTop, offsetHeight } = element as HTMLElement;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const scrollToSection = useCallback(
    (hash: string) => {
      if (pathname !== "/") {
        router.push(`/${hash}`);
        setIsOpen(false);
        return;
      }

      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      setIsOpen(false);
    },
    [pathname, router],
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed left-0 right-0 top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3" aria-label="Beranda XPOGO">
            <div className="relative h-8 w-8">
              <Image 
                src="/logo/XPOGO_small.png" 
                alt="XPOGO Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold text-foreground">
              XPO<span className="text-primary">GO</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === "/" && activeSection === link.href;
              return (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => scrollToSection(link.href)}
                  className={`group relative px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    isActive 
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                  
                  {/* Animated underline on hover - only show when NOT active */}
                  {!isActive && (
                    <span className="absolute bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-linear-to-r from-primary via-accent to-primary transition-all duration-300 ease-out group-hover:w-3/4 dark:from-primary dark:via-blue-400 dark:to-primary"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <Button 
              variant="ghost" 
              size="sm" 
              className="font-semibold hover:bg-primary/10 hover:text-primary"
              asChild
            >
              <Link href="/signin">Masuk</Link>
            </Button>
            <Button
              size="sm"
              className="font-semibold bg-linear-to-r from-primary to-accent text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
              asChild
            >
              <Link href="/signup">Daftar</Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="rounded-lg p-2 text-foreground transition-colors hover:bg-muted md:hidden"
            aria-label="Toggle menu"
            type="button"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border/40 bg-background/95 backdrop-blur-lg md:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => scrollToSection(link.href)}
                  className={`block w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${
                    pathname === "/" && activeSection === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                </button>
              ))}
              
              {/* Mobile Auth Buttons */}
              <div className="flex flex-col gap-2 pt-4">
                <Button 
                  variant="outline" 
                  className="w-full font-semibold border-primary/30 hover:bg-primary/10 hover:text-primary hover:border-primary" 
                  asChild
                >
                  <Link href="/signin">Masuk</Link>
                </Button>
                <Button 
                  className="w-full font-semibold bg-linear-to-r from-primary to-accent text-white shadow-lg" 
                  asChild
                >
                  <Link href="/signup">Daftar</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
