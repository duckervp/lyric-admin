import { mergeClasses } from 'minimal-shared/utils';

import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';

import { layoutClasses } from './classes';
import { ProfileNav } from '../components/profile-nav';

// ----------------------------------------------------------------------

export type MainSectionProps = React.ComponentProps<typeof MainRoot>;

export function ProfileMainSection({ children, className, sx, ...other }: MainSectionProps) {
  return (
    <MainRoot className={mergeClasses([layoutClasses.main, className])} sx={sx} {...other}>
      <Container>
        <Grid container spacing={12}>
          {/* Sidebar spacer (keeps layout) */}
          <Grid size={{ xs: 12, md: 3 }} sx={{ display: { xs: 'none', md: 'block' } }} />

          {/* Fixed Sidebar */}
          <Grid
            size={{ xs: 12, md: 3 }}
            sx={{
              position: 'fixed',
              top: 64,
              height: 'calc(100vh - 64px)',
              width: { md: '25%' }, // md = 3 / 12
              maxWidth: 300, // optional cap
              display: { xs: 'none', md: 'block' },
              zIndex: 1,
            }}
          >
            <ProfileNav />
          </Grid>

          {/* Main Area */}
          <Grid size={{ xs: 12, md: 9 }}>{children}</Grid>
        </Grid>
      </Container>
    </MainRoot>
  );
}

// ----------------------------------------------------------------------

const MainRoot = styled('main')({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
});
