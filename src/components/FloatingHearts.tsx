import { useEffect, useState } from "react";

interface Heart {
  id: number;
  left: number;
  duration: number;
  delay: number;
  size: number;
}

const FloatingHearts = () => {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const initial = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
      size: Math.random() * 16 + 12,
    }));
    setHearts(initial);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute animate-float-heart opacity-40"
          style={{
            left: `${h.left}%`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            fontSize: `${h.size}px`,
            color: "hsl(var(--kawaii-pink))",
          }}
        >
          💕
        </span>
      ))}
    </div>
  );
};

export default FloatingHearts;
