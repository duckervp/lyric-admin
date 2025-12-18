import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData = {
  viVN: [
    {
      title: 'Tổng Quan',
      path: '/',
      icon: icon('ic-analytics'),
    },
    {
      title: 'Người Dùng',
      path: '/user',
      icon: icon('ic-user'),
    },
    {
      title: 'Bài Hát',
      path: '/song',
      icon: icon('ic-music-library'),
    },
    {
      title: 'Nghệ Sĩ',
      path: '/artist',
      icon: icon('ic-music-artist'),
    },
  ],
  enUS: [
    {
      title: 'Dashboard',
      path: '/',
      icon: icon('ic-analytics'),
    },
    {
      title: 'User',
      path: '/user',
      icon: icon('ic-user'),
    },
    {
      title: 'Song',
      path: '/song',
      icon: icon('ic-blog'),
    },
    {
      title: 'Artist',
      path: '/artist',
      icon: icon('ic-user'),
    },
  ],
};
