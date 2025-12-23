import { Trans, useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { ROUTES } from 'src/routes/config';
import { useRouter } from 'src/routes/hooks';

import useLogin from 'src/hooks/use-login';
import useErrorHandle from 'src/hooks/use-error-handle';
import useDebounceForm from 'src/hooks/use-debounce-form';

import { useLoginMutation } from 'src/app/api/auth/authApiSlice';

import { Iconify } from 'src/components/iconify';
import { PasswordInput } from 'src/components/input/password-input';

// ----------------------------------------------------------------------
const form = {
  initialState: {
    email: '',
    password: '',
  },
  requiredFields: ['email', 'password'],
};

export function SignInView() {
  const { t } = useTranslation('auth', { keyPrefix: 'login' });

  const router = useRouter();

  const { formData, formError, handleInputChange, isValidForm } = useDebounceForm(form);

  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = useLogin();

  const handleApiError = useErrorHandle();

  const handleSignIn = async () => {
    if (!isValidForm()) {
      return;
    }

    handleApiError(async () => {
      const data = await login(formData).unwrap();
      if (!data) {
        return;
      }

      handleLogin(data);

      router.push('/');
    }, 'Login failed!');
  };

  const renderForm = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'column',
      }}
    >
      <TextField
        fullWidth
        name="email"
        label={t('emailLabel')}
        value={formData.email}
        error={!!formError.email}
        helperText={formError.email}
        onChange={handleInputChange}
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />

      <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        {t('forgotPassword')}
      </Link>

      <PasswordInput
        required
        label={t('passwordLabel')}
        name="password"
        value={formData.password}
        error={formError.password}
        handleInputChange={handleInputChange}
        onEnter={handleSignIn}
        sx={{ mb: 3 }}
      />

      <Button
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        disabled={!isValidForm()}
        onClick={handleSignIn}
        loading={isLoading}
      >
        {t('loginBtnText')}
      </Button>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          gap: 1.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 5,
        }}
      >
        <Typography variant="h5">{t('title')}</Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          <Trans
            i18nKey="login.subtitle"
            ns="auth"
            components={{
              l: (
                <Link
                  component={RouterLink}
                  variant="subtitle2"
                  sx={{ ml: 0.5 }}
                  to={ROUTES.REGISTER}
                />
              ),
            }}
          />
        </Typography>
      </Box>
      {renderForm}
      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          {t('or')}
        </Typography>
      </Divider>
      <Box
        sx={{
          gap: 1,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <IconButton color="inherit">
          <Iconify width={22} icon="socials:google" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify width={22} icon="socials:github" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify width={22} icon="socials:twitter" />
        </IconButton>
      </Box>
    </>
  );
}
