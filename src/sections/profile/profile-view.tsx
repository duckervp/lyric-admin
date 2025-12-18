import { useState, useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { UserRole } from 'src/utils/type';

import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useDeleteUsersMutation,
} from 'src/app/api/user/userApiSlice';

import { Label } from 'src/components/label';
import { Iconify, UserIcon } from 'src/components/iconify';
import Fallback from 'src/components/loading/fallback';
import { TableView } from 'src/components/table/table-view';
import { ThemeProvider, createTheme, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Person from '@mui/icons-material/Person';
import Lock from '@mui/icons-material/Lock';
import Settings from '@mui/icons-material/Settings';
import Work from '@mui/icons-material/Work';
import Email from '@mui/icons-material/Email';
import Warning from '@mui/icons-material/Warning';
import Delete from '@mui/icons-material/Delete';
import { Logo } from 'src/components/logo';
import { AvatarUpload } from 'src/components/upload/avatar-uploader';
import { varAlpha } from 'minimal-shared/utils';
// ----------------------------------------------------------------------
export type UserProps = {
  id: number;
  name: string;
  role: string;
  active: string;
  company: string;
  imageUrl: string;
  verified: boolean;
};

export function ProfileView() {
  const { t } = useTranslation('user', { keyPrefix: 'listView' });

  const { data: userData, isLoading } = useGetAllUsersQuery({});

  const [users, setUsers] = useState<UserProps[]>([]);

  const [deleteUser] = useDeleteUserMutation();

  const [deleteUsers] = useDeleteUsersMutation();

  const theme = useTheme();

  useEffect(() => {
    if (userData) {
      setUsers(userData.data);
    }
  }, [userData]);

  const handleDeleteRow = async (rowId: number) => {
    await deleteUser(rowId);
  };

  const handleDeleteRows = async (rowIds: number[]) => {
    await deleteUsers(rowIds);
  };

  if (isLoading) {
    return <Fallback />;
  }

  return (
    <Container>
      <Grid container spacing={4}>
        {/* Sidebar */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              alignItems: 'left',
              flexDirection: 'column',
              p: 1,
            }}
          >
            <Logo />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4">
                {/* {t('title')} */}
                Profile Manager
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {/* {t('des')} */}
              </Typography>
            </Box>
          </Box>
          <Card variant="outlined" sx={{ overflow: 'hidden' }}>
            <List component="nav" sx={{ p: 1 }}>
              <ListItem disablePadding sx={{mb: 1}}>
                <ListItemButton selected sx={{ borderRadius: 2 }}>
                  <ListItemIcon>
                    <UserIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Personal Info"
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding sx={{mb: 1}}>
                <ListItemButton sx={{ borderRadius: 2 }}>
                  <ListItemIcon>
                    <Lock fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Security" primaryTypographyProps={{ variant: 'body2' }} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton sx={{ borderRadius: 2 }}>
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Preferences"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Card>
        </Grid>

        {/* Forms Area */}
        <Grid size={{ xs: 12, md: 9 }}>
          <Stack spacing={4}>
            {/* Information Update Card */}
            <Card>
              <Box p={3} borderBottom="1px solid" borderColor="divider" bgcolor="grey.50">
                <Typography variant="subtitle1" fontWeight={700}>
                  Information Update
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Update your photo and professional details.
                </Typography>
              </Box>

              <Box component="form" p={4}>
                <Grid container spacing={6}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <AvatarUpload
                      avatarUrl=""
                      onImageChange={(url) => 1}
                      // setProfile(p => ({ ...p, avatarUrl: url }))
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 8 }}>
                    <Stack spacing={3}>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            label="Full Name"
                            size="small"
                            // value={profile.name}
                            // onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
                            slotProps={{
                              input: {
                                startAdornment: (
                                  <Person sx={{ mr: 1, color: 'text.disabled' }} fontSize="small" />
                                ),
                              },
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            label="Email Address"
                            size="small"
                            disabled
                            // value={profile.email}
                            slotProps={{
                              input: {
                                startAdornment: (
                                  <Email sx={{ mr: 1, color: 'text.disabled' }} fontSize="small" />
                                ),
                              },
                            }}
                          />
                        </Grid>
                      </Grid>

                      <TextField
                        fullWidth
                        label="Job Role"
                        size="small"
                        placeholder="e.g. Senior Designer"
                        // value={profile.role}
                        // onChange={(e) => setProfile(p => ({ ...p, role: e.target.value }))}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <Work sx={{ mr: 1, color: 'text.disabled' }} fontSize="small" />
                            ),
                          },
                        }}
                      />

                      <Box>
                        <TextField
                          fullWidth
                          label="Bio"
                          multiline
                          rows={3}
                          placeholder="Tell us about yourself"
                          // value={profile.bio}
                          // onChange={(e) => setProfile(p => ({ ...p, bio: e.target.value }))}
                          // helperText={`${profile.bio.length}/150 characters`}
                          slotProps={{ input: { sx: { fontSize: '0.875rem' } } }}
                        />
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>

                <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
                  <Button variant="text" color="inherit">
                    Cancel
                  </Button>
                  <Button variant="contained" type="submit">
                    {0 ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              </Box>
            </Card>

            {/* Password Update Card */}
            <Card>
              <Box p={3} borderBottom="1px solid" borderColor="divider" bgcolor="grey.50">
                <Typography variant="subtitle1" fontWeight={700}>
                  Password Update
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Secure your account with a strong password.
                </Typography>
              </Box>
              <Box component="form" p={4}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        type="password"
                        label="Current Password"
                        size="small"
                        // value={passwordForm.current}
                        // onChange={(e) => setPasswordForm(p => ({ ...p, current: e.target.value }))}
                        required
                      />
                      <Grid container spacing={2}>
                        <Grid size={6}>
                          <TextField
                            fullWidth
                            type="password"
                            label="New Password"
                            size="small"
                            // value={passwordForm.new}
                            // onChange={(e) => setPasswordForm(p => ({ ...p, new: e.target.value }))}
                            required
                          />
                        </Grid>
                        <Grid size={6}>
                          <TextField
                            fullWidth
                            type="password"
                            label="Confirm New"
                            size="small"
                            // value={passwordForm.confirm}
                            // onChange={(e) => setPasswordForm(p => ({ ...p, confirm: e.target.value }))}
                            required
                          />
                        </Grid>
                      </Grid>

                      <Box
                        sx={{ p: 2, borderRadius: 2, border: '1px solid', display: 'flex', gap: 2 }}
                      >
                        <Warning color="info" fontSize="small" />
                        <Typography variant="caption" color="info.dark">
                          Password must be at least 8 characters long and contain both letters and
                          numbers.
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>

                <Box mt={4} display="flex" justifyContent="flex-end">
                  <Button variant="contained" type="submit">
                    Update Password
                  </Button>
                </Box>
              </Box>
            </Card>

            {/* Danger Zone */}
            <Card>
              <Box p={3} display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle2" color="error.dark" fontWeight={700}>
                    Deactivate Account
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Once deleted, account data cannot be recovered.
                  </Typography>
                </Box>
                <Button variant="outlined" color="error" startIcon={<Delete />}>
                  Deactivate
                </Button>
              </Box>
            </Card>
            <Box sx={{height: "50px"}} />
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
