import Footer from "@/src/components/layout/Footer";
import Navbar from "@/src/components/layout/Navbar";

const SiteLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export default SiteLayout;
