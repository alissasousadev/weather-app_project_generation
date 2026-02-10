import { Sun, Moon, Eye, CloudRain, Cloud, Snowflake, Waves } from "lucide-react";
import type { WeatherData, TideData } from "@/lib/weather-api";

interface Props {
  weather: WeatherData;
  tideData: TideData | null;
  unit: "celsius" | "fahrenheit";
}

const AdditionalInfo = ({ weather, tideData, unit }: Props) => {
  const unitSymbol = unit === "celsius" ? "°" : "°F";

  // Find high/low tide times from hourly wave data
  let tideHighTime = "--:--";
  let tideLowTime = "--:--";
  let tideHighVal = 0;
  let tideLowVal = Infinity;

  if (tideData?.hourly) {
    tideData.hourly.forEach((h) => {
      if (h.waveHeight > tideHighVal) {
        tideHighVal = h.waveHeight;
        tideHighTime = h.time;
      }
      if (h.waveHeight < tideLowVal) {
        tideLowVal = h.waveHeight;
        tideLowTime = h.time;
      }
    });
  }

  const cards = [
    { icon: <Sun className="w-5 h-5" />, value: weather.sunrise, label: "Nascer do Sol" },
    { icon: <Moon className="w-5 h-5" />, value: weather.sunset, label: "Pôr do Sol" },
    { icon: <Eye className="w-5 h-5" />, value: `${weather.visibility} km`, label: "Visibilidade" },
    { icon: <CloudRain className="w-5 h-5" />, value: `${weather.precipitation} mm`, label: "Precipitação" },
    { icon: <Cloud className="w-5 h-5" />, value: `${weather.cloudCover}%`, label: "Nebulosidade" },
    { icon: <Snowflake className="w-5 h-5" />, value: `${weather.dewPoint}${unitSymbol}`, label: "Ponto de Orvalho" },
  ];

  if (tideData) {
    cards.push(
      { icon: <Waves className="w-5 h-5" />, value: `${tideHighTime} (${tideHighVal.toFixed(1)}m)`, label: "Maré Alta" },
      { icon: <Waves className="w-5 h-5" />, value: `${tideLowTime} (${tideLowVal.toFixed(1)}m)`, label: "Maré Baixa" },
    );
  }

  return (
    <section
      className="animate-fade-in-up bg-card/90 backdrop-blur-xl border-2 border-secondary rounded-[var(--radius)] p-4 sm:p-6 shadow-[var(--kawaii-shadow-md)]"
      style={{ animationDelay: "0.2s" }}
    >
      <h3 className="font-kawaii font-bold text-lg text-foreground mb-4 flex items-center gap-2">
        ⭐ Informações Especiais
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-accent/60 rounded-[calc(var(--radius)-4px)] p-3 sm:p-4 text-center border border-secondary/50 hover:border-primary/30 transition-colors"
          >
            <div className="flex justify-center text-primary mb-1 sm:mb-2">{card.icon}</div>
            <div className="font-kawaii font-bold text-foreground text-xs sm:text-sm">{card.value}</div>
            <div className="font-kawaii text-muted-foreground text-[10px] sm:text-xs">{card.label}</div>
          </div>
        ))}
      </div>
      {tideData && (
        <div className="mt-4 p-4 bg-accent/40 rounded-[calc(var(--radius)-4px)] border border-secondary/50">
          <p className="font-kawaii text-sm text-muted-foreground text-center">
            🌊 Altura atual das ondas: <strong className="text-foreground">{tideData.waveHeight?.toFixed(1) ?? '0.0'}m</strong> | 
            Período: <strong className="text-foreground">{tideData.wavePeriod?.toFixed(0) ?? '0'}s</strong>
          </p>
        </div>
      )}
    </section>
  );
};

export default AdditionalInfo;
