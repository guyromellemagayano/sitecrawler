import React, { useState } from 'react'
import Cookies from 'js-cookie'
import Head from 'next/head'
import styled from 'styled-components'
import LogoLabel from '../components/form/logo-label'
import SiteForm from '../components/form/form'
import fetchJson from '../hooks/fetch-json'
import useUser from '../hooks/use-user'

const LoginDiv = styled.div``

const Login = () => {
  const Fragment = React.Fragment

  const { mutateUser } = useUser({
    redirectTo: '/dashboard',
    redirectIfFound: true,
  })

  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (errorMsg) setErrorMsg('')
    if (successMsg) setSuccessMsg('')

    const body = {
      username: e.currentTarget.username.value,
      password: e.currentTarget.password1.value,
    }

    try {
      await mutateUser(
        fetchJson('/api/auth/login/', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken'),
          },
          body: JSON.stringify(body),
        })
      )
    } catch(error) {
      console.error('An unexpected error occurred', error)
      setErrorMsg(error.data.message)
    }
  }

  return (
    <Fragment>
      <Head>
        <title>Login</title>
      </Head>

      <LoginDiv
        className={`min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8`}
      >
        <LogoLabel isLogin />

        <SiteForm
          isLogin
          errorMessage={errorMsg}
          successMessage={successMsg}
          onSubmit={handleSubmit}
        />
      </LoginDiv>
    </Fragment>
  );
}

export default Login
