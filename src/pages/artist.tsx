import { CONFIG } from 'src/config-global';

import { ArtistView } from 'src/sections/artist/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Artists - ${CONFIG.appName}`}</title>

      <ArtistView />
    </>
  );
}
