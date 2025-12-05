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
    description: "Kopi merupakan komoditas ekspor unggulan Indonesia...",
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