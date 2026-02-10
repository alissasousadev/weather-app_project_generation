import { Heart, Droplets, Wind, Gauge } from "lucide-react";
import type { WeatherData } from "@/lib/weather-api";
import { getWeatherDescription } from "@/lib/weather-api";
import KawaiiWeatherIcon from "@/components/KawaiiWeatherIcon";

interface Props {
  weather: WeatherData;
  cityName: string;
  unit: "celsius" | "fahrenheit";
  onToggleUnit: () => void;
}

const WeatherDisplay = ({ weather, cityName, unit, onToggleUnit }: Props) => {
  const unitSymbol = unit === "celsius" ? "°C" : "°F";
  const windUnit = unit === "celsius" ? "km/h" : "mph";
  const now = new Date();
  const dateStr = now.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="animate-fade-in-up bg-card/90 backdrop-blur-xl border-2 border-secondary rounded-[var(--radius)] p-4 sm:p-6 md:p-8 shadow-[var(--kawaii-shadow-lg)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-kawaii font-bold text-foreground">
            {cityName}
          </h2>
          <p className="text-muted-foreground font-kawaii capitalize text-sm sm:text-base">📅 {dateStr}</p>
        </div>
        <div className="flex gap-1 bg-secondary/60 rounded-full p-1">
          <button
            onClick={unit === "celsius" ? undefined : onToggleUnit}
            className={`px-4 py-2 rounded-full font-kawaii font-bold text-sm transition-all ${
              unit === "celsius"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            °C
          </button>
          <button
            onClick={unit === "fahrenheit" ? undefined : onToggleUnit}
            className={`px-4 py-2 rounded-full font-kawaii font-bold text-sm transition-all ${
              unit === "fahrenheit"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            °F
          </button>
        </div>
      </div>

      {/* Temperature */}
      <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
        <div className="text-center sm:text-left flex-1">
          <div className="text-5xl sm:text-7xl md:text-8xl font-kawaii font-extrabold text-foreground leading-none">
            {weather.temperature}°
          </div>
          <div className="text-base sm:text-xl font-kawaii text-primary font-semibold mt-2">
            {getWeatherDescription(weather.weatherCode)}
          </div>
        </div>
        <div className="animate-heartbeat select-none">
          <KawaiiWeatherIcon code={weather.weatherCode} isDay={weather.isDay} size="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40" />
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <DetailCard icon={<Heart className="w-5 h-5" />} value={`${weather.feelsLike}${unitSymbol}`} label="Sensação Térmica" />
        <DetailCard icon={<Droplets className="w-5 h-5" />} value={`${weather.humidity}%`} label="Umidade" />
        <DetailCard icon={<Wind className="w-5 h-5" />} value={`${weather.windSpeed} ${windUnit}`} label="Vento" />
        <DetailCard icon={<Gauge className="w-5 h-5" />} value={`${weather.pressure} hPa`} label="Pressão" />
      </div>
    </section>
  );
};

function DetailCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="bg-accent/60 rounded-[calc(var(--radius)-4px)] p-3 sm:p-4 text-center border border-secondary/50">
      <div className="flex justify-center text-primary mb-1 sm:mb-2">{icon}</div>
      <div className="font-kawaii font-bold text-foreground text-sm sm:text-lg">{value}</div>
      <div className="font-kawaii text-muted-foreground text-[10px] sm:text-xs">{label}</div>
    </div>
  );
}

export default WeatherDisplay;
