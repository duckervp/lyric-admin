import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { handleError } from 'src/utils/notify';

import { DialogPopup } from './dialog-popup';
//-------------------------------------------------------------------------

type DeleteDialogProps = {
  open: boolean;
  onPopupClose: () => void;
  width?: string;
  title: string;
  children?: React.ReactNode;
  message?: string;
  onDelete: () => Promise<void>;
  isDeleting?: boolean;
};

export default function DeleteDialog({
  open,
  onPopupClose,
  width,
  title,
  children,
  message,
  onDelete,
  isDeleting,
}: DeleteDialogProps) {
  const handleDeleteClick = async () => {
    try {
      await onDelete();
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
      width={width || '500px'}
      actions={
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            size="medium"
            color="primary"
            variant="contained"
            onClick={handleDeleteClick}
            loading={isDeleting}
          >
            Delete
          </Button>
          <Button size="medium" color="inherit" variant="contained" onClick={onPopupClose}>
            Cancel
          </Button>
        </Box>
      }
    >
      {message || children}
    </DialogPopup>
  );
}
