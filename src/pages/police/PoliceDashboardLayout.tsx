import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { cn } from "@/lib/utils";

export default function PoliceDashboardLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      <main 
        className={cn(
          "flex-1 transition-all duration-300 min-w-0 overflow-x-hidden",
          isSidebarCollapsed ? "ml-16" : "ml-64"
        )}
      >
        <Outlet />
      </main>
    </div>
  );
}
