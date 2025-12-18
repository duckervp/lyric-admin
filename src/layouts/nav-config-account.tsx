import { Iconify } from 'src/components/iconify';

import type { AccountPopoverProps } from './components/account-popover';

// ----------------------------------------------------------------------
type MenuData = {
  viVN: AccountPopoverProps['data'];
  enUS: AccountPopoverProps['data'];
};

export const _account: MenuData = {
  viVN: [
    {
      label: 'Trang Chủ',
      href: '/',
      icon: <Iconify width={22} icon="solar:home-angle-bold-duotone" />,
    },
    {
      label: 'Hồ Sơ',
      href: '/profile',
      icon: <Iconify width={22} icon="solar:shield-keyhole-bold-duotone" />,
    },
    {
      label: 'Cài Đặt',
      href: '/settings',
      icon: <Iconify width={22} icon="solar:settings-bold-duotone" />,
    },
  ],
  enUS: [
    {
      label: 'Home',
      href: '/',
      icon: <Iconify width={22} icon="solar:home-angle-bold-duotone" />,
    },
    {
      label: 'Profile',
      href: '/profile',
      icon: <Iconify width={22} icon="solar:shield-keyhole-bold-duotone" />,
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: <Iconify width={22} icon="solar:settings-bold-duotone" />,
    },
  ],
};
