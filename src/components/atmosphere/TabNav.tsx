type Tab = "current" | "historical" | "marine";

interface TabNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "current", label: "Current", icon: "🌤️" },
  { id: "historical", label: "Historical", icon: "📅" },
  { id: "marine", label: "Marine", icon: "🌊" },
];

export default function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <div
      className="flex items-center gap-2 p-1.5 rounded-full"
      style={{
        background: "hsla(230, 40%, 10%, 0.5)",
        backdropFilter: "blur(10px)",
        border: "1px solid hsla(217, 91%, 60%, 0.15)",
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`tab-pill flex items-center gap-1.5 ${activeTab === tab.id ? "active" : "inactive"}`}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
