import type { BoxProps } from '@mui/material/Box';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import Lock from '@mui/icons-material/Lock';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Settings from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';

import { ROUTES } from 'src/routes/config';

// ----------------------------------------------------------------------

export function ProfileNav({ sx, ...other }: BoxProps) {
  const { hash } = useLocation();

  const { t } = useTranslation('common', { keyPrefix: 'profileNav' });

  useEffect(() => {
    if (!hash) return;

    const id = hash.slice(1);
    const el = document.getElementById(id);

    if (!el) {
      return;
    }

    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [hash]);

  return (
    <Box>
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          alignItems: 'left',
          flexDirection: 'column',
          p: 1,
        }}
      >
        {/* <Logo /> */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4">{t('title')}</Typography>
        </Box>
      </Box>
      <Card variant="outlined" sx={{ overflow: 'hidden' }}>
        <List component="nav" sx={{ p: 1 }}>
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={location.hash === '#personal-info'}
              sx={{ borderRadius: 2 }}
              component={Link}
              to={ROUTES.PROFILE_INFO}
            >
              <ListItemIcon>
                <PersonIcon
                  fontSize="small"
                  color={location.hash === '#personal-info' ? 'primary' : undefined}
                />
              </ListItemIcon>
              <ListItemText
                primary={t('personalInfo')}
                slotProps={{
                  primary: {
                    variant: 'body2',
                    fontWeight: location.hash === '#personal-info' ? 600 : undefined,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              sx={{ borderRadius: 2 }}
              component={Link}
              to={ROUTES.PROFILE_SECURITY}
              selected={location.hash === '#security'}
            >
              <ListItemIcon>
                <Lock
                  fontSize="small"
                  color={location.hash === '#security' ? 'primary' : undefined}
                />
              </ListItemIcon>
              <ListItemText
                primary={t('security')}
                slotProps={{
                  primary: {
                    variant: 'body2',
                    fontWeight: location.hash === '#security' ? 600 : undefined,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              sx={{ borderRadius: 2 }}
              component={Link}
              to={ROUTES.SETTINGS}
              selected={location.pathname === ROUTES.SETTINGS}
            >
              <ListItemIcon>
                <Settings
                  fontSize="small"
                  color={location.pathname === ROUTES.SETTINGS ? 'primary' : undefined}
                />
              </ListItemIcon>
              <ListItemText
                primary={t('settings')}
                slotProps={{
                  primary: {
                    variant: 'body2',
                    fontWeight: location.pathname === ROUTES.SETTINGS ? 600 : undefined,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Card>
    </Box>
  );
}
