import { useState, useEffect } from 'react';

import { Select } from './custom-select';
import Fallback from '../loading/fallback';
import { StoreCreationForm } from '../form/store-creation-form';

// ----------------------------------------------------------
type StoreSelectProps = {
  store: any;
  defaultStore?: any;
  setStore: (store: any) => void;
  inputStyle?: boolean;
  error?: string;
  setError?: (error: string) => void;
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function StoreSelect({
  store,
  setStore,
  defaultStore,
  inputStyle,
  error,
  setError,
  handleInputChange,
}: StoreSelectProps) {
  const { data: storesData, isLoading } = {data: [], isLoading: false};

  const [storeConfigs, setStoreConfigs] = useState<any>([]);

  const [storePopupOpen, setStorePopupOpen] = useState(false);
  const [storeUpdatePopupOpen, setStoreUpdatePopupOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState();

  useEffect(() => {
    if (storesData) {
      const configs = storesData?.map((s: any) => ({ label: s.name, value: s.id }));
      setStoreConfigs(configs);

      if (defaultStore) {
        setStore(configs?.find((s: any) => s.value === Number(defaultStore)));
      }
    }
  }, [storesData, defaultStore, setStore]);

  if (isLoading) {
    return <Fallback />;
  }

  return (
    <>
      <Select
        inputStyle={inputStyle}
        title="Chi nhánh"
        options={storeConfigs ?? []}
        selected={store}
        setSelected={setStore}
        handleAddEvent={() => setStorePopupOpen(true)}
        handleEditOption={(option: any) => {
          const storeToEdit = storesData?.find((s: any) => s.id === option.value);
          if (storeToEdit) {
            setSelectedStore(storeToEdit);
          }
          setStoreUpdatePopupOpen(true);
        }}
        error={error}
        setError={setError}
        onChange={(value: any) => {
          if (handleInputChange) {
            handleInputChange({
              target: {
                type: 'store-select',
                name: 'storeId',
                value: value ? value.value + '' : '',
              },
            } as React.ChangeEvent<HTMLInputElement>);
          }
        }}
      />
      <StoreCreationForm
        popupOpen={storePopupOpen}
        setPopupOpen={setStorePopupOpen}
        title="New Store"
      />
      <StoreCreationForm
        popupOpen={storeUpdatePopupOpen}
        setPopupOpen={setStoreUpdatePopupOpen}
        title="Update Store"
        editData={selectedStore}
      />
    </>
  );
}
