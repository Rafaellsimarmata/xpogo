export type DocumentStatus = "complete" | "pending" | "in-progress";

export type DocumentRequirement = {
  id: string;
  title: string;
  description: string;
  status: DocumentStatus;
  level: "basic" | "advanced";
  actionLabel?: string;
};

const baseDocuments: DocumentRequirement[] = [
  {
    id: "npwp",
    title: "NPWP Perusahaan",
    description:
      "Nomor Pokok Wajib Pajak perusahaan sebagai identitas fiskal wajib untuk transaksi ekspor.",
    status: "complete",
    level: "basic",
  },
  {
    id: "nib",
    title: "NIB & OSS",
    description: "Nomor Induk Berusaha dan akses OSS untuk legalitas kegiatan ekspor.",
    status: "complete",
    level: "basic",
  },
  {
    id: "sip",
    title: "Surat Izin Produksi",
    description: "Dokumen yang membuktikan proses produksi memenuhi regulasi pemerintah.",
    status: "in-progress",
    level: "basic",
  },
  {
    id: "coo",
    title: "Certificate of Origin (SKA)",
    description: "Membuktikan barang berasal dari Indonesia untuk mendapatkan tarif preferensi.",
    status: "pending",
    level: "basic",
    actionLabel: "Ajukan",
  },
];

const productSpecificDocuments: Record<string, DocumentRequirement[]> = {
  kopi: [
    {
      id: "ico",
      title: "ICO Certificate",
      description: "Registrasi International Coffee Organization untuk produk kopi.",
      status: "pending",
      level: "advanced",
    },
    {
      id: "qc-lab",
      title: "Uji Laboratorium",
      description: "Hasil uji kadar air dan cupping score minimal 80.",
      status: "in-progress",
      level: "advanced",
    },
  ],
  beras: [
    {
      id: "halal",
      title: "Sertifikat Halal",
      description: "Wajib untuk target Timur Tengah.",
      status: "pending",
      level: "advanced",
    },
  ],
  "minyak-kelapa": [
    {
      id: "bpom",
      title: "Registrasi BPOM",
      description: "Diperlukan jika masuk kategori pangan olahan.",
      status: "pending",
      level: "advanced",
    },
    {
      id: "haccp",
      title: "Sertifikasi HACCP",
      description: "Menjamin keamanan pangan selama proses produksi.",
      status: "complete",
      level: "advanced",
    },
  ],
  kerajinan: [
    {
      id: "flegt",
      title: "Dokumen SVLK/Legalitas Kayu",
      description: "Wajib untuk material kayu atau bambu.",
      status: "complete",
      level: "advanced",
    },
  ],
  furniture: [
    {
      id: "flegt",
      title: "Dokumen SVLK",
      description: "Menjamin legalitas bahan baku kayu.",
      status: "complete",
      level: "advanced",
    },
    {
      id: "qc-inspection",
      title: "Quality Inspection Report",
      description: "Laporan uji dimensi dan struktur dari pihak ketiga.",
      status: "in-progress",
      level: "advanced",
    },
  ],
  tekstil: [
    {
      id: "material-safety",
      title: "Material Safety Data",
      description: "Informasi keamanan bahan dan pewarna tekstil.",
      status: "pending",
      level: "advanced",
    },
  ],
  rempah: [
    {
      id: "phytosanitary",
      title: "Phytosanitary Certificate",
      description: "Dikeluarkan Kementan untuk menjamin bebas hama.",
      status: "pending",
      level: "advanced",
    },
  ],
};

const countrySpecificDocuments: Record<string, DocumentRequirement[]> = {
  japan: [
    {
      id: "japan-label",
      title: "Label Bahasa Jepang",
      description: "Label bilingual dengan standar konsumen Jepang.",
      status: "in-progress",
      level: "advanced",
      actionLabel: "Unduh Template",
    },
  ],
  uae: [
    {
      id: "esma",
      title: "ESMA Certificate",
      description: "Registrasi Emirates Authority for Standardization and Metrology.",
      status: "pending",
      level: "advanced",
    },
  ],
  "united-states": [
    {
      id: "fda",
      title: "FDA Registration",
      description: "Registrasi Food and Drug Administration untuk produk pangan.",
      status: "pending",
      level: "advanced",
    },
  ],
};

export const generateChecklist = (productId: string, countryId: string): DocumentRequirement[] => {
  const merged = [
    ...baseDocuments,
    ...(productSpecificDocuments[productId] ?? []),
    ...(countrySpecificDocuments[countryId] ?? []),
  ];

  const deduplicated = merged.reduce<DocumentRequirement[]>((acc, doc) => {
    if (acc.some((item) => item.id === doc.id)) {
      return acc;
    }

    return [...acc, doc];
  }, []);

  return deduplicated;
};

export const checklistCompletion = (items: DocumentRequirement[]): number => {
  if (!items.length) return 0;
  const completed = items.filter((item) => item.status === "complete").length;
  return Math.round((completed / items.length) * 100);
};
