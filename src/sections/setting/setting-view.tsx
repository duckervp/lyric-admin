import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { _langs } from 'src/_mock';
import { useAppSelector } from 'src/app/hooks';
import { selectCurrentLang } from 'src/app/api/lang/langSlice';
import { LanguagePopover } from 'src/layouts/components/language-popover';

// ----------------------------------------------------------------------

export function SettingView() {
  const { t } = useTranslation('profile', { keyPrefix: 'settings' });

  const currentLang = useAppSelector(selectCurrentLang);

  return (
    <Stack spacing={4}>
      <Card id="personal-info" sx={{ scrollMarginTop: 'var(--layout-header-desktop-height)' }}>
        <Box p={3} borderBottom="1px solid" borderColor="divider" bgcolor="grey.50">
          <Typography variant="subtitle1" fontWeight={700}>
            {t('language.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('language.description')}
          </Typography>
        </Box>

        <Box p={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2">
            {t('language.current')}
          </Typography>
          <LanguagePopover data={_langs[currentLang.locale]} />
        </Box>
      </Card>
    </Stack>
  );
}
