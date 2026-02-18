// Weatherstack API hook
// API Key provided by user - used directly in frontend as requested
// Note: Weatherstack free plan supports https:// for the API
// Using https directly since the browser requires secure contexts

const API_KEY = "9990f1414d48f89ebc9dbe3b38f1e44c";
// Try https directly (works for paid plans; free plan may require http but we try https first)
// Fallback proxy chain if needed
const WEATHERSTACK_BASE = "https://api.weatherstack.com";

function buildUrl(endpoint: string, params: Record<string, string>): string {
  const search = new URLSearchParams({ access_key: API_KEY, ...params }).toString();
  return `${WEATHERSTACK_BASE}/${endpoint}?${search}`;
}

export interface CurrentWeatherData {
  location: {
    name: string;
    country: string;
    region: string;
    lat: string;
    lon: string;
    localtime: string;
    timezone_id: string;
    utc_offset: string;
  };
  current: {
    temperature: number;
    feelslike: number;
    humidity: number;
    wind_speed: number;
    wind_dir: string;
    pressure: number;
    visibility: number;
    uv_index: number;
    cloudcover: number;
    weather_descriptions: string[];
    weather_icons: string[];
    observation_time: string;
    is_day: string;
    weather_code: number;
    precip: number;
  };
}

export interface HistoricalWeatherData {
  location: {
    name: string;
    country: string;
    region: string;
    localtime: string;
  };
  historical: {
    [date: string]: {
      date: string;
      date_epoch: number;
      astro: {
        sunrise: string;
        sunset: string;
        moonrise: string;
        moonset: string;
      };
      mintemp: number;
      maxtemp: number;
      avgtemp: number;
      totalsnow: number;
      sunhour: number;
      uv_index: number;
      hourly: Array<{
        time: string;
        temperature: number;
        weather_descriptions: string[];
        weather_icons: string[];
        wind_speed: number;
        wind_dir: string;
        wind_degree: number;
        weather_code: number;
        pressure: number;
        humidity: number;
        visibility: number;
        precip: number;
        heatindex: number;
        dewpoint: number;
        windchill: number;
        windgust: number;
        feelslike: number;
        chanceofrain: number;
        chanceofremdry: number;
        chanceofwindy: number;
        chanceofovercast: number;
        chanceofsunshine: number;
        chanceoffrost: number;
        chanceofhightemp: number;
        chanceoffog: number;
        chanceofsnow: number;
        chanceofthunder: number;
      }>;
    };
  };
}

export interface MarineWeatherData {
  location: {
    name: string;
    country: string;
    region: string;
    localtime: string;
  };
  current: {
    temperature: number;
    wind_speed: number;
    wind_dir: string;
    visibility: number;
    weather_descriptions: string[];
    weather_icons: string[];
    pressure: number;
    humidity: number;
    cloudcover: number;
    uv_index: number;
    feelslike: number;
    observation_time: string;
  };
  marine?: {
    tides?: Array<{
      date: string;
      tide_data: Array<{
        tideTime: string;
        tideHeight_mt: string;
        tide_type: string;
      }>;
    }>;
  };
}

export interface WeatherError {
  success: boolean;
  error: {
    code: number;
    type: string;
    info: string;
  };
}

function isWeatherError(data: unknown): data is WeatherError {
  return (
    typeof data === "object" &&
    data !== null &&
    "success" in data &&
    (data as WeatherError).success === false
  );
}

export async function fetchCurrentWeather(query: string): Promise<CurrentWeatherData> {
  const url = buildUrl("current", { query, units: "m" });
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Network error: ${response.status}`);
  }
  const data = await response.json();
  if (isWeatherError(data)) {
    throw new Error(data.error.info || "Failed to fetch weather data");
  }
  return data as CurrentWeatherData;
}

export async function fetchHistoricalWeather(
  query: string,
  date: string
): Promise<HistoricalWeatherData> {
  const url = buildUrl("historical", { query, historical_date: date, units: "m" });
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Network error: ${response.status}`);
  }
  const data = await response.json();
  if (isWeatherError(data)) {
    throw new Error(data.error.info || "Failed to fetch historical weather data");
  }
  return data as HistoricalWeatherData;
}

export async function fetchMarineWeather(query: string): Promise<MarineWeatherData> {
  // Try marine endpoint first
  const url = buildUrl("marine", { query, units: "m" });
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Network error: ${response.status}`);
  }
  const data = await response.json();
  if (isWeatherError(data)) {
    // Fallback to current weather if marine endpoint is not available on plan
    const fallbackUrl = buildUrl("current", { query, units: "m" });
    const fallbackResp = await fetch(fallbackUrl);
    const fallbackData = await fallbackResp.json();
    if (isWeatherError(fallbackData)) {
      throw new Error(fallbackData.error.info || "Failed to fetch marine weather data");
    }
    return fallbackData as MarineWeatherData;
  }
  return data as MarineWeatherData;
}

export function getWeatherEmoji(code: number, isDay: string = "yes"): string {
  const day = isDay === "yes";
  if (code === 113) return day ? "☀️" : "🌙";
  if (code === 116) return day ? "⛅" : "🌤️";
  if (code === 119 || code === 122) return "☁️";
  if (code === 143 || code === 248 || code === 260) return "🌫️";
  if (code >= 176 && code <= 182) return "🌦️";
  if (code >= 185 && code <= 200) return "🌧️";
  if (code >= 200 && code <= 232) return "⛈️";
  if (code >= 227 && code <= 260) return "❄️";
  if (code >= 263 && code <= 282) return "🌧️";
  if (code >= 284 && code <= 296) return "🌨️";
  if (code >= 299 && code <= 314) return "🌧️";
  if (code >= 317 && code <= 330) return "🌨️";
  if (code >= 332 && code <= 350) return "❄️";
  if (code >= 353 && code <= 368) return "🌦️";
  if (code >= 371 && code <= 395) return "❄️";
  return day ? "🌤️" : "🌙";
}

export function formatLocalTime(localtime: string): string {
  try {
    const date = new Date(localtime);
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return localtime;
  }
}
