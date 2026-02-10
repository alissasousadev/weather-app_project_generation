import kittySunny from "@/assets/kitty-sunny.png";
import kittyNight from "@/assets/kitty-night.png";
import kittyPartlyCloudy from "@/assets/kitty-partly-cloudy.png";
import kittyCloudy from "@/assets/kitty-cloudy.png";
import kittyFog from "@/assets/kitty-fog.png";
import kittyDrizzle from "@/assets/kitty-drizzle.png";
import kittyRain from "@/assets/kitty-rain.png";
import kittySnow from "@/assets/kitty-snow.png";
import kittyStorm from "@/assets/kitty-storm.png";

export function getKawaiiWeatherImage(code: number, isDay: boolean): string {
  if (code === 0) return isDay ? kittySunny : kittyNight;
  if (code <= 3) return isDay ? kittyPartlyCloudy : kittyCloudy;
  if (code <= 48) return kittyFog;
  if (code <= 55) return kittyDrizzle;
  if (code <= 65) return kittyRain;
  if (code <= 75) return kittySnow;
  if (code <= 82) return kittyRain;
  return kittyStorm;
}

interface Props {
  code: number;
  isDay?: boolean;
  size?: string;
  className?: string;
}

const KawaiiWeatherIcon = ({ code, isDay = true, size = "w-12 h-12", className = "" }: Props) => {
  const src = getKawaiiWeatherImage(code, isDay);
  return (
    <img
      src={src}
      alt="Weather icon"
      className={`${size} object-contain ${className}`}
      draggable={false}
    />
  );
};

export default KawaiiWeatherIcon;
