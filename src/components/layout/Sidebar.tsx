import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Invoices', href: '/invoices', icon: FileText },
  ];

  return (
    <div className="flex h-full flex-col border-r border-border bg-surface-1">
      <div className="flex h-14 items-center border-b border-border px-4 lg:px-6">
        <Link to="/" className="flex items-center">
          <img src="/freightfox-logo.svg" alt="FreightFox Logo" className="h-8 w-auto" />
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-2 text-body-sm font-medium lg:px-4 gap-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 transition-all hover:text-ink hover:bg-surface-2",
                location.pathname === item.href 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-ink-subtle"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <nav className="grid items-start text-body-sm font-medium gap-1">
          <Link
            to="#"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-ink-subtle transition-all hover:text-ink hover:bg-surface-2"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <Link
            to="#"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-ink-subtle transition-all hover:text-ink hover:bg-surface-2"
          >
            <HelpCircle className="h-4 w-4" />
            Help Support
          </Link>
        </nav>
      </div>
    </div>
  );
}
