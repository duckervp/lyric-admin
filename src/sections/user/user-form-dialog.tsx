import type { Form } from 'src/hooks/use-debounce-form';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Stack from '@mui/material/Stack';

import { ROLES } from 'src/routes/config';

import useDebounceForm from 'src/hooks/use-debounce-form';

import { handleError } from 'src/utils/notify';

import { useGetUserByIdQuery, useCreateUserMutation } from 'src/app/api/user/userApiSlice';

import Fallback from 'src/components/loading/fallback';
import EditDialog from 'src/components/popup/edit-dialog';
import { TextInput } from 'src/components/input/text-input';
import { SwitchInput } from 'src/components/input/switch-input';
import { PasswordInput } from 'src/components/input/password-input';
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

  const handlePopupClose = () => {
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
      onPopupClose={handlePopupClose}
      title={id ? t('edit-title') : t('new-title')}
      width="800px"
    >
      <Stack spacing={3}>
        <TextInput
          required
          label={t('form.name')}
          name="name"
          value={formData.name}
          error={formError.name}
          handleInputChange={handleInputChange}
        />

        <TextInput
          required
          type="email"
          label={t('form.email')}
          name="email"
          value={formData.email}
          error={formError.email}
          handleInputChange={handleInputChange}
        />

        <SwitchInput
          label={t('form.role')}
          name="admin"
          value={formData.admin}
          handleInputChange={handleInputChange}
        />

        <SwitchInput
          label={t('form.verified')}
          name="isVerified"
          value={formData.isVerified}
          handleInputChange={handleInputChange}
        />

        <SwitchInput
          label={t('form.active')}
          name="active"
          value={formData.active}
          handleInputChange={handleInputChange}
        />

        <Stack spacing={3}>
          {id && (
            <SwitchInput
              label={t('form.change-password')}
              name="updatePassword"
              value={updatePassword}
              handleInputChange={(e) => setUpdatePassword(e.target.checked)}
            />
          )}

          {(!id || updatePassword) && (
            <PasswordInput
              required
              label={t('form.password')}
              name="password"
              value={formData.password}
              error={formError.password}
              handleInputChange={handleInputChange}
            />
          )}
        </Stack>
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
