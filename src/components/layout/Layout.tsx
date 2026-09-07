import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useSidebar } from '@/context/SidebarContext';
import { Button } from '@/components/ui/button';
import { PanelLeftOpen, Menu } from 'lucide-react';

export function Layout() {
  const { isCollapsed, toggleSidebar, toggleMobileSidebar } = useSidebar();

  return (
    <div className="flex min-h-screen w-full bg-canvas text-ink">
      {/* Sidebar (Desktop Slide-in/Slide-out & Mobile Slide-over) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 transition-all duration-300">
        {/* Mobile Header Bar */}
        <header className="flex md:hidden items-center justify-between h-14 px-4 border-b border-border bg-canvas sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileSidebar}
              className="h-8 w-8 text-ink hover:bg-surface-2"
              title="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <img src="/freightfox-logo.svg" alt="FreightFox Logo" className="h-7 w-auto" />
          </div>
        </header>

        {/* Main View Container */}
        <main className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8 bg-canvas">
          {/* Desktop Toggle Button when Sidebar is Collapsed */}
          {isCollapsed && (
            <div className="hidden md:flex items-center gap-2 -mb-2 animate-in fade-in duration-200">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSidebar}
                className="h-8 px-2.5 gap-1.5 text-xs bg-surface-1 border-border text-ink-subtle hover:text-ink hover:bg-surface-2 transition-colors shadow-xs"
                title="Expand sidebar"
              >
                <PanelLeftOpen className="h-3.5 w-3.5 text-primary" />
                <span>Show Sidebar</span>
              </Button>
            </div>
          )}

          <Outlet />
        </main>
      </div>
    </div>
  );
}
