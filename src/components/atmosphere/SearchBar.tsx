import { MapPin, Search, Loader2, Navigation } from "lucide-react"; // Icons
import { useState, type KeyboardEvent } from "react";
import { useToast } from "@/components/ui/use-toast";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export default function SearchBar({ onSearch, isLoading = false, placeholder = "Search city, region, or coordinates..." }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const { toast } = useToast();

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed || isLoading) return;
    onSearch(trimmed);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleLocationSearch = () => {
    if (isLoading || isLocating) return;

    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser does not support geolocation.",
        variant: "destructive",
      });
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const query = `${latitude},${longitude}`;
        setQuery(query); // Update input for feedback
        onSearch(query);
        setIsLocating(false);
        toast({
          title: "Location found",
          description: `Weather for ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        let errorMessage = "Unable to retrieve your location.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = "Location permission denied. Please enable location services.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = "Location information is unavailable.";
        } else if (error.code === error.TIMEOUT) {
          errorMessage = "The request to get user location timed out.";
        }

        toast({
          title: "Location Error",
          description: errorMessage,
          variant: "destructive",
        });
        setIsLocating(false);
      },
      { timeout: 10000, maximumAge: 60000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="flex items-center gap-3 w-full max-w-2xl mx-auto">
      <div className="relative flex-1">
        {/* Left icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <MapPin size={18} style={{ color: "hsl(var(--primary))", opacity: 0.8 }} />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="glass-input w-full pl-11 pr-5 py-3.5 text-sm font-medium"
          style={{ fontFamily: "'Raleway', sans-serif" }}
        />
      </div>

      <button
        onClick={handleLocationSearch}
        disabled={isLoading || isLocating}
        className="btn-gradient px-4 py-3.5 flex items-center justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        aria-label="Use current location"
        title="Use current location"
      >
        {isLocating ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Navigation size={16} />
        )}
      </button>

      <button
        onClick={handleSearch}
        disabled={isLoading || !query.trim()}
        className="btn-gradient px-6 py-3.5 flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        aria-label="Search"
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Search size={16} />
        )}
        <span className="hidden sm:inline">Search</span>
      </button>
    </div>
  );
}
