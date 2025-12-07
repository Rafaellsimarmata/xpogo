import type { CountryData } from "@/src/types/market";

interface CountryCardProps {
  country: CountryData;
  isActive: boolean;
  onSelect: (country: CountryData) => void;
}

const parsePartners = (raw: string): string[] => {
  if (!raw) return [];
  const normalized = raw.replace(/\r/g, "").trim();
  if (!normalized) return [];

  if (normalized.includes("\n")) {
    return normalized
      .split(/\n+/)
      .map((line) => line.replace(/^[-*]\s*/, "").trim())
      .filter(Boolean);
  }

  if (normalized.includes(",")) {
    return normalized
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [normalized];
};

const CountryCard = ({ country, isActive, onSelect }: CountryCardProps) => {
  const partnerList = parsePartners(country.keyTradePartners);

  return (
    <button
      onClick={() => onSelect(country)}
      className={`
        rounded-2xl border p-4 text-left transition
        ${isActive
          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
          : "border-border/70 bg-card/50 hover:border-primary/50"
        }
      `}
    >
      <h3 className="font-semibold text-foreground">{country.name}</h3>

      <div className="mt-3 space-y-1 text-xs text-muted-foreground">
        <div className="flex justify-between">
          <span>Import Volume:</span>
          <span className="font-medium text-foreground">{country.importVolume} MT</span>
        </div>
        <div className="flex justify-between">
          <span>Market Growth:</span>
          <span className="font-medium text-foreground">{country.marketGrowthRate}%</span>
        </div>
      </div>

      {partnerList.length > 0 && (
        <div className="mt-3 border-t border-border/50 pt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Key Partners</p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-foreground">
            {partnerList.map((partner) => (
              <li key={partner}>{partner}</li>
            ))}
          </ul>
        </div>
      )}
    </button>
  );
};

export default CountryCard;
