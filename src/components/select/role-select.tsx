import { useEffect } from 'react';

import { Select } from './custom-select';

// ----------------------------------------------------------

type RoleSelectProps = {
  role: any;
  defaultRole?: any;
  setRole: (role: any) => void;
  inputStyle?: boolean;
  error?: string;
  setError?: (error: string) => void;
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ROLE_CONFIG = [
  { value: 'SUPER_ADMIN', label: 'Super admin' },
  { value: 'STORE_MANAGER', label: 'Store manager' },
  { value: 'PHARMACIST', label: 'Pharmacist' },
  { value: 'INVENTORY_STAFF', label: 'Inventory staff' },
];

export function RoleSelect({
  role,
  setRole,
  inputStyle,
  defaultRole,
  error,
  setError,
  handleInputChange,
}: RoleSelectProps) {
  useEffect(() => {
    setRole(ROLE_CONFIG.find((c) => c.value === defaultRole));
  }, [defaultRole, setRole]);

  return (
    <Select
      title="Chức danh"
      options={ROLE_CONFIG}
      selected={role}
      setSelected={setRole}
      inputStyle={inputStyle}
      error={error}
      setError={setError}
      onChange={(value: any) => {
        if (handleInputChange) {
          handleInputChange({
            target: {
              type: 'role-select',
              name: 'role',
              value: value ? value.value : '',
            },
          } as React.ChangeEvent<HTMLInputElement>);
        }
      }}
    />
  );
}
