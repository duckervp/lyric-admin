import { useAppDispatch } from "src/app/hooks";
import { logout } from "src/app/api/auth/authSlice";

export default function useLogout() {
  const dispatch = useAppDispatch();

  const hanleLogout = () => {
    dispatch(logout());
  }

  return hanleLogout;
}