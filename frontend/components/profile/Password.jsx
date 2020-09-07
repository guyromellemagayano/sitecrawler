import { Fragment, useState, useEffect } from 'react'
import fetch from 'node-fetch'
import Cookies from 'js-cookie'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Skeleton from 'react-loading-skeleton'
import Transition from 'hooks/Transition'
import PasswordStrengthBar from 'react-password-strength-bar';
import useUser from 'hooks/useUser'

const ProfileSettingsPasswordDiv = styled.div``

const ProfileSettingsPassword = () => {
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [disablePasswordFields, setDisablePasswordFields] = useState(true)
  const [disableSubmitButton, setDisableSubmitButton] = useState(false)
  const [showNotificationStatus, setShowNotificationStatus] = useState(false)
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')

  useEffect(() => {
    if (password1 === password2) {
      setDisableSubmitButton(!disableSubmitButton)
    }
  }, [password1, password2])

  const handlePasswordSubmission = async (e) => {
    e.preventDefault()

    if (errorMsg) setErrorMsg('')
    if (successMsg) setSuccessMsg('')

    const body = {
      new_password1: e.currentTarget.password1.value,
      new_password2: e.currentTarget.password2.value,
    }

    try {
      const response = await fetch('/api/auth/password/change/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
        body: JSON.stringify(body),
      })
      
      const data = await response.json()

      if (response.ok && response.status === 200) {
        if (data) {
          setSuccessMsg('Password information update successfully.')
          setTimeout(() => setShowNotificationStatus(true), 1500)
          setDisablePasswordFields(!disablePasswordFields)
          setDisableSubmitButton(!disableSubmitButton)
        } else {
          setErrorMsg('Password information update failed. Please try again.')
          setTimeout(() => setShowNotificationStatus(true), 1500)
        }
      } else {
        if (Math.floor(response.status/400) === 1) {
          setErrorMsg(data.new_password2[0])
          setTimeout(() => setShowNotificationStatus(true), 1500)
        } else {
          const error = new Error(response.statusText)
  
          error.response = response
          error.data = data
    
          throw error
        }
      }
    } catch(error) {
      if (!error.data) {
        error.data = { message: error.message }
      }

      setErrorMsg('An unexpected error occurred. Please try again.')
      setTimeout(() => setShowNotificationStatus(true), 1500)

      throw error
    }
  }

  const handleEditPasswordProfile = (e) => {
    e.preventDefault()

    setDisablePasswordFields(!disablePasswordFields)
  }

  const handlePasswordOneInputChange = (e) => {
    setPassword1(e.target.value)
  }

  const handlePasswordTwoInputChange = (e) => {
    setPassword2(e.target.value)
  }

  const { user: user, userError: userError } = useUser({
    redirectTo: '/',
    redirectIfFound: false
  })

  useEffect(() => {
    if (showNotificationStatus === true)
    setTimeout(() => setShowNotificationStatus(false), 7500)
  }, [showNotificationStatus])

  if (userError) return <div>{userError.message}</div>

  return (
    <Fragment>
      {!user ? (
        <ProfileSettingsPasswordDiv className={`mt-5 max-w-full`}>
          <Skeleton duration={2} width={320} height={586} />
        </ProfileSettingsPasswordDiv>
      ) : (
        <>
          <Transition show={showNotificationStatus}>
            <div
              className={`fixed z-50 inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end`}
            >
              <Transition
                enter="transform ease-out duration-300 transition"
                enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div
                  className={`max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto`}
                >
                  <div className={`rounded-lg shadow-xs overflow-hidden`}>
                    <div className={`p-4`}>
                      <div className={`flex items-start`}>
                        <div className={`flex-shrink-0`}>
                          {errorMsg ? (
                            <svg
                              className={`h-8 w-8 text-red-400`}
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          ) : successMsg ? (
                            <svg
                              className={`h-8 w-8 text-green-400`}
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          ) : (
                            <svg
                              className={`h-8 w-8 text-gray-400`}
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          )}
                        </div>
                        <div className={`ml-3 w-0 flex-1 pt-0.5`}>
                          <p
                            className={`text-sm leading-5 font-medium ${
                              errorMsg !== undefined && errorMsg !== ""
                                ? "text-red-500"
                                : "text-gray-900"
                            } ${
                              successMsg !== undefined && successMsg !== ""
                                ? "text-green-500"
                                : "text-gray-900"
                            }`}
                          >
                            {errorMsg !== undefined && errorMsg !== ""
                              ? "Update Failed!"
                              : successMsg !== undefined && successMsg !== ""
                              ? "Update Success!"
                              : "Verifying..."}
                          </p>
                          <p className={`mt-1 text-sm leading-5 text-gray-500`}>
                            {errorMsg !== undefined && errorMsg !== ""
                              ? errorMsg
                              : successMsg}
                          </p>
                        </div>
                        <div className={`ml-4 flex-shrink-0 flex`}>
                          <button
                            className={`inline-flex text-gray-400 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150`}
                            onClick={() =>
                              setTimeout(
                                () =>
                                  setShowNotificationStatus(
                                    !showNotificationStatus
                                  ),
                                150
                              )
                            }
                          >
                            <svg
                              className={`h-5 w-5`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </Transition>
          <ProfileSettingsPasswordDiv className={`mt-5 max-w-3xl bg-white shadow-xs rounded-lg`}>
            <div className={`px-4 py-5 sm:p-6`}>
              <form onSubmit={handlePasswordSubmission}>
                <div>
                  <div>
                    <div>
                      <h3 className={`text-lg leading-6 font-medium text-gray-900`}>
                        Password Change
                      </h3>
                      <p className={`mt-1 text-sm leading-5 text-gray-500`}>
                        User generated content in real-time will have multiple touchpoints for offshoring.
                      </p>
                    </div>
                    <div
                      className={`mt-6 grid grid-cols-1 row-gap-6 col-gap-4 sm:grid-cols-6`}
                    >
                      <div className={`sm:col-span-6`}>
                        <label
                          htmlFor={`password`}
                          className={`block text-sm font-medium leading-5 text-gray-700`}
                        >
                          New Password
                        </label>
                        <div className={`mt-1 flex flex-row flex-wrap rounded-md shadow-xs-sm`}>
                          <input
                            type={`password`}
                            id={`password1`}
                            value={password1}
                            name={`password1`}
                            disabled={disablePasswordFields ? true : false}
                            className={`form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
                              disablePasswordFields &&
                              "opacity-50 bg-gray-300 cursor-not-allowed"
                              }`}
                            onChange={handlePasswordOneInputChange}
                            onBlur={handlePasswordOneInputChange}
                          />
                          <PasswordStrengthBar className={`w-full`} password={password1} />
                        </div>
                      </div>
                    </div>
                    <div
                      className={`mt-6 grid grid-cols-1 row-gap-6 col-gap-4 sm:grid-cols-6`}
                    >
                      <div className={`sm:col-span-6`}>
                        <label
                          htmlFor={`password1`}
                          className={`block text-sm font-medium leading-5 text-gray-700`}
                        >
                          Confirm Password
                        </label>
                        <div className={`mt-1 flex rounded-md shadow-xs-sm`}>
                          <input
                            type={`password`}
                            id={`password2`}
                            value={password2}
                            name={`password2`}
                            disabled={disablePasswordFields ? true : false}
                            className={`form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
                              disablePasswordFields &&
                              "opacity-50 bg-gray-300 cursor-not-allowed"
                              }`}
                            onChange={handlePasswordTwoInputChange}
                            onBlur={handlePasswordTwoInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`mt-8 border-t border-gray-200 pt-5`}>
                  <div className={`flex justify-between`}>
                    <div className={`flex justify-start`}>
                      <span className={`inline-flex rounded-md shadow-xs-sm`}>
                        <button
                          type={`submit`}
                          disabled={!disablePasswordFields ? true : false}
                          className={`inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 transition duration-150 ease-in-out ${
                            !disablePasswordFields ?
                              "opacity-50 bg-indigo-300 cursor-not-allowed" : "hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-xs-outline-indigo active:bg-indigo-700"
                            }`}
                          onClick={handleEditPasswordProfile}
                        >
                          Update Password
                        </button>
                      </span>

                      <span className={`inline-flex rounded-md shadow-xs-sm`}>
                        <button
                          disabled={!disablePasswordFields ? false : true}
                          className={`inline-flex justify-center w-full rounded-md border border-gray-300 sm:ml-3 px-4 py-2 bg-white text-sm leading-5 font-medium text-gray-700 shadow-xs-sm transition ease-in-out duration-150 sm:text-sm sm:leading-5 ${
                            !disablePasswordFields ?
                              "hover:text-gray-500 focus:outline-none" : "opacity-50 cursor-not-allowed"
                            }`}
                          onClick={handleEditPasswordProfile}
                        >
                          Cancel Edit
                        </button>
                      </span>
                    </div>
                    <div className={`flex justify-end`}>
                      <span className={`ml-3 inline-flex rounded-md shadow-xs-sm`}>
                        <button
                          type={`submit`}
                          className={`inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 transition duration-150 ease-in-out ${
                            disableSubmitButton ?
                              "opacity-50 bg-green-300 cursor-not-allowed" : "hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-xs-outline-green active:bg-green-700"
                            }`}
                        >
                          Save Password
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </ProfileSettingsPasswordDiv>
        </>
      )}
    </Fragment>
  )
}

export default ProfileSettingsPassword

ProfileSettingsPassword.propTypes = {
  errorMsg: PropTypes.string,
  successMsg: PropTypes.string,
  disablePasswordFields: PropTypes.bool,
  disabledSubmitButton: PropTypes.bool,
  password1: PropTypes.string,
  password2: PropTypes.string,
}