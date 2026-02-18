import { useState } from "react";
import { Wind, Eye, Loader2 } from "lucide-react";
import { MapPin } from "lucide-react";
import type { MarineWeatherData } from "@/lib/weatherApi";

interface MarineWeatherProps {
  onFetch: (location: string) => void;
  data: MarineWeatherData | null;
  isLoading: boolean;
  error: string | null;
}

interface MarineStatProps {
  icon: string;
  label: string;
  value: string;
  sub?: string;
}

function MarineStat({ icon, label, value, sub }: MarineStatProps) {
  return (
    <div
      className="flex flex-col items-center gap-1 p-4 rounded-xl text-center transition-all duration-200"
      style={{
        background: "hsla(200, 60%, 8%, 0.5)",
        border: "1px solid hsla(200, 100%, 50%, 0.15)",
      }}
    >
      <span className="text-2xl">{icon}</span>
      <span
        className="text-xs font-medium uppercase tracking-wider"
        style={{ color: "hsl(200, 60%, 65%)", fontFamily: "'Montserrat', sans-serif" }}
      >
        {label}
      </span>
      <span className="text-xl font-bold" style={{ color: "hsl(var(--foreground))" }}>{value}</span>
      {sub && <span className="text-xs" style={{ color: "hsl(200, 60%, 55%)" }}>{sub}</span>}
    </div>
  );
}

const MARINE_PRESETS = [
  "Pacific Ocean",
  "Atlantic Ocean",
  "Mediterranean Sea",
  "North Sea",
  "Caribbean Sea",
];

