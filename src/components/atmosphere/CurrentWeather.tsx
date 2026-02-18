import { Thermometer, Droplets, Wind, Eye, Zap, Gauge } from "lucide-react";
import type { CurrentWeatherData } from "@/lib/weatherApi";
import { getWeatherEmoji, formatLocalTime } from "@/lib/weatherApi";

interface CurrentWeatherProps {
  data: CurrentWeatherData;
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function StatItem({ icon, label, value }: StatItemProps) {
  return (
    <div className="stat-item">
      <div style={{ color: "hsl(var(--primary))" }}>{icon}</div>
      <span
        className="text-xs font-medium uppercase tracking-wider mt-1"
        style={{ color: "hsl(var(--muted-foreground))", fontFamily: "'Montserrat', sans-serif" }}
      >
        {label}
      </span>
      <span className="text-sm font-bold" style={{ color: "hsl(var(--foreground))" }}>
        {value}
      </span>
    </div>
  );
}

export default function CurrentWeather({ data }: CurrentWeatherProps) {
  const { location, current } = data;
  const emoji = getWeatherEmoji(current.weather_code, current.is_day);
  const localTime = formatLocalTime(location.localtime);

  return (
    <div className="glass-card p-6 md:p-8 fade-in-up">
      {/* Header row */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        {/* Left: location + temp */}
        <div className="flex-1">
          <h2
            className="text-3xl md:text-4xl font-bold mb-1"
            style={{
              background: "linear-gradient(135deg, hsl(var(--foreground)), hsl(var(--primary)))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {location.name}
          </h2>
          <p className="text-sm mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>
            {location.region && `${location.region}, `}{location.country}
          </p>
          <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))", opacity: 0.7 }}>
            {localTime}
          </p>

          {/* Big temperature */}
          <div className="mt-6 flex items-start gap-2">
            <span
              className="font-black leading-none"
              style={{
                fontSize: "clamp(4rem, 12vw, 7rem)",
                background: "linear-gradient(135deg, hsl(var(--foreground)), hsl(var(--primary)))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontFamily: "'Raleway', sans-serif",
              }}
            >
              {Math.round(current.temperature)}
            </span>
            <span
              className="text-3xl font-light mt-3"
              style={{ color: "hsl(var(--primary))" }}
            >
              °C
            </span>
          </div>
        </div>

        {/* Right: weather icon + description */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="float-icon text-7xl md:text-8xl select-none">{emoji}</div>
          {current.weather_icons[0] && (
            <img
              src={current.weather_icons[0]}
              alt={current.weather_descriptions[0]}
              className="w-10 h-10 rounded-lg opacity-80"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          )}
          <p
            className="text-sm font-semibold text-center max-w-24"
            style={{ color: "hsl(var(--accent))" }}
          >
            {current.weather_descriptions[0]}
          </p>
          <div
            className="text-xs px-3 py-1 rounded-full"
            style={{
              background: current.is_day === "yes"
                ? "hsla(48, 100%, 60%, 0.15)"
                : "hsla(230, 60%, 40%, 0.3)",
              border: `1px solid ${current.is_day === "yes" ? "hsla(48, 100%, 60%, 0.3)" : "hsla(217, 91%, 60%, 0.3)"}`,
              color: current.is_day === "yes" ? "hsl(48, 100%, 70%)" : "hsl(217, 91%, 80%)",
            }}
          >
            {current.is_day === "yes" ? "☀️ Daytime" : "🌙 Nighttime"}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="glow-divider my-6" />

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 fade-in-up-delay-1">
        <StatItem
          icon={<Thermometer size={18} />}
          label="Feels Like"
          value={`${Math.round(current.feelslike)}°C`}
        />
        <StatItem
          icon={<Droplets size={18} />}
          label="Humidity"
          value={`${current.humidity}%`}
        />
        <StatItem
          icon={<Wind size={18} />}
          label="Wind"
          value={`${current.wind_speed} km/h`}
        />
        <StatItem
          icon={<Eye size={18} />}
          label="Visibility"
          value={`${current.visibility} km`}
        />
        <StatItem
          icon={<Zap size={18} />}
          label="UV Index"
          value={String(current.uv_index)}
        />
        <StatItem
          icon={<Gauge size={18} />}
          label="Pressure"
          value={`${current.pressure} hPa`}
        />
      </div>

      {/* Wind direction badge */}
      <div className="mt-4 flex flex-wrap gap-2 fade-in-up-delay-2">
        <div
          className="text-xs px-3 py-1.5 rounded-full font-medium"
          style={{
            background: "hsla(217, 91%, 60%, 0.1)",
            border: "1px solid hsla(217, 91%, 60%, 0.2)",
            color: "hsl(var(--primary))",
          }}
        >
          💨 Wind Direction: {current.wind_dir}
        </div>
        <div
          className="text-xs px-3 py-1.5 rounded-full font-medium"
          style={{
            background: "hsla(217, 91%, 60%, 0.1)",
            border: "1px solid hsla(217, 91%, 60%, 0.2)",
            color: "hsl(var(--primary))",
          }}
        >
          ☁️ Cloud Cover: {current.cloudcover}%
        </div>
        {current.precip > 0 && (
          <div
            className="text-xs px-3 py-1.5 rounded-full font-medium"
            style={{
              background: "hsla(200, 100%, 50%, 0.1)",
              border: "1px solid hsla(200, 100%, 50%, 0.2)",
              color: "hsl(var(--accent))",
            }}
          >
            🌧️ Precip: {current.precip} mm
          </div>
        )}
      </div>
    </div>
  );
}
