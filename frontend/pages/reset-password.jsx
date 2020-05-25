import { useState, useCallback, useEffect } from 'react'
import Cookies from 'js-cookie'
import Head from 'next/head'
import styled from 'styled-components'
import LogoLabel from '../components/form/logo-label'
import SiteForm from "../components/form/form"

const ResetPasswordDiv = styled.div``

const ResetPassword = () => {
  const Fragment = React.Fragment

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
    <Fragment>
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
    </Fragment>
  )
}
export default ResetPassword
