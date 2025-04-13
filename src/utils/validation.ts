const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateField = (
  name: string,
  value: string,
  required: boolean,
  state: Record<string, any>
): string => {
  switch (name) {
    case 'email':
      if (!value && required) return 'Email is required!';
      if (!emailRegex.test(value)) return 'Invalid email format!';
      break;

    case 'password':
      if (!value && required) return 'Password is required!';
      if (value.length < 6) return 'Password must be at least 6 characters!';
      break;
    
      case 'confirmPassword':
      if (!value && required) return 'Password is required!';
      if (value !== state.password) return 'Passwords do not match!';
      break;

    case 'username':
      if (!value && required) return 'Username is required!';
      if (value.length < 3) return 'Username must be at least 3 characters!';
      break;

    default:
      return '';
  }
  return '';
};
