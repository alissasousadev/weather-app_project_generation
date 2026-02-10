import { useState, useRef, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import { searchCities, type GeoResult } from "@/lib/weather-api";

interface Props {
  onSelectCity: (city: GeoResult) => void;
}

const SearchBar = ({ onSelectCity }: Props) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef<number>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);
    clearTimeout(timeoutRef.current);
    if (value.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    timeoutRef.current = window.setTimeout(async () => {
      const res = await searchCities(value);
      setResults(res);
      setShowDropdown(res.length > 0);
    }, 300);
  };

  const handleSelect = (city: GeoResult) => {
    setQuery(city.name);
    setShowDropdown(false);
    onSelectCity(city);
  };

  const handleLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const res = await searchCities(`${pos.coords.latitude},${pos.coords.longitude}`);
      if (res.length > 0) handleSelect(res[0]);
      else {
        onSelectCity({
          id: 0,
          name: "Minha Localização",
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          country: "",
          country_code: "",
        });
      }
    });
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && results.length > 0) handleSelect(results[0]);
            }}
            placeholder="Digite o nome da cidade..."
            className="w-full py-3 sm:py-4 px-4 sm:px-6 pr-10 sm:pr-12 rounded-[var(--radius)] bg-card/90 backdrop-blur-xl border-2 border-secondary text-foreground font-kawaii text-sm sm:text-base placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <Search className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-primary w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <button
          onClick={handleLocation}
          className="flex items-center justify-center gap-2 px-4 py-3 sm:px-5 sm:py-4 rounded-[var(--radius)] bg-primary text-primary-foreground font-kawaii font-bold text-sm sm:text-base hover:scale-105 shadow-[var(--kawaii-shadow-md)] hover:shadow-[var(--kawaii-shadow-lg)] transition-all border-2 border-primary"
        >
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Minha Localização</span>
        </button>
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-xl border-2 border-secondary rounded-[var(--radius)] overflow-hidden shadow-lg z-50">
          {results.map((city) => (
            <button
              key={city.id}
              onClick={() => handleSelect(city)}
              className="w-full text-left px-6 py-3 hover:bg-accent transition-colors font-kawaii text-foreground flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-semibold">{city.name}</span>
              <span className="text-muted-foreground text-sm">
                {city.admin1 ? `${city.admin1}, ` : ""}{city.country}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
