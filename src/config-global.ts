import packageJson from '../package.json';

// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
  showSuccessMessage: boolean;
  beBaseUrl: string;
};

export const CONFIG: ConfigValue = {
  appName: 'Minimal UI',
  appVersion: packageJson.version,
  showSuccessMessage: true,
  beBaseUrl: import.meta.env.VITE_BE_BASE_URL,
};
