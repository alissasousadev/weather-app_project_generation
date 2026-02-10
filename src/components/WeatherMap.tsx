import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix default Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface Props {
  lat: number;
  lon: number;
  cityName: string;
}

const WeatherMap = ({ lat, lon, cityName }: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lon], 10);
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapInstanceRef.current!.removeLayer(layer);
        }
      });
      L.marker([lat, lon]).addTo(mapInstanceRef.current).bindPopup(`💕 ${cityName}`).openPopup();
      return;
    }

    const map = L.map(mapRef.current).setView([lat, lon], 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);
    L.marker([lat, lon]).addTo(map).bindPopup(`💕 ${cityName}`).openPopup();
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lon, cityName]);

  return (
    <div
      className="animate-fade-in-up bg-card/90 backdrop-blur-xl border-2 border-secondary rounded-[var(--radius)] overflow-hidden shadow-[var(--kawaii-shadow-md)]"
      style={{ animationDelay: "0.15s" }}
    >
      <h3 className="font-kawaii font-bold text-base sm:text-lg text-foreground p-3 sm:p-4 pb-0 flex items-center gap-2">
        🗺️ Mapa
      </h3>
      <div ref={mapRef} className="h-[220px] sm:h-[300px] m-3 sm:m-4 mt-2 sm:mt-3 rounded-[calc(var(--radius)-4px)]" />
    </div>
  );
};

export default WeatherMap;
