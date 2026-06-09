import type { PillTabsProps } from "@/types";
import { Activity, useMemo, useState } from "react";

export function PillTabs({ items, defaultActiveKey }: PillTabsProps) {
  const [selectedKey, setSelectedKey] = useState(defaultActiveKey ?? items[0]?.key);

  // If selectedKey is not in items, fall back to the first available
  const activeKey = useMemo(
    () => (items.some((item) => item.key === selectedKey) ? selectedKey : items[0]?.key),
    [items, selectedKey],
  );

  return (
    <div className="flex flex-col gap-4 md:gap-6 w-full">
      <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="inline-flex bg-white rounded-[14px] p-1 gap-1 min-w-max border border-default">
          {items.map((item) => (
            <button
              key={item.key}
              onClick={() => setSelectedKey(item.key)}
              className={`px-4 md:px-6 py-2 rounded-[10px] text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeKey === item.key
                  ? "bg-[#155DFC] text-white shadow-sm"
                  : "bg-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      {items.map((item) => (
        <Activity key={item.key} mode={item.key === activeKey ? "visible" : "hidden"}>
          <div>{item.children}</div>
        </Activity>
      ))}
    </div>
  );
}
