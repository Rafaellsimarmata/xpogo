'use client';

import Link from "next/link"; // ✅ Next.js Link
import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Youtube,
  ArrowUpRight,
  Zap
} from "lucide-react";

const footerLinks = {
  product: [
    { label: "Market Intelligence", href: "/features/market-intelligence" },
    { label: "DocuAssist AI", href: "/features/docuassist" },
    { label: "Smart Matching", href: "/features/matching" },
    { label: "Export Workflow", href: "/features/workflow" },
    { label: "Pricing", href: "/pricing" },
  ],
  company: [
    { label: "Tentang Kami", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Press Kit", href: "/press" },
    { label: "Partner Program", href: "/partners" },
  ],
  resources: [
    { label: "Help Center", href: "/help" },
    { label: "Panduan Ekspor", href: "/guides" },
    { label: "Webinar", href: "/webinars" },
    { label: "API Docs", href: "/api-docs" },
    { label: "Status", href: "/status" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Security", href: "/security" },
  ],
};

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com/xpogo.id", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com/company/xpogo", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com/xpogo_id", label: "Twitter" },
  { icon: Youtube, href: "https://youtube.com/@xpogo", label: "YouTube" },
];

const Footer = () => (
  <footer className="relative overflow-hidden bg-foreground text-primary-foreground">
    {/* Background Gradient */}
    <div className="absolute inset-0 bg-gradient-to-b from-foreground to-foreground/95" />
    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

    <div className="relative">
      {/* Newsletter Section */}
      <div className="border-b border-primary-foreground/10">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:px-8">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold">
                Siap mulai ekspor?
              </h3>
              <p className="mt-2 text-primary-foreground/70">
                Gabung 300+ UMKM yang sudah sukses ekspor bersama XPOGO.
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex gap-3"
            >
              <input
                type="email"
                placeholder="Email kamu..."
                className="rounded-xl border border-primary-foreground/20 bg-primary-foreground/5 px-4 py-3 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25">
                <span>Subscribe</span>
                <Zap className="h-4 w-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-8">
        <div className="grid gap-12 lg:grid-cols-6">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-accent">
                <span className="text-xl font-bold text-primary-foreground">X</span>
              </div>
              <span className="text-2xl font-bold">XPOGO</span>
            </Link>
            <p className="mt-4 text-primary-foreground/70 leading-relaxed">
              Platform AI pertama di Indonesia yang membantu UMKM untuk ekspor. 
              Market Intelligence + DocuAssist dalam satu aplikasi.
            </p>
            
            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <a href="mailto:hello@xpogo.id" className="flex items-center gap-3 text-sm text-primary-foreground/70 hover:text-primary transition-colors">
                <Mail className="h-4 w-4" />
                hello@xpogo.id
              </a>
              <a href="tel:+6281234567890" className="flex items-center gap-3 text-sm text-primary-foreground/70 hover:text-primary transition-colors">
                <Phone className="h-4 w-4" />
                +62 812 3456 7890
              </a>
              <div className="flex items-start gap-3 text-sm text-primary-foreground/70">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>
                  Jl. Gatot Subroto No. 123<br />
                  Jakarta Selatan, 12930
                </span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-primary-foreground/60">
              © {new Date().getFullYear()} XPOGO. All rights reserved. Made with ❤️ in Indonesia.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/5 text-primary-foreground/70 transition-all hover:bg-primary hover:text-primary-foreground"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
