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
import useDebounceForm from 'src/hooks/use-debounce-form';

import { handleError } from 'src/utils/notify';

import { useRegisterMutation } from 'src/app/api/auth/authApiSlice';

import { Iconify } from 'src/components/iconify';
import { PasswordInput } from 'src/components/input/password-input';

// ----------------------------------------------------------------------
const form = {
  initialState: {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
  requiredFields: ['name', 'email', 'password', 'confirmPassword'],
};

export function SignUpView() {
  const router = useRouter();

  const { formData, formError, handleInputChange, isValidForm } = useDebounceForm(form);

  const [register, { isLoading }] = useRegisterMutation();

  const handleLogin = useLogin();

  const handleSignUp = async () => {
    if (!isValidForm()) {
      return;
    }

    try {
      const data = await register(formData).unwrap();
      if (!data) {
        return;
      }

      handleLogin(data);

      router.push('/');
    } catch (error) {
      handleError(error, 'Register failed!');
    }
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
        name="name"
        label="Your name"
        value={formData.name}
        error={!!formError.name}
        helperText={formError.name}
        onChange={handleInputChange}
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />

      <TextField
        fullWidth
        name="email"
        label="Email address"
        value={formData.email}
        error={!!formError.email}
        helperText={formError.email}
        onChange={handleInputChange}
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />

      <PasswordInput
        required
        label="Password"
        name="password"
        value={formData.password}
        error={formError.password}
        handleInputChange={handleInputChange}
        sx={{ mb: 3 }}
      />

      <PasswordInput
        required
        label="Confirm password"
        name="confirmPassword"
        value={formData.password}
        error={formError.password}
        handleInputChange={handleInputChange}
        sx={{ mb: 3 }}
      />

      <Button
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        disabled={!isValidForm()}
        onClick={handleSignUp}
        loading={isLoading}
      >
        Sign up
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
        <Typography variant="h5">Sign up</Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          Already have an account?
          <Link component={RouterLink} variant="subtitle2" sx={{ ml: 0.5 }} to={ROUTES.LOGIN}>
            Continue
          </Link>
        </Typography>
      </Box>
      {renderForm}
      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          OR
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
