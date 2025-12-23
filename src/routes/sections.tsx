import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthLayout } from 'src/layouts/auth';
import { ProfileLayout, DashboardLayout } from 'src/layouts/dashboard';

import Fallback from 'src/components/loading/fallback';
import RequireAuth from 'src/components/auth/require-auth';

import { ROUTES } from './config';

// ----------------------------------------------------------------------

export const DashboardPage = lazy(() => import('src/pages/dashboard'));
export const ProfilePage = lazy(() => import('src/pages/profile'));
export const SettingPage = lazy(() => import('src/pages/setting'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SongPage = lazy(() => import('src/pages/song'));
export const ArtistPage = lazy(() => import('src/pages/artist'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const SignUpPage = lazy(() => import('src/pages/sign-up'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

export const routesSection: RouteObject[] = [
  {
    element: (
      <DashboardLayout>
        <Suspense fallback={<Fallback />}>
          <RequireAuth>
            <Outlet />
          </RequireAuth>
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: ROUTES.USER, element: <UserPage /> },
      { path: ROUTES.SONG, element: <SongPage /> },
      { path: ROUTES.ARTIST, element: <ArtistPage /> },
    ],
  },
  {
    element: (
      <ProfileLayout>
        <Suspense fallback={<Fallback />}>
          <RequireAuth>
            <Outlet />
          </RequireAuth>
        </Suspense>
      </ProfileLayout>
    ),
    children: [
      { path: ROUTES.PROFILE, element: <ProfilePage /> },
      { path: ROUTES.SETTINGS, element: <SettingPage /> },
    ],
  },
  {
    path: ROUTES.LOGIN,
    element: (
      <AuthLayout>
        <SignInPage />
      </AuthLayout>
    ),
  },
  {
    path: ROUTES.REGISTER,
    element: (
      <AuthLayout>
        <SignUpPage />
      </AuthLayout>
    ),
  },
  {
    path: ROUTES.NOT_FOUND,
    element: <Page404 />,
  },
  { path: '*', element: <Page404 /> },
];
