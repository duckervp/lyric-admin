import type { ThemeProviderProps as MuiThemeProviderProps } from '@mui/material/styles';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as ThemeVarsProvider } from '@mui/material/styles';

import { useAppSelector } from 'src/app/hooks';
import { selectCurrentLang } from 'src/app/api/lang/langSlice';

import { muiLocales } from './core/locale';
import { createTheme } from './create-theme';

import type {} from './extend-theme-types';
import type { ThemeOptions } from './types';

// ----------------------------------------------------------------------

export type ThemeProviderProps = Partial<MuiThemeProviderProps> & {
  themeOverrides?: ThemeOptions;
};

export function ThemeProvider({ themeOverrides, children, ...other }: ThemeProviderProps) {
  const currentLang = useAppSelector(selectCurrentLang);

  const locale = muiLocales[currentLang.locale];

  const theme = createTheme({
    themeOverrides,
    locale,
  });

  return (
    <ThemeVarsProvider disableTransitionOnChange theme={theme} {...other}>
      <CssBaseline />
      {children}
    </ThemeVarsProvider>
  );
}
