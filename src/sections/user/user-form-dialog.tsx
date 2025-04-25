import type { Form } from 'src/hooks/use-debounce-form';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { ROLES } from 'src/routes/config';

import useDebounceForm from 'src/hooks/use-debounce-form';

import { handleError } from 'src/utils/notify';

import { useGetUserByIdQuery, useCreateUserMutation } from 'src/app/api/user/userApiSlice';

import Fallback from 'src/components/loading/fallback';
import Password from 'src/components/textfield/password';
import EditDialog from 'src/components/dialog/edit-dialog';
//-------------------------------------------------------------------------

type UserFormDialogProps = {
  id?: number;
  removeId: () => void;
  open: boolean;
  setOpen: (val: boolean) => void;
};

const form: Form<any> = {
  initialState: {
    name: '',
    email: '',
    password: '',
    admin: false,
    active: false,
    isVerified: false,
  },
  requiredFields: ['name', 'email', 'password'],
};

export default function UserFormDialog({ id, removeId, open, setOpen }: UserFormDialogProps) {
  const { t } = useTranslation('user', { keyPrefix: 'user-form-dialog' });

  const { data, isLoading } = useGetUserByIdQuery(id, { skip: !id });
  const [createUser] = useCreateUserMutation();

  const { formData, formError, handleInputChange, isValidForm, resetForm } = useDebounceForm(form);

  const [updatePassword, setUpdatePassword] = useState(false);

  useEffect(() => {
    const userData = data?.data;

    if (id && userData) {
      resetForm({
        name: userData.name || '',
        email: userData.email || '',
        password: '', // don't prefill passwords usually
        admin: userData.role === ROLES.ADMIN,
        active: userData.active ?? false,
        isVerified: userData.isVerified ?? false,
      });
    }
  }, [id, data, resetForm]);

  const handleSave = async () => {
    console.log(formData);
    try {
      await createUser(formData).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    removeId();
    resetForm();
  };

  if (isLoading) {
    return <Fallback />;
  }

  return (
    <EditDialog
      open={open}
      canSave={isValidForm()}
      onSave={handleSave}
      onCancel={handleCancel}
      title={id ? t('edit-title') : t('new-title')}
    >
      <Stack spacing={3}>
        <Box>
          <Typography variant="subtitle2">
            <span style={{ color: 'red' }}>*</span> {t('form.name')}
          </Typography>
          <TextField
            name="name"
            fullWidth
            autoComplete="off"
            value={formData.name}
            onChange={handleInputChange}
            error={!!formError.name}
            helperText={formError.name}
          />
        </Box>

        <Box>
          <Typography variant="subtitle2">
            <span style={{ color: 'red' }}>*</span> {t('form.email')}
          </Typography>
          <TextField
            fullWidth
            name="email"
            autoComplete="off"
            value={formData.email}
            onChange={handleInputChange}
            error={!!formError.email}
            helperText={formError.email}
          />
        </Box>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: 200 }}
        >
          <Typography variant="subtitle2">{t('form.role')}</Typography>
          <Switch
            name="admin"
            slotProps={{ input: { 'aria-label': 'Role switch' } }}
            checked={formData.admin}
            onChange={handleInputChange}
          />
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: 200 }}
        >
          <Typography variant="subtitle2">{t('form.verified')}</Typography>
          <Switch
            name="isVerified"
            slotProps={{ input: { 'aria-label': 'Verified switch' } }}
            checked={formData.isVerified}
            onChange={handleInputChange}
          />
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: 200 }}
        >
          <Typography variant="subtitle2">{t('form.active')}</Typography>
          <Switch
            name="active"
            slotProps={{ input: { 'aria-label': 'Status switch' } }}
            checked={formData.active}
            onChange={handleInputChange}
          />
        </Stack>

        <Box>
          {id && (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ width: 200 }}
            >
              <Typography variant="subtitle2"> {t('form.change-password')} </Typography>
              <Switch
                sx={{ inputProps: { ariaLabel: 'Role switch' } }}
                checked={updatePassword}
                onChange={(e) => setUpdatePassword(e.target.checked)}
              />
            </Stack>
          )}

          {(!id || updatePassword) && (
            <Password
              upperLabel
              name="password"
              label={t('form.password')}
              formData={formData}
              formError={formError}
              onChange={handleInputChange}
            />
          )}
        </Box>
      </Stack>

      {/* <Stack sx={{ mt: 3 }}>
            {!isCreateScreen && auditData.createdBy && auditData.createdAt && (
              <Typography variant="body2">
                {t('form.created-by')}: <b>{auditData.createdBy}</b> {t('form.in')}{' '}
                <b>{fDateTime(auditData.createdAt)}</b>
              </Typography>
            )}
            {isDetailScreen && auditData.updatedAt && auditData.updatedBy && (
              <Typography variant="body2">
                {t('form.updated-by')}: <b>{auditData.updatedBy}</b> {t('form.in')}{' '}
                <b>{fDateTime(auditData.updatedAt)}</b>
              </Typography>
            )}
          </Stack> */}
    </EditDialog>
  );
}
