'use client';

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight , Target, Globe, CheckCircle } from "lucide-react";

const stats = [
  { 
    value: "300+", 
    label: "UMKM Telah Dibantu",
    icon: Target,
    color: "text-blue-400"
  },
  { 
    value: "35", 
    label: "Negara Tujuan",
    icon: Globe,
    color: "text-cyan-400"
  },
  { 
    value: "96%", 
    label: "Checklist Dokumen",
    icon: CheckCircle,
    color: "text-emerald-400"
  }
];

const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-gray-950 pt-16">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 bg-linear-to-b from-blue-500/5 to-transparent blur-3xl" />
      </div>

      {/* Main Container */}
      <div className="relative mx-auto max-w-full h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8">
        {/* Image Card Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-4 sm:inset-6 lg:inset-8 rounded-3xl overflow-hidden border border-gray-800 bg-gray-900/50"
        >
          {/* Image with Overlay */}
          <div className="absolute inset-0">
            <Image
              src="/img/logistics.jpg"
              alt="Logistics Network"
              fill
              className="object-cover opacity-30"
              priority
              quality={100}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-gray-950/10 via-gray-900/10 to-gray-950/10" />
          </div>

          {/* Content Overlay */}
          <div className="relative h-full flex flex-col">
            {/* Left Content - Rata Kiri Bawah */}
            <div className="flex-1 flex items-end pb-6 sm:pb-8 lg:pb-12 pl-4 sm:pl-6 lg:pl-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4 max-w-md sm:max-w-lg"
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-secondary animate-pulse" />
                  <span className="text-xs sm:text-sm font-medium tracking-wider text-accent">
                    #1 Market Analysis and Document Assistant AI
                  </span>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                  <span className="block text-white">Ekspor Jadi</span>
                  <span className="block bg-linear-to-br from-primary to-secondary bg-clip-text text-transparent">
                    Mudah dengan XPOGO
                  </span>
                </h1>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-8 pt-6">
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link 
                      href="/signin" 
                      className="group relative flex items-center gap-3 text-gray-300 hover:text-secondary transition-colors py-1"
                    >
                      <span className="text-md font-medium tracking-wide relative overflow-hidden">
                        <span className="relative z-10">Mulai Sekarang</span>
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-blue-400 to-secondary group-hover:w-full transition-all duration-500 ease-out"></span>
                      </span>
                      <ArrowUpRight className="h-5 w-5 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link 
                      href="/demo" 
                      className="group relative flex items-center gap-3 text-gray-300 hover:text-white transition-colors py-1"
                    >
                      <span className="text-md font-medium tracking-wide relative overflow-hidden">
                        <span className="relative z-10">Pelajari Lebih Lanjut</span>
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-gray-400 to-gray-300 group-hover:w-full transition-all duration-500 ease-out"></span>
                      </span>
                      <ArrowUpRight  className="h-5 w-5 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Right Statistics - Rata Kanan Bawah */}
            <div className="pb-4 sm:pb-6 lg:pb-8 pr-4 sm:pr-6 lg:pr-8">
              <div className="flex justify-end">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-3 gap-3 sm:gap-4 max-w-xs sm:max-w-sm"
                >
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="text-center space-y-1"
                    >
                      <div className={`text-2xl sm:text-4xl md:text-5xl font-bold ${stat.color}`}>
                        {stat.value}
                      </div>
                      <p className="text-sm text-gray-400 tracking-wide leading-tight">
                        {stat.label}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator with Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-5 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ 
            y: [0, 10, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="flex flex-col items-center cursor-pointer"
          onClick={() => window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' })}
        >
          <div className="text-gray-400 text-xs mb-2">Scroll</div>
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-1 h-3 bg-linear-to-b from-blue-400 to-cyan-400 rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
