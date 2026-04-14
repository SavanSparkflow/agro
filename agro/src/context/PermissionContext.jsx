import { createContext, useContext, useState, useEffect } from "react";

const PermissionContext = createContext();

// Mock initial permission structure
const initialRolePermissions = {
  SuperAdmin: {
    Products: { view: true, create: true, edit: true, delete: true, search: true },
    Categories: { view: true, create: true, edit: true, delete: true, search: true },
    Customers: { view: true, create: true, edit: true, delete: true, search: true },
    Stock: { view: true, create: true, edit: true, delete: true, search: true },
    Dealers: { view: true, create: true, edit: true, delete: true, search: true },
    Users: { view: true, create: true, edit: true, delete: true, search: true },
  },
  Admin: {
    Products: { view: true, create: true, edit: true, delete: false, search: true },
    Categories: { view: true, create: true, edit: true, delete: false, search: true },
    Customers: { view: true, create: true, edit: true, delete: true, search: true },
    Stock: { view: true, create: true, edit: true, delete: false, search: true },
    Dealers: { view: true, create: false, edit: false, delete: false, search: true },
    Users: { view: false, create: false, edit: false, delete: false, search: false },
  },
  Dealer: {
    Products: { view: true, create: false, edit: false, delete: false, search: true },
    Categories: { view: true, create: false, edit: false, delete: false, search: true },
    Customers: { view: true, create: true, edit: true, delete: false, search: true },
    Stock: { view: true, create: true, edit: true, delete: true, search: true },
    Dealers: { view: false, create: false, edit: false, delete: false, search: false },
    Users: { view: false, create: false, edit: false, delete: false, search: false },
  }
};

export function PermissionProvider({ children }) {
  const [role, setRole] = useState(localStorage.getItem('userRole') || "SuperAdmin");
  const [permissions, setPermissions] = useState(initialRolePermissions);

  useEffect(() => {
    localStorage.setItem('userRole', role);
  }, [role]);

  const can = (module, action) => {
    const rolePermissions = permissions[role];
    if (!rolePermissions) return false;
    if (!rolePermissions[module]) return false;
    return rolePermissions[module][action] || false;
  };

  const updateRolePermission = (roleName, moduleName, action, value) => {
    setPermissions(prev => ({
      ...prev,
      [roleName]: {
        ...prev[roleName],
        [moduleName]: {
          ...prev[roleName][moduleName],
          [action]: value
        }
      }
    }));
  };

  return (
    <PermissionContext.Provider value={{ role, setRole, can, permissions, updateRolePermission }}>
      {children}
    </PermissionContext.Provider>
  );
}

export const usePermission = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error("usePermission must be used within a PermissionProvider");
  }
  return context;
};
