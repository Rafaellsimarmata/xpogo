import { CountryMatch } from "@/src/types/countries";

export const countries: CountryMatch[] = [
  {
    id: "usa",
    name: "United States",
    code: "US",
    region: "North America",
    matchScore: 92,
    score: 92,
    readiness: "Siap ekspor",
    importValue: "USD 1.5 billion",
    gdp: "USD 25.46 trillion",
    population: "331 million",
    estimatedTime: 21,
    easeOfLogistics: "Port of Los Angeles/Long Beach - efficient customs clearance",
    tradeAgreements: ["MFN", "GSP"],
    topImports: [
      { name: "Coffee", volume: "1.5M MT", growth: "+4.2%" },
      { name: "Specialty Coffee", volume: "450K MT", growth: "+8.5%" },
      { name: "Organic Coffee", volume: "180K MT", growth: "+12%" },
    ],
    businessTips: [
      "FDA registration required for food imports",
      "Quality consistency is critical - maintain SCA score 80+",
      "Build relationships with specialty roasters for premium pricing",
      "Consider direct trade partnerships",
    ],
    contacts: [
      {
        office: "US Commercial Service Jakarta",
        phone: "+62 21 3435 9000",
        email: "jakarta.office@trade.gov",
      },
    ],
  },
  {
    id: "germany",
    name: "Germany",
    code: "DE",
    region: "Europe",
    matchScore: 88,
    score: 88,
    readiness: "Siap ekspor",
    importValue: "USD 1.2 billion",
    gdp: "USD 4.08 trillion",
    population: "83 million",
    estimatedTime: 28,
    easeOfLogistics: "Port of Hamburg - major EU gateway with excellent infrastructure",
    tradeAgreements: ["EU-Indonesia CEPA", "GSP+"],
    topImports: [
      { name: "Green Coffee", volume: "1.2M MT", growth: "+3.8%" },
      { name: "Certified Sustainable", volume: "680K MT", growth: "+9.2%" },
      { name: "Organic", volume: "240K MT", growth: "+11%" },
    ],
    businessTips: [
      "EUDR compliance mandatory from 2025",
      "Sustainability certifications highly valued",
      "Gateway to broader EU market",
      "Strong preference for Arabica varieties",
    ],
    contacts: [
      {
        office: "German Embassy Jakarta - Trade Section",
        phone: "+62 21 3985 5000",
        email: "wirtschaft@jakarta.diplo.de",
      },
    ],
  },
  {
    id: "japan",
    name: "Japan",
    code: "JP",
    region: "Asia",
    matchScore: 85,
    score: 85,
    readiness: "Perlu persiapan",
    importValue: "USD 900 million",
    gdp: "USD 4.23 trillion",
    population: "125 million",
    estimatedTime: 14,
    easeOfLogistics: "Port of Tokyo/Yokohama - highly efficient but strict documentation",
    tradeAgreements: ["Indonesia-Japan EPA", "RCEP"],
    topImports: [
      { name: "Premium Arabica", volume: "380K MT", growth: "+2.5%" },
      { name: "Single-Origin", volume: "120K MT", growth: "+6.8%" },
      { name: "Specialty Grade", volume: "95K MT", growth: "+10%" },
    ],
    businessTips: [
      "Extremely strict quality standards",
      "Pesticide residue limits very stringent",
      "Traceability documentation essential",
      "Premium pricing for exceptional quality",
    ],
    contacts: [
      {
        office: "JETRO Jakarta",
        phone: "+62 21 5790 3507",
        email: "IDN@jetro.go.jp",
      },
    ],
  },
  {
    id: "south-korea",
    name: "South Korea",
    code: "KR",
    region: "Asia",
    matchScore: 82,
    score: 82,
    readiness: "Siap ekspor",
    importValue: "USD 450 million",
    gdp: "USD 1.67 trillion",
    population: "51 million",
    estimatedTime: 12,
    easeOfLogistics: "Port of Busan - modern facilities, efficient processing",
    tradeAgreements: ["Indonesia-Korea CEPA", "RCEP"],
    topImports: [
      { name: "Coffee Beans", volume: "180K MT", growth: "+7.3%" },
      { name: "Instant Coffee", volume: "45K MT", growth: "+12%" },
      { name: "RTD Coffee", volume: "35K MT", growth: "+15%" },
    ],
    businessTips: [
      "Rapidly growing café culture",
      "Trend-driven market - stay updated on preferences",
      "K-pop and Korean culture influence consumption",
      "E-commerce channels very important",
    ],
    contacts: [
      {
        office: "KOTRA Jakarta",
        phone: "+62 21 574 1522",
        email: "jakarta@kotra.or.kr",
      },
    ],
  },
];

export const getCountryById = (id: string): CountryMatch | undefined =>
  countries.find((country) => country.id === id);