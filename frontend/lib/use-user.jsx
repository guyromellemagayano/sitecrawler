import { useEffect } from 'react'
import Router from 'next/router'
import useSWR from 'swr'

const useUser = ({
  redirectTo = false,
  redirectIfFound = false,
} = {}) => {
  const { data: user, mutate: mutateUser } = useSWR('/api/auth/user/')

  useEffect(() => {
    if (!redirectTo || !user) return

    if (
      (redirectTo && !redirectIfFound && !user?.isLoggedIn) || 
      (redirectIfFound && user?.isLoggedIn)
    ) {
      Router.push(redirectTo)
    }
  }, [user, redirectIfFound, redirectTo])

  return { user, mutateUser }
}

export default useUser