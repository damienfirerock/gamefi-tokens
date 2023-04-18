import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "../../store";
import { login, logout } from "../../features/AuthSlice";

export default function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);

  const loginUser = (userData: { email: string; password: string }) => {
    dispatch(login(userData));
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  return {
    isLoggedIn,
    user,
    loginUser,
    logoutUser,
  };
}
