interface SkeletonProps {
  type?: "current" | "historical" | "marine";
}

function SkeletonBlock({ w = "full", h = "4", className = "" }: { w?: string; h?: string; className?: string }) {
  return (
    <div
      className={`skeleton rounded-lg w-${w} h-${h} ${className}`}
    />
  );
}

export default function WeatherSkeleton({ type = "current" }: SkeletonProps) {
  if (type === "current") {
    return (
      <div className="glass-card p-8 animate-fade-in-up">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-3">
            <SkeletonBlock w="48" h="8" />
            <SkeletonBlock w="32" h="4" />
            <SkeletonBlock w="24" h="3" />
          </div>
          <div className="text-center space-y-2">
            <SkeletonBlock w="24" h="20" className="mx-auto rounded-2xl" />
            <SkeletonBlock w="32" h="5" className="mx-auto" />
          </div>
        </div>
        <div className="mt-8">
          <div className="glow-divider mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="stat-item">
                <SkeletonBlock w="8" h="6" className="mx-auto mb-1 rounded" />
                <SkeletonBlock w="full" h="3" />
                <SkeletonBlock w="3/4" h="4" className="mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "historical") {
    return (
      <div className="glass-card p-8 animate-fade-in-up space-y-4">
        <SkeletonBlock w="48" h="7" />
        <SkeletonBlock w="32" h="4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="stat-item">
              <SkeletonBlock w="full" h="3" className="mb-1" />
              <SkeletonBlock w="1/2" h="6" className="mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card-marine p-8 animate-fade-in-up space-y-4">
      <SkeletonBlock w="48" h="7" />
      <SkeletonBlock w="32" h="4" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="stat-item">
            <SkeletonBlock w="full" h="3" className="mb-1" />
            <SkeletonBlock w="1/2" h="6" className="mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
