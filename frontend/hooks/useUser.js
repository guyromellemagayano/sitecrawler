import { useEffect } from "react";
import Router from "next/router";
import useSWR from "swr";

const useUser = ({ redirectTo = false, redirectIfFound = false, redirectToLogin = false} = {}) => {
  const { data: user, mutate: mutateUser } = useSWR("/api/auth/user/");

  useEffect(() => {
    if (!redirectTo && !user && redirectToLogin) {
      return
    } 
    
    if (
      (redirectTo && !redirectIfFound && !user && redirectToLogin) ||
      (redirectIfFound && user && redirectToLogin)
    ) {
      Router.push(redirectTo);
    }
  }, [user, redirectIfFound, redirectTo, redirectToLogin]);

  return { user, mutateUser };
};

export default useUser;
