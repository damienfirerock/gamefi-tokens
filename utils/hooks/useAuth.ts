import { useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

import { useSelector, useDispatch } from "react-redux";

import {
  setSession,
  setLoading,
  setDialogOpen,
} from "../../features/AuthSlice";
import { AppDispatch, RootState } from "../../store";

export default function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session, status } = useSession();

  const authSlice = useSelector((state: RootState) => state.auth);
  const { session: reduxSession, loading: reduxLoading } = authSlice;

  // Sets new Session on Session change
  useEffect(() => {
    if (status !== "loading") {
      dispatch(setSession(session));
      dispatch(setLoading(false));
    }
  }, [session, status]);

  // Shows LoginDialog for new user
  useEffect(() => {
    if (!session && !reduxLoading) {
      const popupShown = localStorage.getItem("loginPopupShown");

      if (!popupShown) {
        dispatch(setDialogOpen());
        localStorage.setItem("loginPopupShown", "true");
      }
    }
  }, [session, reduxLoading]);

  return {
    session: reduxSession,
    loading: reduxLoading,
    signIn: (provider: string) => signIn(provider),
    signOut: () => signOut(),
  };
}
