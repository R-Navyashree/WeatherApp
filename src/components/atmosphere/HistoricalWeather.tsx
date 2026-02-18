import { useState } from "react";
import { CalendarIcon, Thermometer, Sun, Droplets, Loader2 } from "lucide-react";
import type { HistoricalWeatherData } from "@/lib/weatherApi";

interface HistoricalWeatherProps {
  onFetch: (city: string, date: string) => void;
  data: HistoricalWeatherData | null;
  isLoading: boolean;
  error: string | null;
  lastCity: string;
}

export default function HistoricalWeather({ onFetch, data, isLoading, error, lastCity }: HistoricalWeatherProps) {
  const [city, setCity] = useState(lastCity || "");
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split("T")[0];
  });

  const handleFetch = () => {
    const c = city.trim() || lastCity;
    if (!c || !date) return;
    onFetch(c, date);
  };

  // Get historical day data
  const historicalDay = data?.historical ? Object.values(data.historical)[0] : null;

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="glass-card p-5 fade-in-up">
        <h3
          className="text-sm font-bold mb-4 uppercase tracking-widest"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          📅 Historical Weather Lookup
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder={lastCity || "Enter city name..."}
              className="glass-input w-full px-4 py-3 text-sm"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            />
          </div>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <CalendarIcon size={16} style={{ color: "hsl(var(--primary))", opacity: 0.8 }} />
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="glass-input pl-9 pr-4 py-3 text-sm cursor-pointer"
              style={{
                fontFamily: "'Raleway', sans-serif",
                colorScheme: "dark",
              }}
            />
          </div>
          <button
            onClick={handleFetch}
            disabled={isLoading || (!city.trim() && !lastCity)}
            className="btn-gradient px-6 py-3 flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? <Loader2 size={15} className="animate-spin" /> : <CalendarIcon size={15} />}
            <span>Get History</span>
          </button>
        </div>
        <p className="text-xs mt-2" style={{ color: "hsl(var(--muted-foreground))", opacity: 0.6 }}>
          Note: Historical data requires a paid Weatherstack plan.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div
          className="glass-card error-glow p-5 fade-in-up"
          style={{ borderColor: "hsla(0, 84%, 60%, 0.3)" }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-semibold text-sm mb-1" style={{ color: "hsl(var(--destructive))" }}>
                Unable to fetch historical data
              </p>
              <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {data && historicalDay && (
        <div className="glass-card p-6 md:p-8 fade-in-up">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <h2
                className="text-2xl md:text-3xl font-bold mb-1"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--foreground)), hsl(var(--primary)))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {data.location?.name}
              </h2>
              <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                {data.location?.country} · {historicalDay.date}
              </p>
            </div>
            <div className="text-4xl">{historicalDay.avgtemp > 25 ? "☀️" : historicalDay.avgtemp > 10 ? "🌤️" : "❄️"}</div>
          </div>

          <div className="glow-divider mb-6" />

          {/* Temperature range */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            <div className="stat-item">
              <Thermometer size={18} style={{ color: "hsl(var(--destructive))" }} />
              <span className="text-xs font-medium uppercase tracking-wider mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>Max Temp</span>
              <span className="text-lg font-bold" style={{ color: "hsl(var(--foreground))" }}>{historicalDay.maxtemp}°C</span>
            </div>
            <div className="stat-item">
              <Thermometer size={18} style={{ color: "hsl(var(--accent))" }} />
              <span className="text-xs font-medium uppercase tracking-wider mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>Min Temp</span>
              <span className="text-lg font-bold" style={{ color: "hsl(var(--foreground))" }}>{historicalDay.mintemp}°C</span>
            </div>
            <div className="stat-item">
              <Thermometer size={18} style={{ color: "hsl(var(--primary))" }} />
              <span className="text-xs font-medium uppercase tracking-wider mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>Avg Temp</span>
              <span className="text-lg font-bold" style={{ color: "hsl(var(--foreground))" }}>{historicalDay.avgtemp}°C</span>
            </div>
            <div className="stat-item">
              <Sun size={18} style={{ color: "hsl(48, 100%, 70%)" }} />
              <span className="text-xs font-medium uppercase tracking-wider mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>Sun Hours</span>
              <span className="text-lg font-bold" style={{ color: "hsl(var(--foreground))" }}>{historicalDay.sunhour}h</span>
            </div>
          </div>

          {/* Astronomy */}
          {historicalDay.astro && (
            <div
              className="rounded-xl p-4"
              style={{
                background: "hsla(230, 40%, 10%, 0.4)",
                border: "1px solid hsla(217, 91%, 60%, 0.1)",
              }}
            >
              <p
                className="text-xs uppercase tracking-widest mb-3 font-semibold"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                🌅 Astronomy
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <span style={{ color: "hsl(var(--muted-foreground))" }}>Sunrise</span>
                  <p className="font-semibold">{historicalDay.astro.sunrise}</p>
                </div>
                <div>
                  <span style={{ color: "hsl(var(--muted-foreground))" }}>Sunset</span>
                  <p className="font-semibold">{historicalDay.astro.sunset}</p>
                </div>
                <div>
                  <span style={{ color: "hsl(var(--muted-foreground))" }}>Moonrise</span>
                  <p className="font-semibold">{historicalDay.astro.moonrise}</p>
                </div>
                <div>
                  <span style={{ color: "hsl(var(--muted-foreground))" }}>Moonset</span>
                  <p className="font-semibold">{historicalDay.astro.moonset}</p>
                </div>
              </div>
            </div>
          )}

          {/* Hourly preview */}
          {historicalDay.hourly && historicalDay.hourly.length > 0 && (
            <div className="mt-5">
              <p
                className="text-xs uppercase tracking-widest mb-3 font-semibold"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                ⏱️ Hourly Breakdown
              </p>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {historicalDay.hourly.slice(0, 6).map((h) => (
                  <div
                    key={h.time}
                    className="rounded-xl p-3 text-center"
                    style={{
                      background: "hsla(230, 40%, 10%, 0.4)",
                      border: "1px solid hsla(217, 91%, 60%, 0.1)",
                    }}
                  >
                    <p className="text-xs mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {String(parseInt(h.time) / 100).padStart(2, "0")}:00
                    </p>
                    <p className="font-bold text-sm">{h.temperature}°</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Droplets size={10} style={{ color: "hsl(var(--accent))" }} />
                      <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{h.humidity}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
