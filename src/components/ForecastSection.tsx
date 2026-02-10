import type { DailyForecast } from "@/lib/weather-api";
import { getWeatherIcon } from "@/lib/weather-api";

interface Props {
  forecast: DailyForecast[];
  unit: "celsius" | "fahrenheit";
}

const ForecastSection = ({ forecast }: Props) => {
  return (
    <section className="animate-fade-in-up bg-card/90 backdrop-blur-xl border-2 border-secondary rounded-[var(--radius)] p-6 shadow-[var(--kawaii-shadow-md)]"
      style={{ animationDelay: "0.1s" }}
    >
      <h3 className="font-kawaii font-bold text-lg text-foreground mb-4 flex items-center gap-2">
        📅 Previsão 7 Dias
      </h3>
      <div className="space-y-2">
        {forecast.map((day, i) => {
          const date = new Date(day.date + "T12:00:00");
          const dayName = i === 0
            ? "Hoje"
            : date.toLocaleDateString("pt-BR", { weekday: "short" });
          const dayNum = date.toLocaleDateString("pt-BR", { day: "numeric", month: "short" });

          return (
            <div
              key={day.date}
              className="flex items-center justify-between py-2 sm:py-3 px-2 sm:px-4 rounded-[calc(var(--radius)-4px)] hover:bg-accent/60 transition-colors border border-transparent hover:border-secondary/50 gap-1 sm:gap-2"
            >
              <div className="flex items-center gap-1 sm:gap-3 min-w-[70px] sm:min-w-[100px]">
                <span className="font-kawaii font-semibold text-foreground capitalize text-xs sm:text-sm w-8 sm:w-12">
                  {dayName}
                </span>
                <span className="text-muted-foreground text-[10px] sm:text-sm font-kawaii hidden sm:inline">{dayNum}</span>
              </div>
              <span className="text-lg sm:text-2xl">{getWeatherIcon(day.weatherCode, true)}</span>
              <div className="flex items-center gap-1 sm:gap-2 font-kawaii text-xs sm:text-sm">
                <span className="font-bold text-foreground">{day.tempMax}°</span>
                <span className="text-muted-foreground">{day.tempMin}°</span>
              </div>
              <span className="text-[10px] sm:text-sm text-primary font-kawaii">💧{day.precipitationProbability}%</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ForecastSection;
