import { useState } from 'react'
import Cookies from 'js-cookie'
import { useUser } from '../src/lib/hooks'
import Head from 'next/head'
import styled from 'styled-components'
import LogoLabel from '../src/components/site/logo-label'
import SiteForm from "../src/components/site/form"

const RegistrationDiv = styled.div``

const Registration = () => {
  useUser({ redirectTo: '/', redirectIfFound: true })

  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  async function handleSubmit(e) {
    event.preventDefault()

    if (errorMsg) setErrorMsg('')
    if (successMsg) setSuccessMsg('')

    const body = {
      username: e.currentTarget.username.value,
      email: e.currentTarget.email.value,
      password1: e.currentTarget.password1.value,
      password2: e.currentTarget.password2.value,
    }

    if (body.password1 !== body.password2) {
      setErrorMsg(`The passwords don't match`)
      return
    }

    try {
      const res = await fetch('/api/auth/registration/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
        body: JSON.stringify(body),
      })

      if (Math.floor(res.status/200) === 1) {
        setSuccessMsg(`Thanks for signing up. Please check your email for confirmation!`)
      } else {
        throw new Error(await res.text())
      }
    } catch (error) {
      // console.error('An unexpected error occurred:', error)
      setErrorMsg(error.message)
    }
  }

  return (
    <>
      <Head>
        <title>Registration</title>
      </Head>

      <RegistrationDiv className={`min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8`}>
        <LogoLabel
          isSignUp
        />
        <SiteForm
          isSignUp
          errorMessage={errorMsg}
          successMessage={successMsg}
          onSubmit={handleSubmit}
        />
      </RegistrationDiv>
    </>
  )
}

export default Registration
