export type Product = {
  id: string;
  name: string;
  hsCode: string;
  description: string;
  category: string;
  image: string;
  stats: {
    demandIndex: number;
    priceIndex: number;
    growth: string;
    readiness: string;
  };
  bestPractices: string[];
};

export const products: Product[] = [
  {
    id: "kopi",
    name: "Kopi",
    hsCode: "0901.11.10",
    category: "Pertanian",
    image: "/images/products/coffee.png",
    description:
      "Kopi merupakan komoditas ekspor unggulan Indonesia dengan citarasa kompleks dan kualitas tinggi. Indonesia adalah produsen kopi terbesar ke-4 di dunia.",
    stats: {
      demandIndex: 92,
      priceIndex: 86,
      growth: "+12% YoY",
      readiness: "Cocok untuk pemula",
    },
    bestPractices: [
      "Jaga konsistensi cupping score minimal 80",
      "Sertifikasi organik meningkatkan harga hingga 18%",
      "Gunakan kemasan kedap udara untuk menjaga aroma",
    ],
  },
  {
    id: "beras",
    name: "Beras Premium",
    hsCode: "1006.30.19",
    category: "Pertanian",
    image: "/images/products/rice.png",
    description:
      "Beras aromatik dan organik Indonesia semakin dicari di pasar Timur Tengah dan Asia Timur karena kualitas rasa dan proses produksi yang terjaga.",
    stats: {
      demandIndex: 78,
      priceIndex: 71,
      growth: "+7% YoY",
      readiness: "Butuh persiapan",
    },
    bestPractices: [
      "Pastikan traceability hingga petani",
      "Sertifikasi halal dan organik untuk pasar premium",
      "Gunakan kemasan berlabel multibahasa",
    ],
  },
  {
    id: "minyak-kelapa",
    name: "Minyak Kelapa",
    hsCode: "1513.19.00",
    category: "Perkebunan",
    image: "/images/products/coconut-oil.png",
    description:
      "Minyak kelapa murni (VCO) Indonesia diminati sebagai bahan baku kosmetik alami dan nutrisi sehat di Amerika dan Eropa.",
    stats: {
      demandIndex: 85,
      priceIndex: 80,
      growth: "+9% YoY",
      readiness: "Cocok untuk pemula",
    },
    bestPractices: [
      "Sertifikasi GMP dan HACCP untuk pabrik",
      "Kontrol kadar air maksimal 0,1%",
      "Tawarkan kemasan bulk dan retail",
    ],
  },
  {
    id: "kerajinan",
    name: "Kerajinan Tangan",
    hsCode: "4420.90.90",
    category: "Kerajinan",
    image: "/images/products/craft.png",
    description:
      "Produk kerajinan berbahan kayu, rotan, dan batik khas Indonesia memiliki nilai seni tinggi dan disukai pasar lifestyle global.",
    stats: {
      demandIndex: 74,
      priceIndex: 69,
      growth: "+15% YoY",
      readiness: "Butuh persiapan",
    },
    bestPractices: [
      "Tonjolkan cerita perajin lokal",
      "Gunakan finishing ramah lingkungan",
      "Sediakan katalog digital berkualitas",
    ],
  },
  {
    id: "furniture",
    name: "Furniture Kayu",
    hsCode: "9403.60.90",
    category: "Furniture",
    image: "/images/products/furniture.png",
    description:
      "Furniture kayu jati dan mahoni Indonesia dikenal tahan lama dan memiliki finishing premium yang banyak diminati di Eropa.",
    stats: {
      demandIndex: 80,
      priceIndex: 82,
      growth: "+10% YoY",
      readiness: "Advanced",
    },
    bestPractices: [
      "Gunakan kayu bersertifikat SVLK/FSC",
      "Sertakan dimensi detail pada katalog",
      "Tawarkan opsi flat-pack untuk shipping",
    ],
  },
  {
    id: "tekstil",
    name: "Tekstil & Modest Fashion",
    hsCode: "6204.49.90",
    category: "Tekstil",
    image: "/images/products/textile.png",
    description:
      "Busana muslim dan kain tenun modern Indonesia menunjukkan pertumbuhan permintaan tinggi di Timur Tengah dan Afrika Utara.",
    stats: {
      demandIndex: 88,
      priceIndex: 76,
      growth: "+18% YoY",
      readiness: "Cocok untuk pemula",
    },
    bestPractices: [
      "Tawarkan ukuran internasional lengkap",
      "Gunakan kain breathable berkualitas",
      "Sertifikasi halal untuk bahan baku",
    ],
  },
  {
    id: "rempah",
    name: "Rempah-rempah Premium",
    hsCode: "0910.11.10",
    category: "Rempah",
    image: "/images/products/spice.png",
    description:
      "Rempah seperti lada, pala, dan kayu manis Indonesia memiliki aroma kuat dan telah digunakan oleh brand kuliner global.",
    stats: {
      demandIndex: 90,
      priceIndex: 84,
      growth: "+14% YoY",
      readiness: "Advanced",
    },
    bestPractices: [
      "Pastikan kadar minyak atsiri konsisten",
      "Gunakan pengeringan modern untuk menjaga warna",
      "Kembangkan private label untuk buyer besar",
    ],
  },
];

export const productCategories = [
  "Pertanian",
  "Perkebunan",
  "Kerajinan",
  "Furniture",
  "Tekstil",
  "Rempah",
];

export const getProductById = (id: string): Product | undefined =>
  products.find((product) => product.id === id);
