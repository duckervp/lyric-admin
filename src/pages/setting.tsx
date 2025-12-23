import { CONFIG } from 'src/config-global';

import { SettingView } from 'src/sections/setting';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Setting - ${CONFIG.appName}`}</title>

      <SettingView />
    </>
  );
}
