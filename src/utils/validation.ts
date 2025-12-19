const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateField = (
  name: string,
  value: string | boolean,
  required: boolean,
  state: Record<string, any>
): string => {
  switch (name) {
    case 'name':
      if (!value && required) return 'Name is required!';
      if (typeof value === 'string' && value.length > 0 && value.length < 3) return 'Name must be at least 3 characters!';
      break;

    case 'email':
      if (!value && required) return 'Email is required!';
      if (typeof value === 'string' && !emailRegex.test(value)) return 'Invalid email format!';
      break;

    case 'password':
      if (!value && required) return 'Password is required!';
      if (typeof value === 'string' && value.length > 0 && value.length < 6) return 'Password must be at least 6 characters!';
      break;

    case 'currentPassword':
      if (!value && required) return 'Current password is required!';
      break;

    case 'confirmPassword':
      if (!value && required) return 'Confirm password is required!';
      if (value !== state.password) return 'Passwords do not match!';
      break;

    case 'username':
      if (!value && required) return 'Username is required!';
      if (typeof value === 'string' && value.length > 0 && value.length < 3) return 'Username must be at least 3 characters!';
      break;

    default:
      return '';
  }
  return '';
};
