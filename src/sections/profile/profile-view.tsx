import type { Form } from 'src/hooks/use-debounce-form';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Delete from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import Warning from '@mui/icons-material/Warning';

import useLogout from 'src/hooks/use-logout';
import useDebounceForm from 'src/hooks/use-debounce-form';

import { useAppSelector } from 'src/app/hooks';
import { selectCurrentUser } from 'src/app/api/auth/authSlice';
import {
  useGetUserByIdQuery,
  useUpdateUserProfileMutation,
  useUpdateUserPasswordMutation,
  useInactiveUserAccountMutation,
} from 'src/app/api/user/userApiSlice';

import Fallback from 'src/components/loading/fallback';
import { TextInput } from 'src/components/input/text-input';
import { PasswordInput } from 'src/components/input/password-input';
import { AvatarUpload } from 'src/components/upload/avatar-uploader';

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

const form: Form<any> = {
  initialState: {
    name: '',
    email: '',
    imageUrl: '',
  },
  requiredFields: ['name'],
};

const passwordForm: Form<any> = {
  initialState: {
    currentPassword: '',
    password: '',
    confirmPassword: '',
  },
  requiredFields: ['currentPassword', 'password', 'confirmPassword'],
};

export function ProfileView() {
  const { t } = useTranslation('profile', { keyPrefix: 'main' });

  const currentUser = useAppSelector(selectCurrentUser);

  const { data: userData, isLoading } = useGetUserByIdQuery(currentUser?.id, {
    skip: !currentUser?.id,
  });
  const [updateUserProfile] = useUpdateUserProfileMutation();

  const [updateUserPassword] = useUpdateUserPasswordMutation();

  const [inactiveUserAccount] = useInactiveUserAccountMutation();

  const handleLogout = useLogout();

  const initialState = useMemo(() => {
    if (userData?.data) {
      const user = userData.data;
      return {
        name: user.name || '',
        email: user.email || '',
        imageUrl: user.imageUrl || '',
      };
    }
    return form.initialState;
  }, [userData]);

  const { formData, formError, handleInputChange, isValidForm, resetForm, invalidForm } =
    useDebounceForm({
      initialState,
      requiredFields: form.requiredFields,
    });

  const {
    formData: passwordFormData,
    formError: passwordFormError,
    handleInputChange: handlePasswordFormInputChange,
    isValidForm: isValidPasswordForm,
  } = useDebounceForm(passwordForm);

  const handleUpdateBasicInfo = async () => {
    const payload = { name: formData.name, imageUrl: formData.imageUrl };
    await updateUserProfile({ id: currentUser?.id, payload });
    invalidForm();
    resetForm(payload);
  };

  const handleUpdatePassword = async () => {
    const payload = {
      currentPassword: passwordFormData.currentPassword,
      newPassword: passwordFormData.password,
    };
    await updateUserPassword({ id: currentUser?.id, payload });
    handleLogout();
  };

  const handleDeactivate = async () => {
    await inactiveUserAccount(currentUser?.id);
    handleLogout();
  };

  if (isLoading) {
    return <Fallback />;
  }

  return (
    <Stack spacing={4}>
      {/* Information Update Card */}
      <Card id="personal-info" sx={{ scrollMarginTop: 'var(--layout-header-desktop-height)' }}>
        <Box p={3} borderBottom="1px solid" borderColor="divider" bgcolor="grey.50">
          <Typography variant="subtitle1" fontWeight={700}>
            {t('basicForm.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('basicForm.description')}
          </Typography>
        </Box>

        <Box p={4}>
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
                  <TextInput
                    required
                    label={t('basicForm.name')}
                    name="name"
                    value={formData.name}
                    error={formError.name}
                    handleInputChange={handleInputChange}
                  />

                  <TextInput
                    type="email"
                    label={t('basicForm.email')}
                    name="email"
                    value={formData.email}
                    error={formError.email}
                    handleInputChange={handleInputChange}
                    disabled
                  />
                </Grid>
              </Stack>
            </Grid>
          </Grid>

          <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="text" color="inherit" onClick={() => resetForm(initialState)}>
              {t('basicForm.cancelBtnText')}
            </Button>
            <Button variant="contained" onClick={handleUpdateBasicInfo} disabled={!isValidForm()}>
              {t('basicForm.saveChangesBtnText')}
            </Button>
          </Box>
        </Box>
      </Card>

      {/* Password Update Card */}
      <Card id="security" sx={{ scrollMarginTop: 'var(--layout-header-desktop-height)' }}>
        <Box p={3} borderBottom="1px solid" borderColor="divider" bgcolor="grey.50">
          <Typography variant="subtitle1" fontWeight={700}>
            {t('passwordForm.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('passwordForm.description')}
          </Typography>
        </Box>
        <Box component="form" p={4}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={3}>
                <PasswordInput
                  externalLabel={t('passwordForm.currentPassword')}
                  name="currentPassword"
                  value={passwordFormData.currentPassword}
                  error={passwordFormError.currentPassword}
                  handleInputChange={handlePasswordFormInputChange}
                />

                <Grid container spacing={2}>
                  <Grid size={6}>
                    <PasswordInput
                      externalLabel={t('passwordForm.newPassword')}
                      name="password"
                      value={passwordFormData.password}
                      error={passwordFormError.password}
                      handleInputChange={handlePasswordFormInputChange}
                    />
                  </Grid>
                  <Grid size={6}>
                    <PasswordInput
                      externalLabel={t('passwordForm.confirmPassword')}
                      name="confirmPassword"
                      value={passwordFormData.confirmPassword}
                      error={passwordFormError.confirmPassword}
                      handleInputChange={handlePasswordFormInputChange}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ p: 2, borderRadius: 2, border: '1px solid', display: 'flex', gap: 2 }}>
                  <Warning color="info" fontSize="small" />
                  <Typography variant="caption" color="info.dark">
                    {t('passwordForm.suggestion')}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>

          <Box mt={4} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={handleUpdatePassword}
              disabled={!isValidPasswordForm()}
            >
              {t('passwordForm.updateBtnText')}
            </Button>
          </Box>
        </Box>
      </Card>

      {/* Danger Zone */}
      <Card sx={{ bgcolor: '#f0d3cdff' }}>
        <Box p={3} display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="subtitle2" color="error.dark" fontWeight={700}>
              {t('dangerZone.title')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('dangerZone.warning')}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={handleDeactivate}
          >
            {t('dangerZone.deactivateBtnText')}
          </Button>
        </Box>
      </Card>
      <Box sx={{ height: '250px' }} />
    </Stack>
  );
}
