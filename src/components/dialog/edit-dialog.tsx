import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
//-------------------------------------------------------------------------

type EditDialogProps = {
  onCancel: () => void;
  open: boolean;
  title: string;
  children: React.ReactNode;
  canSave: boolean;
  onSave: () => void;
  isSaving?: boolean;
  buttonSave?: React.ReactNode;
};

export default function EditDialog({
  onCancel,
  open,
  title,
  children,
  canSave,
  onSave,
  isSaving,
  buttonSave,
}: EditDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="title"
      sx={{
        '& .MuiDialog-paper': {
          width: '800px',
          maxWidth: '90%',
          height: '80%',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ p: 3 }}>
          <Typography id="title" variant="h5">
            {title}
          </Typography>
        </Box>

        <Box
          sx={{
            width: '100%',
            typography: 'body1',
            pl: 3,
            pr: 1,
            flex: 1,
            overflowY: 'auto',
            scrollbarGutter: 'stable',
          }}
        >
          {children}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 3 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {buttonSave ? (
              buttonSave
            ) : (
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
            )}
            <Button size="medium" color="inherit" variant="contained" onClick={onCancel}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
