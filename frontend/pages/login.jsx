import { useState, useCallback, useEffect } from 'react'
import Cookies from 'js-cookie'
import Router from 'next/router'
import Head from 'next/head'
import styled from 'styled-components'
import LogoLabel from '../src/components/site/logo-label'
import SiteForm from '../src/components/site/form'

const LoginDiv = styled.div``

const Login = () => {
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleSubmit = useCallback((e) => {
    event.preventDefault()

    if (errorMsg) setErrorMsg('')
    if (successMsg) setSuccessMsg('')

    const body = {
      username: e.currentTarget.username.value,
      password: e.currentTarget.password1.value,
    }

    try {
      fetch('/api/auth/login/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
        body: JSON.stringify(body),
      }).then((res) => {
        if (res.ok) {
          setSuccessMsg('Login Success')
          Router.push('/dashboard')
        }
      })
    } catch(error) {
      // console.error('An unexpected error occurred', error)
      setErrorMsg(error.message)
    }
  }, [])

  useEffect(() => {
    Router.prefetch('/dashboard/')
  }, [])

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>

      <LoginDiv className={`min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8`}>
        <LogoLabel 
          isLogin
        />
        <SiteForm
          isLogin
          errorMessage={errorMsg}
          successMessage={successMsg}
          onSubmit={handleSubmit}
        />
      </LoginDiv>
    </>
  )
}

export default Login
