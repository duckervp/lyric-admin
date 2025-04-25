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

import { useLoginMutation } from 'src/app/api/auth/authApiSlice';

import { Iconify } from 'src/components/iconify';
import Password from 'src/components/textfield/password';

// ----------------------------------------------------------------------
const form = {
  initialState: {
    email: '',
    password: '',
  },
  requiredFields: ['email', 'password'],
};

export function SignInView() {
  const router = useRouter();

  const { formData, formError, handleInputChange, isValidForm } = useDebounceForm(form);

  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = useLogin();

  const handleSignIn = async () => {
    if (!isValidForm()) {
      return;
    }

    try {
      const data = await login(formData).unwrap();
      if (!data) {
        return;
      }

      handleLogin(data);
      console.log('Login successful:', data);

      router.push('/');
    } catch (error) {
      console.log('Login error:', error);
      handleError(error, 'Login failed!');
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

      <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        Forgot password?
      </Link>

      <Password
        name="password"
        label="Password"
        formData={formData}
        formError={formError}
        onChange={handleInputChange}
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
        Sign in
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
        <Typography variant="h5">Sign in</Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          Don’t have an account?
          <Link component={RouterLink} variant="subtitle2" sx={{ ml: 0.5 }} to={ROUTES.REGISTER}>
            Get started
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
