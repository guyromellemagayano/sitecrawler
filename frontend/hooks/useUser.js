import { useEffect } from "react";
import Router from "next/router";
import useSWR from "swr";
import Cookies from 'js-cookie'

const fetcher = async (url) => {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
  })

  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(res.status)
  }

  return data
}

const useUser = ({ redirectTo = false, redirectIfFound = false} = {}) => {
  const { data: user, mutate: mutateUser, error: userError } = useSWR("/api/auth/user/", fetcher);

  useEffect(() => {
    if (userError == 'Error: 403' && !redirectIfFound) Router.push(redirectTo)

    if (user && redirectIfFound) {
      if ("key" in user) {
        console.log('[user]', user)
        Router.push(redirectTo);
      }
    } else {
      return;
    }
  }, [user, redirectIfFound, redirectTo, userError]);

  return { user, mutateUser, userError };
};

export default useUser;
