export type TradeContact = {
  office: string;
  email: string;
  phone: string;
};

export type StoreOption = {
  id: string;
  name: string;
  rating: number;
  specialization: string;
  contact: string;
  location: string;
  ready: boolean;
};

export type CountryMatch = {
  id: string;
  name: string;
  code: string;
  region: string;
  score: number;
  matchScore: number;
  avgImportPrice: number;
  estimatedTime: number;
  readiness: "Cocok untuk pemula" | "Butuh persiapan" | "Advanced";
  importValue: number;
  gdp: string;
  population: string;
  easeOfLogistics: string;
  tradeAgreements: string[];
  businessTips: string[];
  contacts: TradeContact[];
  topImports: {
    name: string;
    volume: string;
    growth: string;
  }[];
  opportunityHighlights: string[];
  stores: StoreOption[];
};

export const countries: CountryMatch[] = [
  {
    id: "japan",
    name: "Jepang",
    code: "JP",
    region: "Asia Timur",
    score: 92,
    matchScore: 95,
    avgImportPrice: 8.7,
    estimatedTime: 22,
    readiness: "Cocok untuk pemula",
    importValue: 4_600_000_000,
    gdp: "US$4.2T",
    population: "125 Juta",
    easeOfLogistics: "Sangat baik - jalur laut dan udara stabil",
    tradeAgreements: ["IA-CEPA", "AJCEP"],
    businessTips: [
      "Bangun kepercayaan melalui dokumentasi lengkap",
      "Tepat waktu saat pengiriman sampel",
      "Gunakan bahasa Jepang sederhana pada label",
    ],
    contacts: [
      {
        office: "Atase Perdagangan Tokyo",
        email: "trade@indonesianembassy.jp",
        phone: "+81 3-3441-4201",
      },
      {
        office: "ITPC Osaka",
        email: "info@itpcosaka.id",
        phone: "+81 6-6449-5551",
      },
    ],
    topImports: [
      { name: "Kopi Specialty", volume: "26K ton", growth: "+14% YoY" },
      { name: "Furniture Kayu", volume: "18K unit", growth: "+11% YoY" },
      { name: "Rempah Premium", volume: "9K ton", growth: "+17% YoY" },
    ],
    opportunityHighlights: [
      "Buyer mencari pemasok kopi traceable untuk coffee chain",
      "Permintaan gift set kerajinan kaca dan kayu meningkat jelang Golden Week",
      "Marketplace B2C Jepang membuka kanal brand luar negeri bulan depan",
    ],
    stores: [
      {
        id: "jp-1",
        name: "Hikari Trading",
        rating: 4.8,
        specialization: "Kopi & Minuman Premium",
        contact: "partner@hikaritrading.jp",
        location: "Tokyo",
        ready: true,
      },
      {
        id: "jp-2",
        name: "Tokyo Craft Hub",
        rating: 4.6,
        specialization: "Lifestyle & Kerajinan",
        contact: "hello@tokyocrafthub.jp",
        location: "Tokyo",
        ready: false,
      },
    ],
  },
  {
    id: "uae",
    name: "Uni Emirat Arab",
    code: "AE",
    region: "Timur Tengah",
    score: 88,
    matchScore: 90,
    avgImportPrice: 7.4,
    estimatedTime: 18,
    readiness: "Cocok untuk pemula",
    importValue: 3_100_000_000,
    gdp: "US$508B",
    population: "9.9 Juta",
    easeOfLogistics: "Pelabuhan Jebel Ali & Dubai Air Hub",
    tradeAgreements: ["IA-CEPA", "GCC Framework"],
    businessTips: [
      "Prioritaskan kemasan bilingual (Inggris & Arab)",
      "Bangun relasi melalui pameran dagang",
      "Sertifikasi halal adalah kewajiban untuk F&B",
    ],
    contacts: [
      {
        office: "ITPC Dubai",
        email: "info@itpcdubai.com",
        phone: "+971 4 352 4333",
      },
    ],
    topImports: [
      { name: "Beras Premium", volume: "64K ton", growth: "+9% YoY" },
      { name: "Minyak Kelapa", volume: "21K ton", growth: "+13% YoY" },
      { name: "Modest Fashion", volume: "12K unit", growth: "+21% YoY" },
    ],
    opportunityHighlights: [
      "Retail chain mencari pemasok produk private label organik",
      "Proyek hospitality baru membutuhkan pemasok furniture hotel",
      "Marketplace Noon membuka kategori kopi specialty Nusantara",
    ],
    stores: [
      {
        id: "ae-1",
        name: "Desert Bloom Foods",
        rating: 4.7,
        specialization: "F&B Premium",
        contact: "trade@desertbloom.ae",
        location: "Dubai",
        ready: true,
      },
      {
        id: "ae-2",
        name: "House of Java",
        rating: 4.5,
        specialization: "Lifestyle & Craft",
        contact: "buyer@houseofjava.ae",
        location: "Abu Dhabi",
        ready: true,
      },
    ],
  },
  {
    id: "united-states",
    name: "Amerika Serikat",
    code: "US",
    region: "Amerika Utara",
    score: 84,
    matchScore: 86,
    avgImportPrice: 9.2,
    estimatedTime: 32,
    readiness: "Advanced",
    importValue: 8_900_000_000,
    gdp: "US$27T",
    population: "331 Juta",
    easeOfLogistics: "Pelabuhan LA & Seattle, jalur udara langsung",
    tradeAgreements: ["GSP+", "Indo-Pacific Framework"],
    businessTips: [
      "Sertifikasi keberlanjutan menjadi nilai tambah",
      "Gunakan storytelling brand untuk D2C",
      "Penuhi standar FDA/USDA untuk kategori pangan",
    ],
    contacts: [
      {
        office: "ITPC Los Angeles",
        email: "info@itpcla.org",
        phone: "+1 213-383-5126",
      },
      {
        office: "Consulate General Houston",
        email: "trade@kbrila.org",
        phone: "+1 346-227-4081",
      },
    ],
    topImports: [
      { name: "Furniture Kayu", volume: "45K unit", growth: "+8% YoY" },
      { name: "Kopi Speciality", volume: "31K ton", growth: "+15% YoY" },
      { name: "Produk Wellness", volume: "19K unit", growth: "+19% YoY" },
    ],
    opportunityHighlights: [
      "Marketplace premium mencari brand Asia untuk kolaborasi Q3",
      "Ritel zero-waste butuh pemasok rempah refill pack",
      "Distributor West Coast membuka kategori VCO organik",
    ],
    stores: [
      {
        id: "us-1",
        name: "Pacific Import Partners",
        rating: 4.9,
        specialization: "Retail Chain & Horeca",
        contact: "hello@pacificimport.us",
        location: "Los Angeles",
        ready: false,
      },
      {
        id: "us-2",
        name: "Kindred Market",
        rating: 4.6,
        specialization: "D2C Lifestyle",
        contact: "sourcing@kindredmarket.com",
        location: "Austin",
        ready: true,
      },
    ],
  },
  {
    id: "germany",
    name: "Jerman",
    code: "DE",
    region: "Eropa Barat",
    score: 86,
    matchScore: 82,
    avgImportPrice: 8.1,
    estimatedTime: 28,
    readiness: "Butuh persiapan",
    importValue: 3_700_000_000,
    gdp: "US$4.0T",
    population: "83 Juta",
    easeOfLogistics: "Pelabuhan Hamburg & jalur kereta Eropa",
    tradeAgreements: ["IEU-CEPA (ongoing)", "Generalized Scheme of Preferences"],
    businessTips: [
      "Hijaukan supply chain untuk buyer Jerman",
      "Sertifikasi Ecolabel meningkatkan konversi",
      "Detail teknis produk wajib jelas",
    ],
    contacts: [
      {
        office: "ITPC Hamburg",
        email: "info@itpchamburg.de",
        phone: "+49 40 299 988",
      },
    ],
    topImports: [
      { name: "Rempah Premium", volume: "15K ton", growth: "+10% YoY" },
      { name: "Furniture Kayu", volume: "22K unit", growth: "+7% YoY" },
      { name: "Tekstil Ramah Lingkungan", volume: "25K roll", growth: "+13% YoY" },
    ],
    opportunityHighlights: [
      "Retail konsep sustainable butuh pemasok Asia",
      "Marketplace design Berlin membuka kurasi brand global",
      "Perusahaan spice blend mencari partner traceable",
    ],
    stores: [
      {
        id: "de-1",
        name: "Nordic Blue Imports",
        rating: 4.4,
        specialization: "Gourmet & Horeca",
        contact: "buyers@nordicblue.de",
        location: "Hamburg",
        ready: false,
      },
    ],
  },
  {
    id: "australia",
    name: "Australia",
    code: "AU",
    region: "Oseania",
    score: 81,
    matchScore: 80,
    avgImportPrice: 6.9,
    estimatedTime: 17,
    readiness: "Cocok untuk pemula",
    importValue: 2_200_000_000,
    gdp: "US$1.7T",
    population: "26 Juta",
    easeOfLogistics: "Pelabuhan Darwin & Sydney, jalur udara langsung",
    tradeAgreements: ["IA-CEPA", "ASEAN-Australia-New Zealand FTA"],
    businessTips: [
      "Prioritaskan kualitas dan keamanan pangan",
      "Kemas dengan visual modern & informatif",
      "Program promosi di marketplace lokal efektif",
    ],
    contacts: [
      {
        office: "ITPC Sydney",
        email: "itpcsydney@kemendag.go.id",
        phone: "+61 2 9252 3277",
      },
    ],
    topImports: [
      { name: "Kopi Siap Seduh", volume: "9K ton", growth: "+16% YoY" },
      { name: "Kerajinan Rumah", volume: "15K unit", growth: "+12% YoY" },
      { name: "Bahan Baku Kosmetik", volume: "5K ton", growth: "+19% YoY" },
    ],
    opportunityHighlights: [
      "Retail chain membuka booth Nusantara",
      "Festival kuliner Indonesia di Melbourne membutuhkan pemasok",
      "Marketplace D2C menawarkan subsidi ongkir untuk brand baru",
    ],
    stores: [
      {
        id: "au-1",
        name: "Archipelago & Co",
        rating: 4.8,
        specialization: "Lifestyle & F&B",
        contact: "trade@archipelagoco.au",
        location: "Sydney",
        ready: true,
      },
    ],
  },
];

export const getCountryById = (id: string): CountryMatch | undefined =>
  countries.find((country) => country.id === id);
