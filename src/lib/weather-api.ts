// Open-Meteo APIs - free, no API key needed

export interface GeoResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  country_code: string;
}

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  weatherCode: number;
  isDay: boolean;
  precipitation: number;
  cloudCover: number;
  dewPoint: number;
  visibility: number;
  sunrise: string;
  sunset: string;
  daily: DailyForecast[];
}

export interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  precipitationProbability: number;
}

export interface TideData {
  waveHeight: number;
  wavePeriod: number;
  waveDirection: number;
  hourly: { time: string; waveHeight: number }[];
}

export async function searchCities(query: string): Promise<GeoResult[]> {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=pt`
  );
  const data = await res.json();
  return data.results || [];
}

export async function getWeather(lat: number, lon: number, unit: "celsius" | "fahrenheit"): Promise<WeatherData> {
  const tempUnit = unit === "fahrenheit" ? "&temperature_unit=fahrenheit" : "";
  const windUnit = unit === "fahrenheit" ? "&wind_speed_unit=mph" : "";
  
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,dew_point_2m,visibility` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max` +
    `&timezone=auto&forecast_days=7${tempUnit}${windUnit}`
  );
  const data = await res.json();
  
  const c = data.current;
  const d = data.daily;

  return {
    temperature: Math.round(c.temperature_2m),
    feelsLike: Math.round(c.apparent_temperature),
    humidity: c.relative_humidity_2m,
    windSpeed: Math.round(c.wind_speed_10m),
    pressure: Math.round(c.pressure_msl),
    weatherCode: c.weather_code,
    isDay: c.is_day === 1,
    precipitation: c.precipitation,
    cloudCover: c.cloud_cover,
    dewPoint: Math.round(c.dew_point_2m),
    visibility: Math.round((c.visibility || 10000) / 1000),
    sunrise: d.sunrise[0].split("T")[1],
    sunset: d.sunset[0].split("T")[1],
    daily: d.time.map((t: string, i: number) => ({
      date: t,
      tempMax: Math.round(d.temperature_2m_max[i]),
      tempMin: Math.round(d.temperature_2m_min[i]),
      weatherCode: d.weather_code[i],
      precipitationProbability: d.precipitation_probability_max[i] || 0,
    })),
  };
}

export async function getMarineData(lat: number, lon: number): Promise<TideData | null> {
  try {
    const res = await fetch(
      `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}` +
      `&current=wave_height,wave_period,wave_direction` +
      `&hourly=wave_height&forecast_days=1&timezone=auto`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const c = data.current;
    // If all current values are null, this is not a coastal location
    if (c.wave_height == null && c.wave_period == null && c.wave_direction == null) {
      return null;
    }
    return {
      waveHeight: c.wave_height ?? 0,
      wavePeriod: c.wave_period ?? 0,
      waveDirection: c.wave_direction ?? 0,
      hourly: (data.hourly?.time || [])
        .map((t: string, i: number) => ({
          time: t.split("T")[1],
          waveHeight: data.hourly.wave_height[i] as number | null,
        }))
        .filter((h: { waveHeight: number | null }) => h.waveHeight != null) as { time: string; waveHeight: number }[],
    };
  } catch {
    return null;
  }
}

export function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: "Céu Limpo ☀️",
    1: "Parcialmente Limpo 🌤️",
    2: "Parcialmente Nublado ⛅",
    3: "Nublado ☁️",
    45: "Neblina 🌫️",
    48: "Neblina Gelada 🌫️",
    51: "Garoa Leve 🌦️",
    53: "Garoa Moderada 🌦️",
    55: "Garoa Forte 🌧️",
    61: "Chuva Leve 🌧️",
    63: "Chuva Moderada 🌧️",
    65: "Chuva Forte 🌧️",
    71: "Neve Leve ❄️",
    73: "Neve Moderada ❄️",
    75: "Neve Forte ❄️",
    80: "Pancadas Leves 🌦️",
    81: "Pancadas Moderadas 🌧️",
    82: "Pancadas Fortes ⛈️",
    95: "Tempestade ⛈️",
    96: "Tempestade com Granizo ⛈️",
    99: "Tempestade Severa ⛈️",
  };
  return descriptions[code] || "Indefinido";
}

export function getWeatherIcon(code: number, isDay: boolean): string {
  if (code === 0) return isDay ? "☀️" : "🌙";
  if (code <= 3) return isDay ? "⛅" : "☁️";
  if (code <= 48) return "🌫️";
  if (code <= 55) return "🌦️";
  if (code <= 65) return "🌧️";
  if (code <= 75) return "❄️";
  if (code <= 82) return "🌧️";
  return "⛈️";
}
