import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

const THEME_KEY = "kawaii-weather-theme";

const ThemeToggle = () => {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      className="fixed top-4 right-4 z-50 w-12 h-12 rounded-full bg-card border-2 border-secondary shadow-[var(--kawaii-shadow-md)] flex items-center justify-center hover:scale-110 transition-transform"
      aria-label={dark ? "Modo claro" : "Modo escuro"}
    >
      {dark ? (
        <Sun className="w-5 h-5 text-primary animate-spin-slow" />
      ) : (
        <Moon className="w-5 h-5 text-primary" />
      )}
    </button>
  );
};

export default ThemeToggle;
