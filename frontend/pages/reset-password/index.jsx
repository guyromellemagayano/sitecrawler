import { useState, Fragment } from 'react'
import fetch from 'node-fetch'
import Cookies from 'js-cookie'
import Head from 'next/head'
import Link from 'next/link'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Layout from '../../components/Layout'
import LogoLabel from '../../components/form/LogoLabel'

const ResetPasswordDiv = styled.div``

const ResetPassword = () => {
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [email, setEmail] = useState('')
  const [errorEmailMsg, setErrorEmailMsg] = useState('')
  const [disableResetPasswordForm, setDisableResetPasswordForm] = useState(false)
  const pageTitle = 'Reset Password'

  const handleSubmit = async (e) => {
    event.preventDefault()

    if (errorMsg) setErrorMsg('')
    if (successMsg) setSuccessMsg('')

    const body = {
      email: email
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
        setDisableResetPasswordForm(!disableResetPasswordForm)
        setSuccessMsg(`Reset password requested. Please check your email to continue the process.`)
      } else {
        throw new Error(await res.text())
      }
    } catch (error) {
      if (error.response) {
        console.error(error.response.data)
        console.error(error.response.status)
        console.error(error.response.headers)
      } else if (error.request) {
        console.error(error.request)
      } else {
        let data = JSON.parse(error.message)
        
        if (data.email) {
          setErrorEmailMsg(data.email[0])
        } else {
          console.error(error.message)
          setErrorMsg('An unexpected error occurred. Please try again.')
        }
      }
    }
  }

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <ResetPasswordDiv
        className={`min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8`}
      >
        {!disableResetPasswordForm ? (
          <LogoLabel isResetPassword />
        ) : null}

        <div className={`mt-8 sm:mx-auto sm:w-full sm:max-w-md`}>
          {errorMsg && (
            <div className={`rounded-md bg-red-100 p-4 mb-8`}>
              <div className={`flex`}>
                <div className={`flex-shrink-0`}>
                  <svg
                    className={`h-5 w-5 text-red-400`}
                    fill={`currentColor`}
                    viewBox={`0 0 20 20`}
                  >
                    <path
                      fillRule={`evenodd`}
                      d={`M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z`}
                      clipRule={`evenodd`}
                    />
                  </svg>
                </div>
                <div className={`ml-3`}>
                  <h3
                    className={`text-sm leading-5 font-medium text-red-800 break-words`}
                  >
                    {errorMsg}
                  </h3>
                </div>
              </div>
            </div>
          )}

          {successMsg && (
            <div className={`rounded-md bg-green-100 p-4 mb-8`}>
              <div className={`flex`}>
                <div className={`flex-shrink-0`}>
                  <svg
                    className={`h-5 w-5 text-green-400`}
                    fill={`currentColor`}
                    viewBox={`0 0 20 20`}
                  >
                    <path
                      fillRule={`evenodd`}
                      d={`M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z`}
                      clipRule={`evenodd`}
                    />
                  </svg>
                </div>
                <div className={`ml-3`}>
                  <h3
                    className={`text-sm leading-5 font-medium text-green-800 break-words`}
                  >
                    {successMsg}
                  </h3>
                </div>
              </div>
            </div>
          )}

          {!disableResetPasswordForm ? (
            <Fragment>
              <div className={`bg-white py-8 px-4 shadow-xs sm:rounded-lg sm:px-10`}>
                <form onSubmit={handleSubmit}>
                  <div className={`mt-1`}>
                    <label
                      htmlFor={`email`}
                      className={`block text-sm font-medium leading-5 text-gray-700`}
                    >
                      Email address
                    </label>
                    <div className={`mt-1 rounded-md shadow-xs-sm`}>
                      <input
                        id={`email`}
                        type={`email`}
                        name={`email`}
                        className={`appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-xs-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${errorEmailMsg ? "border-red-300" : "border-gray-300"}`}
                        aria-describedby={`email`}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <span className={`block mt-2 text-sm leading-5 text-red-700`}>{errorEmailMsg}</span>
                  </div>

                  <div className={`mt-6`}>
                    <span className={`block w-full rounded-md shadow-xs-sm`}>
                      <button
                        type={`submit`}
                        className={`w-full flex justify-center mt-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-xs-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out`}
                      >
                        Reset Password
                      </button>
                    </span>
                  </div>
                </form>
              </div>

              <div
                className={`relative flex justify-center wrap flex-row text-sm leading-5`}
              >
                <span className={`px-2 py-5 text-gray-500`}>
                  Not Sure? Go back to&nbsp;
                  <Link href="/login">
                    <a
                      className={`font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150`}
                    >
                      Login
                    </a>
                  </Link>
                </span>
              </div>
            </Fragment>
          ) : (
            <div className={`relative flex justify-center wrap flex-row text-sm leading-5`}>
              <span className={`px-2 py-5 text-gray-500`}>
                Already have an account?&nbsp;
                <Link href="/login">
                  <a
                    className={`font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150`}
                  >
                    Log In
                  </a>
                </Link>
              </span>
            </div>
          )}
        </div>
      </ResetPasswordDiv>
    </Layout>
  );
}
export default ResetPassword

ResetPassword.propTypes = {
  errorMsg: PropTypes.string,
  successMsg: PropTypes.string,
  handleSubmit: PropTypes.func,
}