import type { IconButtonProps } from '@mui/material/IconButton';

import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { changeLang, selectCurrentLang } from 'src/app/api/lang/langSlice';

// ----------------------------------------------------------------------

export type LanguagePopoverProps = IconButtonProps & {
  data?: {
    value: string;
    label: string;
    icon: string;
  }[];
};

export function LanguagePopover({ data = [], sx, ...other }: LanguagePopoverProps) {
  const { t, i18n } = useTranslation('translation', { keyPrefix: 'lang' });

  const { open, anchorEl, onClose, onOpen } = usePopover();

  const currentLang = useAppSelector(selectCurrentLang);

  const [locale, setLocale] = useState(currentLang);

  const dispatch = useAppDispatch();

  const handleChangeLang = useCallback(
    (newLang: any) => {
      i18n.changeLanguage(newLang.value);
      setLocale(newLang);
      dispatch(changeLang(newLang));
      onClose();
    },
    [onClose, i18n, dispatch]
  );

  const renderFlag = (label?: string, icon?: string) => (
    <Box
      component="img"
      alt={label}
      src={icon}
      sx={{ width: 26, height: 20, borderRadius: 0.5, objectFit: 'cover' }}
    />
  );

  const renderMenuList = () => (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <MenuList
        sx={{
          p: 0.5,
          gap: 0.5,
          width: 160,
          minHeight: 72,
          display: 'flex',
          flexDirection: 'column',
          [`& .${menuItemClasses.root}`]: {
            px: 1,
            gap: 2,
            borderRadius: 0.75,
            [`&.${menuItemClasses.selected}`]: {
              bgcolor: 'action.selected',
              fontWeight: 'fontWeightSemiBold',
            },
          },
        }}
      >
        {data?.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === locale?.value}
            onClick={() => handleChangeLang(option)}
          >
            {renderFlag(option.label, option.icon)}
            {option.label}
          </MenuItem>
        ))}
      </MenuList>
    </Popover>
  );

  return (
    <>
      <IconButton
        aria-label="Languages button"
        onClick={onOpen}
        sx={[
          (theme) => ({
            p: 0,
            width: 40,
            height: 40,
            ...(open && { bgcolor: theme.vars.palette.action.selected }),
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        {renderFlag(locale?.label, locale?.icon)}
      </IconButton>

      {renderMenuList()}
    </>
  );
}
