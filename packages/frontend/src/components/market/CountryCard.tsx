import type { CountryData } from "@/src/types/market";

interface CountryCardProps {
  country: CountryData;
  isActive: boolean;
  onSelect: (country: CountryData) => void;
}

const CountryCard = ({ country, isActive, onSelect }: CountryCardProps) => {
  return (
    <button
      onClick={() => onSelect(country)}
      className={`
        rounded-2xl border p-4 text-left transition
        ${isActive 
          ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
          : 'border-border/70 bg-card/50 hover:border-primary/50'
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
      
      {country.keyTradePartners && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            Key Partners: <span className="text-foreground">{country.keyTradePartners}</span>
          </p>
        </div>
      )}
    </button>
  );
};

export default CountryCard;