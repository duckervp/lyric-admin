export const muiLocales = {
    enUS,
    viVN,
} as const;
import { viVN, enUS } from '@mui/material/locale';

export type SupportedLocales = keyof typeof muiLocales;