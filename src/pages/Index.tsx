import { useState, useCallback } from "react";
import ParticleBackground from "@/components/atmosphere/ParticleBackground";
import SearchBar from "@/components/atmosphere/SearchBar";
import TabNav from "@/components/atmosphere/TabNav";
import CurrentWeather from "@/components/atmosphere/CurrentWeather";
import HistoricalWeather from "@/components/atmosphere/HistoricalWeather";
import MarineWeather from "@/components/atmosphere/MarineWeather";
import WeatherSkeleton from "@/components/atmosphere/WeatherSkeleton";
import {
  fetchCurrentWeather,
  fetchHistoricalWeather,
  fetchMarineWeather,
  type CurrentWeatherData,
  type HistoricalWeatherData,
  type MarineWeatherData,
} from "@/lib/weatherApi";

type Tab = "current" | "historical" | "marine";

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("current");

  // Current weather state
  const [currentData, setCurrentData] = useState<CurrentWeatherData | null>(null);
  const [currentLoading, setCurrentLoading] = useState(false);
  const [currentError, setCurrentError] = useState<string | null>(null);
  const [lastSearchedCity, setLastSearchedCity] = useState("");

  // Historical weather state
  const [historicalData, setHistoricalData] = useState<HistoricalWeatherData | null>(null);
  const [historicalLoading, setHistoricalLoading] = useState(false);
  const [historicalError, setHistoricalError] = useState<string | null>(null);

  // Marine weather state
  const [marineData, setMarineData] = useState<MarineWeatherData | null>(null);
  const [marineLoading, setMarineLoading] = useState(false);
  const [marineError, setMarineError] = useState<string | null>(null);

  const handleCurrentSearch = useCallback(async (query: string) => {
    setCurrentLoading(true);
    setCurrentError(null);
    setLastSearchedCity(query);
    try {
      const data = await fetchCurrentWeather(query);
      setCurrentData(data);
    } catch (err) {
      setCurrentError(err instanceof Error ? err.message : "Failed to fetch weather data");
      setCurrentData(null);
    } finally {
      setCurrentLoading(false);
    }
  }, []);

  const handleHistoricalFetch = useCallback(async (city: string, date: string) => {
    setHistoricalLoading(true);
    setHistoricalError(null);
    try {
      const data = await fetchHistoricalWeather(city, date);
      setHistoricalData(data);
    } catch (err) {
      setHistoricalError(err instanceof Error ? err.message : "Failed to fetch historical data");
      setHistoricalData(null);
    } finally {
      setHistoricalLoading(false);
    }
  }, []);

  const handleMarineFetch = useCallback(async (location: string) => {
    setMarineLoading(true);
    setMarineError(null);
    try {
      const data = await fetchMarineWeather(location);
      setMarineData(data);
    } catch (err) {
      setMarineError(err instanceof Error ? err.message : "Failed to fetch marine data");
      setMarineData(null);
    } finally {
      setMarineLoading(false);
    }
  }, []);

  const isCurrentLoading = activeTab === "current" && currentLoading;
  const isHistoricalLoading = activeTab === "historical" && historicalLoading;
  const isMarineLoading = activeTab === "marine" && marineLoading;

  return (
    <div className="min-h-screen relative" style={{ fontFamily: "'Raleway', sans-serif" }}>
      {/* Animated background */}
      <div className="atmosphere-bg" />

      {/* Particles */}
      <ParticleBackground />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="pt-10 pb-6 px-4 text-center">
          {/* Logo / Title */}
          <div className="mb-2">
            <h1
              className="glow-title text-4xl md:text-6xl font-black tracking-[0.3em] uppercase"
              style={{ color: "hsl(var(--foreground))" }}
            >
              ATMOSPHERE
            </h1>
            <p
              className="text-xs md:text-sm font-medium tracking-[0.25em] uppercase mt-2"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Premium Weather Intelligence
            </p>
          </div>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 my-6">
            <div className="h-px flex-1 max-w-24" style={{ background: "linear-gradient(90deg, transparent, hsla(217, 91%, 60%, 0.4))" }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(var(--primary))", boxShadow: "0 0 8px hsl(var(--primary))" }} />
            <div className="w-2 h-2 rounded-full" style={{ background: "hsl(var(--secondary))", boxShadow: "0 0 12px hsl(var(--secondary))" }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(var(--accent))", boxShadow: "0 0 8px hsl(var(--accent))" }} />
            <div className="h-px flex-1 max-w-24" style={{ background: "linear-gradient(90deg, hsla(217, 91%, 60%, 0.4), transparent)" }} />
          </div>

          {/* Search bar - shown for current tab */}
          {activeTab === "current" && (
            <div className="max-w-2xl mx-auto fade-in-up">
              <SearchBar
                onSearch={handleCurrentSearch}
                isLoading={currentLoading}
                placeholder="Search city, region, or country..."
              />
            </div>
          )}

          {/* Tab navigation */}
          <div className="mt-6 flex justify-center">
            <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 px-4 pb-16 max-w-4xl mx-auto w-full">

          {/* CURRENT WEATHER */}
          {activeTab === "current" && (
            <div className="space-y-5">
              {currentLoading && <WeatherSkeleton type="current" />}

              {currentError && !currentLoading && (
                <div className="glass-card error-glow p-6 fade-in-up text-center">
                  <div className="text-5xl mb-4">⛈️</div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: "hsl(var(--destructive))" }}>
                    Couldn't fetch weather data
                  </h3>
                  <p className="text-sm mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {currentError}
                  </p>
                  <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))", opacity: 0.6 }}>
                    Try checking the city name or your connection.
                  </p>
                </div>
              )}

              {currentData && !currentLoading && (
                <CurrentWeather data={currentData} />
              )}

              {!currentData && !currentLoading && !currentError && (
                <div className="glass-card p-10 fade-in-up text-center">
                  <div className="float-icon text-7xl mb-5">🌤️</div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: "hsl(var(--foreground))" }}>
                    Discover Your Weather
                  </h3>
                  <p className="text-sm max-w-sm mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
                    Search any city to get real-time atmospheric conditions with stunning precision.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mt-6">
                    {["London", "Tokyo", "New York", "Sydney", "Dubai"].map((city) => (
                      <button
                        key={city}
                        onClick={() => handleCurrentSearch(city)}
                        className="text-xs px-4 py-2 rounded-full transition-all duration-200 font-medium"
                        style={{
                          background: "hsla(217, 91%, 60%, 0.1)",
                          border: "1px solid hsla(217, 91%, 60%, 0.2)",
                          color: "hsl(var(--primary))",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "hsla(217, 91%, 60%, 0.2)";
                          e.currentTarget.style.boxShadow = "0 0 12px hsla(217, 91%, 60%, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "hsla(217, 91%, 60%, 0.1)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* HISTORICAL WEATHER */}
          {activeTab === "historical" && (
            <div>
              {historicalLoading ? (
                <WeatherSkeleton type="historical" />
              ) : (
                <HistoricalWeather
                  onFetch={handleHistoricalFetch}
                  data={historicalData}
                  isLoading={historicalLoading}
                  error={historicalError}
                  lastCity={lastSearchedCity}
                />
              )}
            </div>
          )}

          {/* MARINE WEATHER */}
          {activeTab === "marine" && (
            <div>
              {marineLoading ? (
                <WeatherSkeleton type="marine" />
              ) : (
                <MarineWeather
                  onFetch={handleMarineFetch}
                  data={marineData}
                  isLoading={marineLoading}
                  error={marineError}
                />
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer
          className="py-5 px-4 text-center"
          style={{
            borderTop: "1px solid hsla(217, 91%, 60%, 0.08)",
          }}
        >
          <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))", opacity: 0.5 }}>
            Powered by{" "}
            <span style={{ color: "hsl(var(--primary))", opacity: 1 }}>Weatherstack</span>
            {" "}· Built with precision &amp; elegance ·{" "}
            <span style={{ color: "hsl(var(--secondary))", opacity: 1 }}>ATMOSPHERE</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
