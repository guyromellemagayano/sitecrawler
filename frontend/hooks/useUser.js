import { useEffect } from "react";
import Router from "next/router";
import useSWR from "swr";

const useUser = ({ redirectTo = false, redirectIfFound = false} = {}) => {
  const { data: user, mutate: mutateUser } = useSWR("/api/auth/user/");

  useEffect(() => {    
    if (user && redirectIfFound) {
      if ("key" in user) {
        Router.push(redirectTo);
      }
    } else {
      return;
    }
  }, [user, redirectIfFound, redirectTo]);

  return { user, mutateUser };
};

export default useUser;