export default function MarineWeather({ onFetch, data, isLoading, error }: MarineWeatherProps) {
  const [location, setLocation] = useState("");

  const handleFetch = (loc?: string) => {
    const q = loc || location.trim();
    if (!q) return;
    onFetch(q);
    if (loc) setLocation(loc);
  };

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="glass-card-marine p-5 fade-in-up">
        <h3
          className="text-sm font-bold mb-4 uppercase tracking-widest"
          style={{ color: "hsl(200, 60%, 70%)" }}
        >
          🌊 Marine Weather Lookup
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <MapPin size={16} style={{ color: "hsl(200, 100%, 60%)", opacity: 0.8 }} />
            </div>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFetch()}
              placeholder="e.g. Pacific Ocean, 48.8566,2.3522..."
              className="glass-input w-full pl-10 pr-4 py-3 text-sm"
              style={{
                fontFamily: "'Raleway', sans-serif",
                borderColor: "hsla(200, 100%, 50%, 0.25)",
              }}
            />
          </div>
          <button
            onClick={() => handleFetch()}
            disabled={isLoading || !location.trim()}
            className="btn-gradient px-6 py-3 flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style={{
              background: "linear-gradient(135deg, hsl(200, 100%, 40%), hsl(217, 91%, 55%))",
            }}
          >
            {isLoading ? <Loader2 size={15} className="animate-spin" /> : <span>🌊</span>}
            <span>Get Marine Data</span>
          </button>
        </div>

        {/* Preset locations */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs" style={{ color: "hsl(200, 60%, 65%)", alignSelf: "center" }}>Quick:</span>
          {MARINE_PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => handleFetch(preset)}
              className="text-xs px-3 py-1.5 rounded-full transition-all duration-200"
              style={{
                background: "hsla(200, 60%, 15%, 0.5)",
                border: "1px solid hsla(200, 100%, 50%, 0.2)",
                color: "hsl(200, 80%, 70%)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "hsla(200, 60%, 20%, 0.6)";
                e.currentTarget.style.borderColor = "hsla(200, 100%, 50%, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "hsla(200, 60%, 15%, 0.5)";
                e.currentTarget.style.borderColor = "hsla(200, 100%, 50%, 0.2)";
              }}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          className="glass-card-marine error-glow p-5 fade-in-up"
          style={{ borderColor: "hsla(0, 84%, 60%, 0.3)" }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-semibold text-sm mb-1" style={{ color: "hsl(var(--destructive))" }}>
                Marine data unavailable
              </p>
              <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{error}</p>
              <p className="text-xs mt-1" style={{ color: "hsl(200, 60%, 65%)" }}>
                Try entering coordinates (lat,lon) or a coastal city name.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Marine data card */}
      {data && (
        <div className="glass-card-marine p-6 md:p-8 fade-in-up">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-3xl">⚓</span>
                <h2
                  className="text-2xl md:text-3xl font-bold"
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--foreground)), hsl(200, 100%, 70%))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {data.location?.name || "Marine Station"}
                </h2>
              </div>
              <p className="text-sm" style={{ color: "hsl(200, 60%, 65%)" }}>
                {data.location?.country && `${data.location.country} · `}
                {data.location?.localtime}
              </p>
              <p className="text-xs mt-1 font-medium" style={{ color: "hsl(200, 80%, 60%)" }}>
                {data.current?.weather_descriptions?.[0]}
              </p>
            </div>
            <div className="float-icon text-5xl">🌊</div>
          </div>

          <div
            className="h-px mb-6"
            style={{ background: "linear-gradient(90deg, transparent, hsla(200, 100%, 60%, 0.4), transparent)" }}
          />

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            <MarineStat
              icon="🌡️"
              label="Sea Temp"
              value={`${data.current?.temperature ?? "—"}°C`}
              sub="surface"
            />
            <MarineStat
              icon="💨"
              label="Wind Speed"
              value={`${data.current?.wind_speed ?? "—"} km/h`}
              sub={data.current?.wind_dir}
            />
            <MarineStat
              icon="👁️"
              label="Visibility"
              value={`${data.current?.visibility ?? "—"} km`}
            />
            <MarineStat
              icon="💧"
              label="Humidity"
              value={`${data.current?.humidity ?? "—"}%`}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MarineStat
              icon="🌬️"
              label="Pressure"
              value={`${data.current?.pressure ?? "—"} hPa`}
            />
            <MarineStat
              icon="☁️"
              label="Cloud Cover"
              value={`${data.current?.cloudcover ?? "—"}%`}
            />
            <MarineStat
              icon="🌞"
              label="UV Index"
              value={`${data.current?.uv_index ?? "—"}`}
            />
            <MarineStat
              icon="🌡️"
              label="Feels Like"
              value={`${data.current?.feelslike ?? "—"}°C`}
            />
          </div>

          {/* Tide data if available */}
          {data.marine?.tides && data.marine.tides.length > 0 && (
            <div className="mt-5">
              <p
                className="text-xs uppercase tracking-widest mb-3 font-semibold"
                style={{ color: "hsl(200, 60%, 65%)" }}
              >
                🌊 Tide Information
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {data.marine.tides[0]?.tide_data?.slice(0, 4).map((tide, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-3 text-center"
                    style={{
                      background: "hsla(200, 60%, 8%, 0.5)",
                      border: "1px solid hsla(200, 100%, 50%, 0.15)",
                    }}
                  >
                    <p className="text-xs mb-1" style={{ color: "hsl(200, 60%, 65%)" }}>
                      {tide.tideTime}
                    </p>
                    <p className="font-bold text-sm">{tide.tideHeight_mt}m</p>
                    <p
                      className="text-xs mt-1 capitalize"
                      style={{ color: tide.tide_type === "HIGH" ? "hsl(200, 100%, 70%)" : "hsl(217, 91%, 70%)" }}
                    >
                      {tide.tide_type.toLowerCase()} tide
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Marine info note */}
          <div
            className="mt-5 rounded-xl p-4"
            style={{
              background: "hsla(200, 60%, 8%, 0.4)",
              border: "1px solid hsla(200, 100%, 50%, 0.1)",
            }}
          >
            <div className="flex items-start gap-3">
              <Wind size={16} style={{ color: "hsl(200, 100%, 60%)", flexShrink: 0, marginTop: 2 }} />
              <div className="text-xs" style={{ color: "hsl(200, 60%, 65%)" }}>
                <p className="font-semibold mb-1">Marine Observation</p>
                <p>
                  Observation time: {data.current?.observation_time}. 
                  For wave height and detailed marine parameters, coordinates-based queries (lat,lon) 
                  provide the most accurate ocean data.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info card when no data */}
      {!data && !error && !isLoading && (
        <div className="glass-card-marine p-8 fade-in-up text-center">
          <div className="float-icon text-6xl mb-4">🌊</div>
          <h3 className="text-lg font-bold mb-2" style={{ color: "hsl(200, 80%, 80%)" }}>
            Marine Weather Intelligence
          </h3>
          <p className="text-sm max-w-md mx-auto" style={{ color: "hsl(200, 60%, 65%)" }}>
            Enter ocean coordinates or a marine location name to access real-time 
            maritime weather conditions including wind, visibility, and pressure data.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {["⚓", "🐳", "🚢", "🐠", "🌊"].map((e, i) => (
              <span key={i} className="text-2xl">{e}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
