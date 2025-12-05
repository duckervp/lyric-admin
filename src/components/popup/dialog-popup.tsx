import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

// ---------------------------------------------------------

type DialogPopupProps = {
  popupOpen: boolean;
  onPopupClose: () => void;
  width: string;
  title: string;
  children: React.ReactNode;
  actions: React.ReactNode;
};

export function DialogPopup({
  popupOpen,
  onPopupClose,
  width,
  title,
  children,
  actions,
}: DialogPopupProps) {
  return (
    <Dialog
      open={popupOpen}
      onClose={onPopupClose}
      aria-labelledby="dialog"
      sx={{
        '& .MuiDialog-paper': {
          width,
          maxWidth: '90%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box sx={{ py: 2, px: 3, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Typography id="dialog" variant="h4">
          {title}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ py: 2, px: 3, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Box sx={{ width: '100%', typography: 'body1', position: 'relative', minHeight: '80px' }}>
          {children}
        </Box>
      </Box>
      <Divider />
      <Box
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          position: 'sticky',
          bottom: 0,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto' }}>{actions}</Box>
      </Box>
    </Dialog>
  );
}
