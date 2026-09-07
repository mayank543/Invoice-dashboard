import React from 'react';
import { useRole, type UserRole } from '@/context/RoleContext';
import { Shield, ShieldAlert, Eye, ChevronDown, Check } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { buttonVariants } from '@/components/ui/button';

export const RoleSwitcher: React.FC = () => {
  const { role, setRole } = useRole();

  const roleConfig: Record<UserRole, { label: string; desc: string; icon: React.ReactNode; color: string }> = {
    Admin: {
      label: 'Admin',
      desc: 'Full access & deletion',
      icon: <Shield className="h-3.5 w-3.5 text-primary" />,
      color: 'bg-primary/10 text-primary border-primary/20',
    },
    Manager: {
      label: 'Manager',
      desc: 'Edit status & export',
      icon: <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />,
      color: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
    },
    Viewer: {
      label: 'Viewer',
      desc: 'Read-only access',
      icon: <Eye className="h-3.5 w-3.5 text-ink-subtle" />,
      color: 'bg-surface-3 text-ink-subtle border-border',
    },
  };

  const current = roleConfig[role];

  return (
    <div className="px-3 py-2">
      <div className="text-[10px] uppercase font-semibold text-ink-tertiary mb-1.5 px-1 tracking-wider">
        Active Role
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger 
          className={buttonVariants({ 
            variant: "outline", 
            className: "w-full justify-between h-9 px-2.5 bg-surface-1 hover:bg-surface-2 border-border text-xs" 
          })}
        >
          <div className="flex items-center gap-2">
            {current.icon}
            <span className="font-medium text-ink">{current.label}</span>
          </div>
          <ChevronDown className="h-3 w-3 text-ink-subtle" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52 bg-surface-2 border-border text-ink p-1">
          {(['Admin', 'Manager', 'Viewer'] as UserRole[]).map((r) => {
            const config = roleConfig[r];
            const isSelected = role === r;
            return (
              <DropdownMenuItem
                key={r}
                onClick={() => setRole(r)}
                className={`cursor-pointer text-xs flex items-center justify-between p-2 rounded-md ${
                  isSelected ? 'bg-surface-3 text-ink font-medium' : 'text-ink-subtle hover:text-ink hover:bg-surface-3'
                }`}
              >
                <div className="flex items-center gap-2">
                  {config.icon}
                  <div>
                    <p className="leading-none text-ink font-medium">{config.label}</p>
                    <p className="text-[10px] text-ink-tertiary mt-0.5">{config.desc}</p>
                  </div>
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 text-primary ml-2" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
