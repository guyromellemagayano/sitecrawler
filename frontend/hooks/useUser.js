import { useEffect } from "react";
import Router, { useRouter } from "next/router";
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
  const { query, asPath } = useRouter()

  useEffect(() => {
    if (userError == 'Error: 403' && !redirectIfFound) {
      Router.push({ pathname: redirectTo, query: { redirect: asPath }})
      Cookies.set("errLogin", "You must log in to access the page!", {
        expires: new Date(new Date().getTime() + 0.05 * 60 * 1000) // expires in 3s
      })
    }

    if (user && redirectIfFound) {
      if ("key" in user) {
        // console.log('[user]', user)
        Router.push(redirectTo);
      }
    } else {
      return;
    }
  }, [user, redirectIfFound, redirectTo, userError]);

  return { user, mutateUser, userError };
};

export default useUser;
