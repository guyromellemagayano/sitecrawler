import { useRef, useCallback, useState } from 'react'
import fetch from 'node-fetch'
import Cookies from 'js-cookie'
import styled from 'styled-components'
import Layout from '../../components/layout'
import useSWR from 'swr'
import PropTypes from 'prop-types'

const apiParameters = {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-CSRFToken': Cookies.get('csrftoken'),
  },
}

const ProfileSettingsPersonalDiv = styled.div``

const ProfileSettingsPersonal = () => {
  const [errorPasswordMsg, setErrorPasswordMsg] = useState('')
  const [successPasswordMsg, setSuccessPasswordMsg] = useState('')
  const [disablePasswordFields, setDisablePasswordFields] = useState(0)

  const fetcher = (url) => fetch(url, apiParameters).then(res => res.json())

  const { data: password, error: err2 } = useSWR('/api/auth/password/change/', fetcher, { refreshInterval: 1000 })

  if (err2) return <Layout>Failed to load</Layout>
  if (!password) return <Layout>Loading...</Layout>

  const [password1, setPassword1] = useState(password.new_password1)
  const [password2, setPassword2] = useState(password.new_password2)

  const passwordUpdateForm = useRef()

  const handlePasswordSubmission = useCallback(async (e) => {
    e.preventDefault()

    if (errorPasswordMsg) setErrorPasswordMsg('')
    if (successPasswordMsg) setSuccessPasswordMsg('')

    const body = {
      new_password1: e.currentTarget.new_password1.value,
      new_password2: e.currentTarget.new_password2.value,
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
          setSuccessMsg('Password information update success.')
          setDisablePasswordFields(!disablePasswordFields)
        }
      } else {
        const error = new Error(response.statusText)
  
        error.response = response
        error.data = data
  
        throw error
      }
    } catch(error) {
      if (!error.data) {
        error.data = { message: error.message }
      }

      setErrorMsg('An unexpected error occurred. Please try again.')

      throw error
    }
  })

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

  return (
    <ProfileSettingsPersonalDiv className={`mt-5 max-w-6xl bg-white shadow sm:rounded-lg`}>
      <div className={`px-4 py-5 sm:p-6`}>
        <form ref={passwordUpdateForm} onSubmit={handlePasswordSubmission}>
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
                  <div className={`mt-1 flex rounded-md shadow-sm`}>
                    <input
                      type={`password`}
                      id={`password1`}
                      value={password1}
                      name={`password1`}
                      disabled={disablePasswordFields == 0 ? true : false}
                      className={`form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
                        disablePasswordFields == 0 &&
                        "opacity-50 bg-gray-300 cursor-not-allowed"
                        }`}
                      onChange={handlePasswordOneInputChange}
                    />
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
                  <div className={`mt-1 flex rounded-md shadow-sm`}>
                    <input
                      type={`password`}
                      id={`password22`}
                      value={password2}
                      name={`password2`}
                      disabled={disablePasswordFields == 0 ? true : false}
                      className={`form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
                        disablePasswordFields == 0 &&
                        "opacity-50 bg-gray-300 cursor-not-allowed"
                        }`}
                      onChange={handlePasswordTwoInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`mt-8 border-t border-gray-200 pt-5`}>
            <div className={`flex justify-between`}>
              <div className={`flex justify-start`}>
                <span className={`inline-flex rounded-md shadow-sm`}>
                  <button
                    type={`submit`}
                    disabled={disablePasswordFields == 1 ? true : false}
                    className={`inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 transition duration-150 ease-in-out ${
                      disablePasswordFields == 1 ?
                        "opacity-50 bg-indigo-300 cursor-not-allowed" : "hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700"
                      }`}
                    onClick={handleEditPasswordProfile}
                  >
                    Edit Password
                  </button>
                </span>

                {errorPasswordMsg && (
                  <div className={`inline-block ml-2 p-2`}>
                    <div className={`flex`}>
                      <div>
                        <h3
                          className={`text-sm leading-5 font-medium text-red-800 break-words`}
                        >
                          {errorPasswordMsg}
                        </h3>
                      </div>
                    </div>
                  </div>
                )}

                {successPasswordMsg && (
                  <div className={`inline-block ml-2 p-2`}>
                    <div className={`flex`}>
                      <div>
                        <h3
                          className={`text-sm leading-5 font-medium text-green-800 break-words`}
                        >
                          {successPasswordMsg}
                        </h3>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className={`flex justify-end`}>
                <span className={`ml-3 inline-flex rounded-md shadow-sm`}>
                  <button
                    type={`submit`}
                    className={`inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 transition duration-150 ease-in-out ${
                      disableInputFields == 0 ?
                        "opacity-50 bg-green-300 cursor-not-allowed" : "hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-700"
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
    </ProfileSettingsPersonalDiv>
  )
}

export default ProfileSettingsPersonal


ProfileSettingsPersonal.propTypes = {}