import { Clock, X } from "lucide-react";
import type { GeoResult } from "@/lib/weather-api";

interface Props {
  history: GeoResult[];
  onSelect: (city: GeoResult) => void;
  onClear: () => void;
}

const SearchHistory = ({ history, onSelect, onClear }: Props) => {
  if (history.length === 0) return null;

  return (
    <div
      className="animate-fade-in-up bg-card/90 backdrop-blur-xl border-2 border-secondary rounded-[var(--radius)] p-4 shadow-[var(--kawaii-shadow-sm)]"
      style={{ animationDelay: "0.3s" }}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-kawaii font-bold text-sm text-foreground flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          Histórico de Pesquisa
        </h3>
        <button
          onClick={onClear}
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {history.map((city, i) => (
          <button
            key={`${city.id}-${i}`}
            onClick={() => onSelect(city)}
            className="px-3 py-1.5 bg-accent/80 rounded-full font-kawaii text-sm text-foreground hover:bg-primary hover:text-primary-foreground transition-all border border-secondary/50 hover:border-primary"
          >
            {city.name}, {city.country_code}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;
