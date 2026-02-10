import { useState, useEffect, useCallback } from "react";
import FloatingHearts from "@/components/FloatingHearts";
import ThemeToggle from "@/components/ThemeToggle";
import SearchBar from "@/components/SearchBar";
import WeatherDisplay from "@/components/WeatherDisplay";
import ForecastSection from "@/components/ForecastSection";
import AdditionalInfo from "@/components/AdditionalInfo";
import WeatherCharts from "@/components/WeatherCharts";
import WeatherMap from "@/components/WeatherMap";
import SearchHistory from "@/components/SearchHistory";
import {
  type GeoResult,
  type WeatherData,
  type TideData,
  getWeather,
  getMarineData,
} from "@/lib/weather-api";


const HISTORY_KEY = "kawaii-weather-history";

const Index = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [tideData, setTideData] = useState<TideData | null>(null);
  const [cityName, setCityName] = useState("");
  const [lat, setLat] = useState(-23.55);
  const [lon, setLon] = useState(-46.63);
  const [unit, setUnit] = useState<"celsius" | "fahrenheit">("celsius");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<GeoResult[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    } catch {
      return [];
    }
  });

  const fetchWeather = useCallback(
    async (latitude: number, longitude: number, name: string) => {
      setLoading(true);
      try {
        const [w, t] = await Promise.all([
          getWeather(latitude, longitude, unit),
          getMarineData(latitude, longitude),
        ]);
        setWeather(w);
        setTideData(t);
        setCityName(name);
        setLat(latitude);
        setLon(longitude);
      } catch (err) {
        console.error("Erro ao buscar clima:", err);
      } finally {
        setLoading(false);
      }
    },
    [unit]
  );

  // Load São Paulo on mount
  useEffect(() => {
    fetchWeather(-23.55, -46.63, "São Paulo, Brasil");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch when unit changes
  useEffect(() => {
    if (lat && lon && cityName) {
      fetchWeather(lat, lon, cityName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  const handleSelectCity = (city: GeoResult) => {
    const name = `${city.name}${city.country ? `, ${city.country}` : ""}`;
    fetchWeather(city.latitude, city.longitude, name);

    // Add to history (max 10, no duplicates)
    setHistory((prev) => {
      const filtered = prev.filter((c) => c.id !== city.id);
      const updated = [city, ...filtered].slice(0, 10);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[var(--kawaii-gradient-soft)]">
      <FloatingHearts />
      <ThemeToggle />

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Header */}
        <header className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2 sm:mb-3">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-secondary/60 border-2 border-primary/30 flex items-center justify-center animate-logo-float drop-shadow-md">
              <span className="text-2xl sm:text-3xl">💖</span>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-kawaii font-extrabold text-foreground leading-none">
                Kawaii <span className="text-lg sm:text-xl md:text-2xl font-light text-primary">Weather</span>
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground font-kawaii text-sm sm:text-lg">
            Previsão do tempo
          </p>
        </header>

        {/* Search */}
        <div className="mb-6">
          <SearchBar onSelectCity={handleSelectCity} />
        </div>

        {/* Search History */}
        <div className="mb-6">
          <SearchHistory history={history} onSelect={handleSelectCity} onClear={clearHistory} />
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-5xl animate-heartbeat mb-4">💕</div>
            <p className="font-kawaii text-muted-foreground text-lg">Buscando dados kawaii...</p>
          </div>
        )}

        {/* Content */}
        {weather && !loading && (
          <div className="space-y-6">
            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <WeatherDisplay
                  weather={weather}
                  cityName={cityName}
                  unit={unit}
                  onToggleUnit={() => setUnit((u) => (u === "celsius" ? "fahrenheit" : "celsius"))}
                />
              </div>
              <div className="space-y-6">
                <ForecastSection forecast={weather.daily} unit={unit} />
              </div>
            </div>

            {/* Charts */}
            <WeatherCharts forecast={weather.daily} unit={unit} />

            {/* Map + Additional */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeatherMap lat={lat} lon={lon} cityName={cityName} />
              <AdditionalInfo weather={weather} tideData={tideData} unit={unit} />
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-12 py-8">
          <div className="text-2xl mb-2">💕</div>
          <p className="font-kawaii text-muted-foreground text-sm">
            Kawaii Weather — Dados meteorológicos via Open-Meteo API
          </p>
          <p className="font-kawaii text-muted-foreground text-xs mt-1">
            Copyright © 2026 Alissa Sousa
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
