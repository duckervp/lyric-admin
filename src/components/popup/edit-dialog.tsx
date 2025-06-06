import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { DialogPopup } from './dialog-popup';
//-------------------------------------------------------------------------

type EditDialogProps = {
  onPopupClose: () => void;
  open: boolean;
  title: string;
  width: string;
  children: React.ReactNode;
  canSave: boolean;
  onSave: () => void;
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
            onClick={onSave}
            loading={isSaving}
          >
            Save
          </Button>
          <Button size="medium" color="inherit" variant="contained" onClick={onPopupClose}>
            Cancel
          </Button>
        </Box>
      }
    >
      {children}
    </DialogPopup>
  );
}
