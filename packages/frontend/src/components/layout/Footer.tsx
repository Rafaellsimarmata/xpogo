const Footer = () => (
  <footer className="border-t border-white/40 bg-white/80">
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
      <p>XPOGO © {new Date().getFullYear()} · Export Intelligence untuk UMKM Indonesia.</p>
      <div className="flex flex-wrap items-center gap-4 text-xs md:gap-6">
        <span>Ikuti kami: Instagram · LinkedIn</span>
        <span>support@xpogo.id</span>
      </div>
    </div>
  </footer>
);

export default Footer;
