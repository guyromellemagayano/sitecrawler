import { useState } from 'react'
import Cookies from 'js-cookie'
import { useUser } from '../src/lib/hooks'
import Head from 'next/head'
import styled from 'styled-components'
import LogoLabel from '../src/components/site/logo-label'
import SiteForm from "../src/components/site/form"

const ResetPasswordDiv = styled.div``

const ResetPassword = () => {
  useUser({ redirectTo: '/', redirectIfFound: true })

  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  async function handleSubmit(e) {
    event.preventDefault()

    if (errorMsg) setErrorMsg('')
    if (successMsg) setSuccessMsg('')

    const body = {
      email: e.currentTarget.email.value,
    }

    try {
      const res = await fetch('/api/auth/password/reset/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
        body: JSON.stringify(body),
      })

      if (Math.floor(res.status / 200) === 1) {
        setSuccessMsg(`Reset password requested. Please check your email to continue the process!`)
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
        <title>Reset Password</title>
      </Head>

      <ResetPasswordDiv className={`min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8`}>
        <LogoLabel
          isResetPassword
        />
        <SiteForm
          isResetPassword
          errorMessage={errorMsg}
          successMessage={successMsg}
          onSubmit={handleSubmit}
        />
      </ResetPasswordDiv>
    </>
  )
}
export default ResetPassword
