// import React, { useState, useEffect } from 'react';

// import Box from '@mui/material/Box';
// import Chip from '@mui/material/Chip';
// import Card from '@mui/material/Card';
// import Table from '@mui/material/Table';
// import Stack from '@mui/material/Stack';
// import Dialog from '@mui/material/Dialog';
// import Button from '@mui/material/Button';
// import Avatar from '@mui/material/Avatar';
// import TableRow from '@mui/material/TableRow';
// import TableHead from '@mui/material/TableHead';
// import TableCell from '@mui/material/TableCell';
// import TableBody from '@mui/material/TableBody';
// import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
// import DialogTitle from '@mui/material/DialogTitle';
// import ButtonGroup from '@mui/material/ButtonGroup';
// import DialogContent from '@mui/material/DialogContent';
// import DialogActions from '@mui/material/DialogActions';
// import TableContainer from '@mui/material/TableContainer';
// import InputAdornment from '@mui/material/InputAdornment';

// export function ArtistDetailDialog({
//   open,
//   artist,
//   onClose,
// }: {
//   open: boolean;
//   artist: Artist;
//   onClose: () => void;
// }) {
//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
//       <Box
//         sx={{
//           position: 'relative',
//           height: 100,
//           background: 'linear-gradient(to right, #7635dc, #1890ff)',
//         }}
//       >
//         <Box
//           sx={{
//             position: 'absolute',
//             bottom: -40,
//             left: 24,
//             p: 0.5,
//             bgcolor: 'background.paper',
//             borderRadius: '50%',
//           }}
//         >
//           <Avatar src={artist.imageUrl} alt={artist.name} sx={{ width: 80, height: 80 }} />
//         </Box>
//       </Box>
//       <Box sx={{ pt: 6, px: 3, pb: 3 }}>
//         <Typography variant="h5" gutterBottom>
//           {artist.name}
//         </Typography>
//         <Chip
//           label={artist.role}
//           color={artist.role === Role.SINGER ? 'info' : 'warning'}
//           size="small"
//           sx={{ mb: 2 }}
//         />
//         <Typography
//           variant="caption"
//           sx={{ display: 'block', fontWeight: 'bold', color: 'text.disabled', mb: 1 }}
//         >
//           BIOGRAPHY
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           {artist.bio || 'No biography available.'}
//         </Typography>
//       </Box>
//       <DialogActions>
//         <Button onClick={onClose}>Close</Button>
//       </DialogActions>
//     </Dialog>
//   );