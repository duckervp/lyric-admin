import type { Form } from 'src/hooks/use-debounce-form';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import useDebounceForm from 'src/hooks/use-debounce-form';

import { handleError } from 'src/utils/notify';
import { fDateTime } from 'src/utils/format-time';

import {
  useGetArtistByIdQuery,
  useCreateArtistMutation,
  useUpdateArtistMutation,
} from 'src/app/api/artist/artistApiSlice';

import Fallback from 'src/components/loading/fallback';
import EditDialog from 'src/components/popup/edit-dialog';
import { TextInput } from 'src/components/input/text-input';
import { DButtonGroup } from 'src/components/button-group/button-group';
//-------------------------------------------------------------------------

type ArtistFormDialogProps = {
  id?: number;
  removeId: () => void;
  open: boolean;
  setOpen: (val: boolean) => void;
};

const form: Form<any> = {
  initialState: {
    name: '',
    role: 'singer',
    bio: '',
    imageUrl: '',
  },
  requiredFields: ['name', 'role'],
};

const mapPayload = (formData: any) => ({
  name: formData.name,
  role: formData.role,
  bio: formData.bio,
  imageUrl: formData.imageUrl,
});

export default function ArtistFormDialog({ id, removeId, open, setOpen }: ArtistFormDialogProps) {
  const { t } = useTranslation('artist', { keyPrefix: 'form-dialog' });

  const { data, isLoading } = useGetArtistByIdQuery(id, { skip: !id });
  const [createArtist] = useCreateArtistMutation();
  const [updateArtist] = useUpdateArtistMutation();

  const initialState = useMemo(() => {
    if (id && data?.data) {
      const artist = data.data;
      console.log("fetch", artist);
      return {
        name: artist.name || '',
        role: artist.role || '',
        bio: artist.bio || '',
      };
    }
    return form.initialState;
  }, [id, data]);

  const formRequiredFields = useMemo(() => {
    if (id && data?.data) {
      return ['name', 'role'];
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
        await updateArtist({ id, payload }).unwrap();
      } else {
        await createArtist(payload).unwrap();
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
      width="600px"
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

        <DButtonGroup
          label={t('form.role')}
          name="role"
          value={formData.role}
          handleInputChange={handleInputChange}
          items={[
            { value: 'singer', label: 'Singer' },
            { value: 'composer', label: 'Composer' },
            { value: 'singer_composer', label: 'Singer & Composer' },
          ]}
        />

        <TextField
          label="Biography"
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          multiline
          minRows={4}
          fullWidth
        />
      </Stack>

      <Stack sx={{ mt: 3 }}>
        {id && data?.data?.creatorName && data?.data?.createdAt && (
          <Typography variant="body2">
            {t('form.created-by')} <b>{data?.data?.creatorName}</b> {t('form.in')}{' '}
            <b>{fDateTime(data?.data?.createdAt)}</b>
          </Typography>
        )}
        {id && data?.data?.updatedAt && data?.data?.updaterName && (
          <Typography variant="body2">
            {t('form.updated-by')} <b>{data?.data?.updaterName}</b> {t('form.in')}{' '}
            <b>{fDateTime(data?.data?.updatedAt)}</b>
          </Typography>
        )}
      </Stack>
    </EditDialog>
  );
}
