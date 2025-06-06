import { useState } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { RoleSelect } from '../select/role-select';

// --------------------------------------------

type RoleSelectInputProps = {
  required?: boolean;
  label?: string;
  value: string;
  error: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function RoleSelectInput({
  required,
  label,
  value,
  error,
  handleInputChange,
}: RoleSelectInputProps) {
  const [role, setRole] = useState<any>({ value });
  const [roleError, setRoleError] = useState<string>(error);
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="caption" sx={{ mb: 1 }}>
        {label || 'Chức danh'}
        {required && (
          <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>
            *
          </Box>
        )}
      </Typography>
      <RoleSelect
        role={role}
        setRole={setRole}
        defaultRole={value}
        inputStyle
        error={roleError}
        setError={setRoleError}
        handleInputChange={handleInputChange}
      />
    </Box>
  );
}
