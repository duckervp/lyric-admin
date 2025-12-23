import { ROUTES } from "src/routes/config";
import { useRouter } from "src/routes/hooks";

import { useAppDispatch } from "src/app/hooks";
import { logout } from "src/app/api/auth/authSlice";

export default function useLogout() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push(ROUTES.LOGIN);
  }

  return handleLogout;
}