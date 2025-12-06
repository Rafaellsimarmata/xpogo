'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { motion } from "framer-motion";
import { Instagram, Linkedin, Twitter, Mail } from "lucide-react";

const footerLinks = [
  { label: "Fitur", href: "#features" },
  { label: "Cara Kerja", href: "#how-it-works" },
  { label: "Testimoni", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com/cnpngin._", label: "Instagram" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/christian-nathaniel-3071b0368/", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com/xpogo_id", label: "Twitter" },
  { icon: Mail, href: "mailto:xpogosupport@xpogo.id", label: "Email" },
];

const Footer = () => {
  const router = useRouter();
  const pathname = usePathname();

  const scrollToSection = useCallback(
    (hash: string) => {
      if (pathname !== "/") {
        router.push(`/${hash}`);
        return;
      }

      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    },
    [pathname, router],
  );

  return (
  <footer className="relative border-t border-border/40 bg-background/80 backdrop-blur-lg">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:px-8">
      <div className="grid gap-8 md:grid-cols-3 md:gap-12">
        
        {/* Brand Section */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10">
              <Image 
                src="/logo/XPOGO_small.png" 
                alt="XPOGO Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold">
              XPO<span className="text-primary">GO</span>
            </span>
          </Link>
          <p className="text-sm text-muted-foreground max-w-xs">
            Platform AI untuk membantu UMKM Indonesia menembus pasar ekspor global.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Menu</h4>
          <ul className="space-y-2">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <button
                  type="button"
                  onClick={() => scrollToSection(link.href)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Social & Contact */}
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Hubungi Kami</h4>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </motion.a>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            xpogosupport@xpogo.id<br />
            Medan, Indonesia
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-8 border-t border-border/40 pt-6">
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} XPOGO. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  </footer>
  );
};

export default Footer;