import { useEffect } from "react";
import Router from "next/router";
import useSWR from "swr";

const useUser = ({ redirectTo = false, redirectIfFound = false } = {}) => {
  const { data: user, mutate: mutateUser, revalidate } = useSWR("/api/auth/user/", { 
    refreshInterval: 1000
  });

  useEffect(() => {
    if (!redirectTo || !user) {
      revalidate();
      return;
    } 

    if (
      (redirectTo && !redirectIfFound && !user) ||
      (redirectIfFound && user)
    ) {
      Router.push(redirectTo);
    }
  }, [user, redirectIfFound, redirectTo]);

  return { user, mutateUser };
};

export default useUser;
