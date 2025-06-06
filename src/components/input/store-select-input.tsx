import { useState } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { StoreSelect } from '../select/store-select';

// --------------------------------------------

type StoreSelectInputProps = {
  required?: boolean;
  label?: string;
  value: string;
  error: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function StoreSelectInput({
  required,
  label,
  value,
  error,
  handleInputChange,
}: StoreSelectInputProps) {
  const [store, setStore] = useState<any>({ value });
  const [storeError, setStoreError] = useState<string>(error);
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="caption" sx={{ mb: 1 }}>
        {label || 'Chi nhánh'}
        {required && (
          <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>
            *
          </Box>
        )}
      </Typography>
      <StoreSelect
        store={store}
        setStore={setStore}
        defaultStore={value}
        inputStyle
        error={storeError}
        setError={setStoreError}
        handleInputChange={handleInputChange}
      />
      {!!error && (
        <Typography variant="caption" color="error" sx={{ ml: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
