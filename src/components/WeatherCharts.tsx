import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import type { DailyForecast } from "@/lib/weather-api";

interface Props {
  forecast: DailyForecast[];
  unit: "celsius" | "fahrenheit";
}

const WeatherCharts = ({ forecast, unit }: Props) => {
  const unitSymbol = unit === "celsius" ? "°C" : "°F";

  const data = forecast.map((day, i) => {
    const date = new Date(day.date + "T12:00:00");
    const label = i === 0
      ? "Hoje"
      : date.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
    return {
      name: label,
      max: day.tempMax,
      min: day.tempMin,
      precip: day.precipitationProbability,
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Temperature Chart */}
      <section
        className="animate-fade-in-up bg-card/90 backdrop-blur-xl border-2 border-secondary rounded-[var(--radius)] p-4 sm:p-6 shadow-[var(--kawaii-shadow-md)]"
        style={{ animationDelay: "0.25s" }}
      >
        <h3 className="font-kawaii font-bold text-base sm:text-lg text-foreground mb-4 flex items-center gap-2">
          🌡️ Temperatura ({unitSymbol})
        </h3>
        <div className="h-[200px] sm:h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradMax" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(330, 100%, 50%)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(330, 100%, 50%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradMin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(210, 80%, 60%)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(210, 80%, 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(330, 30%, 85%)" strokeOpacity={0.5} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fontFamily: "Fredoka", fill: "hsl(330, 40%, 55%)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fontFamily: "Fredoka", fill: "hsl(330, 40%, 55%)" }}
                axisLine={false}
                tickLine={false}
                unit="°"
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "2px solid hsl(330, 100%, 85%)",
                  fontFamily: "Fredoka",
                  fontSize: 13,
                  backgroundColor: "hsl(340, 100%, 97%)",
                }}
                formatter={(value: number, name: string) => [
                  `${value}${unitSymbol}`,
                  name === "max" ? "Máxima" : "Mínima",
                ]}
              />
              <Area
                type="monotone"
                dataKey="max"
                stroke="hsl(330, 100%, 50%)"
                strokeWidth={2.5}
                fill="url(#gradMax)"
                dot={{ r: 4, fill: "hsl(330, 100%, 50%)", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
              <Area
                type="monotone"
                dataKey="min"
                stroke="hsl(210, 80%, 60%)"
                strokeWidth={2.5}
                fill="url(#gradMin)"
                dot={{ r: 4, fill: "hsl(210, 80%, 60%)", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-2">
          <span className="flex items-center gap-1.5 font-kawaii text-xs text-muted-foreground">
            <span className="w-3 h-3 rounded-full bg-primary inline-block" /> Máxima
          </span>
          <span className="flex items-center gap-1.5 font-kawaii text-xs text-muted-foreground">
            <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: "hsl(210, 80%, 60%)" }} /> Mínima
          </span>
        </div>
      </section>

      {/* Precipitation Chart */}
      <section
        className="animate-fade-in-up bg-card/90 backdrop-blur-xl border-2 border-secondary rounded-[var(--radius)] p-4 sm:p-6 shadow-[var(--kawaii-shadow-md)]"
        style={{ animationDelay: "0.3s" }}
      >
        <h3 className="font-kawaii font-bold text-base sm:text-lg text-foreground mb-4 flex items-center gap-2">
          💧 Chance de Chuva (%)
        </h3>
        <div className="h-[200px] sm:h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradPrecip" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(210, 80%, 60%)" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="hsl(290, 80%, 65%)" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(330, 30%, 85%)" strokeOpacity={0.5} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fontFamily: "Fredoka", fill: "hsl(330, 40%, 55%)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fontFamily: "Fredoka", fill: "hsl(330, 40%, 55%)" }}
                axisLine={false}
                tickLine={false}
                unit="%"
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "2px solid hsl(330, 100%, 85%)",
                  fontFamily: "Fredoka",
                  fontSize: 13,
                  backgroundColor: "hsl(340, 100%, 97%)",
                }}
                formatter={(value: number) => [`${value}%`, "Precipitação"]}
              />
              <Bar
                dataKey="precip"
                fill="url(#gradPrecip)"
                radius={[8, 8, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default WeatherCharts;
