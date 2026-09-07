import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'Admin' | 'Manager' | 'Viewer';

export interface RolePermissions {
  canDelete: boolean;
  canEditStatus: boolean;
  canBulkAction: boolean;
  canExport: boolean;
}

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  permissions: RolePermissions;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  Admin: {
    canDelete: true,
    canEditStatus: true,
    canBulkAction: true,
    canExport: true,
  },
  Manager: {
    canDelete: false,
    canEditStatus: true,
    canBulkAction: false,
    canExport: true,
  },
  Viewer: {
    canDelete: false,
    canEditStatus: false,
    canBulkAction: false,
    canExport: true,
  },
};

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem('user_role');
    return (saved as UserRole) || 'Admin';
  });

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem('user_role', newRole);
  };

  const permissions = ROLE_PERMISSIONS[role];

  return (
    <RoleContext.Provider value={{ role, setRole, permissions }}>
      {children}
    </RoleContext.Provider>
  );
};

export function useRole(): RoleContextType {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
