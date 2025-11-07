import type { Form } from 'src/hooks/use-debounce-form';

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { ROLES } from 'src/routes/config';

import useDebounceForm from 'src/hooks/use-debounce-form';

import { handleError } from 'src/utils/notify';
import { fDateTime } from 'src/utils/format-time';

import {
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
} from 'src/app/api/user/userApiSlice';

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
    verified: false,
  },
  requiredFields: ['name', 'email', 'password'],
};

const mapPayload = (formData: any) => ({
  name: formData.name,
  email: formData.email,
  password: formData.password,
  role: formData.admin ? ROLES.ADMIN : ROLES.USER,
  active: formData.active,
  verified: formData.verified,
});

export default function UserFormDialog({ id, removeId, open, setOpen }: UserFormDialogProps) {
  const { t } = useTranslation('user', { keyPrefix: 'user-form-dialog' });

  const { data, isLoading } = useGetUserByIdQuery(id, { skip: !id });
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [updatePassword, setUpdatePassword] = useState(false);

  const initialState = useMemo(() => {
    if (id && data?.data) {
      const user = data.data;
      return {
        name: user.name || '',
        email: user.email || '',
        password: '',
        admin: user.role === ROLES.ADMIN,
        active: !!user.active,
        verified: !!user.verified,
      };
    }
    return form.initialState;
  }, [id, data]);

  const formRequiredFields = useMemo(() => {
    if (id && data?.data) {
      return ['name', 'email'];
    }
    return form.requiredFields;
  }, [id, data]);

  const { formData, formError, handleInputChange, isValidForm, resetForm } = useDebounceForm({
    initialState,
    requiredFields: formRequiredFields,
  });

  const handleSave = async () => {
    try {
      const payload = mapPayload(formData);
      if (id) {
        if (!updatePassword) {
          delete payload.password;
        }
        await updateUser({ id, payload }).unwrap();
      } else {
        await createUser(payload).unwrap();
      }
      handlePopupClose();
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
          name="verified"
          value={formData.verified}
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
              externalLabel={t('form.password')}
              name="password"
              value={formData.password}
              error={formError.password}
              handleInputChange={handleInputChange}
            />
          )}
        </Stack>
      </Stack>

      <Stack sx={{ mt: 3 }}>
        {id && data?.data?.createdBy && data?.data?.createdAt && (
          <Typography variant="body2">
            {t('form.created-by')} <b>{data?.data?.createdBy}</b> {t('form.in')}{' '}
            <b>{fDateTime(data?.data?.createdAt)}</b>
          </Typography>
        )}
        {id && data?.data?.updatedAt && data?.data?.updatedBy && (
          <Typography variant="body2">
            {t('form.updated-by')} <b>{data?.data?.updatedBy}</b> {t('form.in')}{' '}
            <b>{fDateTime(data?.data?.updatedAt)}</b>
          </Typography>
        )}
      </Stack>
    </EditDialog>
  );
}
