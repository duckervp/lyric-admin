import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { handleError } from 'src/utils/notify';

import { DialogPopup } from './dialog-popup';
//-------------------------------------------------------------------------

type EditDialogProps = {
  onPopupClose: () => void;
  open: boolean;
  title: string;
  width: string;
  children: React.ReactNode;
  canSave: boolean;
  onSave: () => Promise<void>;
  isSaving?: boolean;
};

export default function EditDialog({
  onPopupClose,
  open,
  title,
  width,
  children,
  canSave,
  onSave,
  isSaving,
}: EditDialogProps) {
  const { t } = useTranslation('common', { keyPrefix: 'table.dialog' });

  const handleSaveClick = async () => {
    try {
      await onSave();
      onPopupClose();
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <DialogPopup
      popupOpen={open}
      onPopupClose={onPopupClose}
      title={title}
      width={width}
      actions={
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            size="medium"
            color="primary"
            variant="contained"
            disabled={!canSave}
            onClick={handleSaveClick}
            loading={isSaving}
          >
            {t('saveBtnText')}
          </Button>
          <Button size="medium" color="inherit" variant="contained" onClick={onPopupClose}>
            {t('cancelBtnText')}
          </Button>
        </Box>
      }
    >
      {children}
    </DialogPopup>
  );
}
