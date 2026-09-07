import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, HelpCircle, PanelLeftClose, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RoleSwitcher } from '@/components/shared/RoleSwitcher';
import { useSidebar } from '@/context/SidebarContext';
import { Button } from '@/components/ui/button';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { isCollapsed, isMobileOpen, toggleSidebar, closeMobileSidebar } = useSidebar();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Invoices', href: '/invoices', icon: FileText },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col bg-canvas border-r border-border w-64 select-none">
      {/* Sidebar Header */}
      <div className="flex h-14 items-center justify-between border-b border-border px-4">
        <Link to="/" onClick={closeMobileSidebar} className="flex items-center">
          <img src="/freightfox-logo.svg" alt="FreightFox Logo" className="h-7 w-auto" />
        </Link>
        
        {/* Desktop Collapse Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hidden md:flex h-8 w-8 text-ink-subtle hover:text-ink hover:bg-surface-2"
          title="Collapse sidebar"
        >
          <PanelLeftClose className="h-4 w-4" />
        </Button>

        {/* Mobile Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={closeMobileSidebar}
          className="flex md:hidden h-8 w-8 text-ink-subtle hover:text-ink hover:bg-surface-2"
          title="Close sidebar"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="grid items-start px-3 text-body-sm font-medium gap-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={closeMobileSidebar}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium transition-all",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-ink-subtle hover:text-ink hover:bg-surface-2"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-ink-subtle")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions & Role Switcher */}
      <div className="mt-auto border-t border-border pt-2 pb-3">
        <RoleSwitcher />
        <nav className="grid items-start text-body-sm font-medium gap-1 px-3 mt-1">
          <Link
            to="#"
            className="flex items-center gap-3 rounded-md px-3 py-1.5 text-xs text-ink-subtle transition-all hover:text-ink hover:bg-surface-2"
          >
            <Settings className="h-3.5 w-3.5" />
            Settings
          </Link>
          <Link
            to="#"
            className="flex items-center gap-3 rounded-md px-3 py-1.5 text-xs text-ink-subtle transition-all hover:text-ink hover:bg-surface-2"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            Help Support
          </Link>
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Slide-In / Slide-Out Container */}
      <aside
        className={cn(
          "hidden md:block shrink-0 h-screen sticky top-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden",
          isCollapsed ? "w-0 opacity-0 -translate-x-full border-0" : "w-64 opacity-100 translate-x-0"
        )}
      >
        {sidebarContent}
      </aside>

      {/* 2. Mobile Backdrop & Slide-Over Drawer */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 md:hidden transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-2xl",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
