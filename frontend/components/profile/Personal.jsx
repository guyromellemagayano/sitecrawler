import { useState, useEffect } from 'react'
import fetch from 'node-fetch'
import Cookies from 'js-cookie'
import styled from 'styled-components'
import useSWR from 'swr'
import PropTypes from 'prop-types'
import fetchJson from '../../hooks/fetchJson'

const ProfileSettingsPersonalDiv = styled.div``

const ProfileSettingsPersonal = () => {
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [disableInputFields, setDisableInputFields] = useState(0)
  const [username, setUsername] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')

  const { data: profile } = useSWR(`/api/auth/user/`, () => fetchProfileSettings(`/api/auth/user/`), { refreshInterval: 1000 })

  useEffect(() => {
    if (profile !== '' && profile !== undefined) {
      setUsername(profile.username)
      setFirstname(profile.first_name)
      setLastname(profile.last_name)
      setEmail(profile.email)
		}
  }, [profile])

  const fetchProfileSettings = async (endpoint) => {
    const siteProfileData = await fetchJson(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
      }
    })
    
    return siteProfileData
  }

  const updateProfileSettings = async (endpoint, formData) => {
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
      body: JSON.stringify(formData),
    })

    const data = await response.json()
  
    if (response.ok && response.status === 200) {
      if (data) {
        setSuccessMsg('Profile information update success.')
        setDisableInputFields(!disableInputFields)
      }
    } else {
      const error = new Error(response.statusText)
  
      error.response = response
      error.data = data
  
      setErrorMsg('An unexpected error occurred. Please try again.')
  
      throw error
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()

    const body = {
      username: e.currentTarget.user_name.value,
      first_name: e.currentTarget.first_name.value,
      last_name: e.currentTarget.last_name.value,
    }

    await updateProfileSettings(`/api/auth/user/`, body)
  }

  const handleEditProfile = (e) => {
    e.preventDefault()

    setDisableInputFields(!disableInputFields)
  }

  const handleUserNameInputChange = (e) => {
    setUsername(e.target.value)
  }

  const handleFirstNameInputChange = (e) => {
    setFirstname(e.target.value)
  }

  const handleLastNameInputChange = (e) => {
    setLastname(e.target.value)
  }

  return (
    <ProfileSettingsPersonalDiv className={`mt-5 max-w-6xl bg-white shadow-xs sm:rounded-lg`}>
      <div className={`px-4 py-5 sm:p-6`}>
        <form onSubmit={handleProfileUpdate}>
          <div>
            <div>
              <div>
                <h3 className={`text-lg leading-6 font-medium text-gray-900`}>
                  Personal Information
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
                    htmlFor={`username`}
                    className={`block text-sm font-medium leading-5 text-gray-700`}
                  >
                    Username
                  </label>
                  <div className={`mt-1 flex rounded-md shadow-xs-sm`}>
                    <input
                      type={`text`}
                      id={`username`}
                      value={username}
                      name={`user_name`}
                      disabled={disableInputFields == 0 ? true : false}
                      className={`form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
                        disableInputFields == 0 &&
                        "opacity-50 bg-gray-300 cursor-not-allowed"
                        }`}
                      onChange={handleUserNameInputChange}
                    />
                  </div>
                </div>

                <div className={`sm:col-span-6`}>
                  <label
                    htmlFor={`photo`}
                    className={`block text-sm leading-5 font-medium text-gray-700`}
                  >
                    Photo
                  </label>
                  <div className={`mt-2 flex items-center`}>
                    <span
                      className={`h-12 w-12 rounded-full overflow-hidden bg-gray-100`}
                    >
                      <svg
                        className={`h-full w-full text-gray-300`}
                        fill={`currentColor`}
                        viewBox={`0 0 24 24`}
                      >
                        <path
                          d={`M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z`}
                        />
                      </svg>
                    </span>
                    <span className={`ml-5 rounded-md shadow-xs-sm`}>
                      <button
                        disabled={`disabled`}
                        type={`button`}
                        className={`py-2 px-3 border border-gray-300 rounded-md text-sm leading-4 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-xs-outline-blue active:bg-gray-100 active:text-gray-800 transition duration-150 ease-in-out bg-gray-300 opacity-50 cursor-not-allowed`}
                      >
                        Change
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className={`mt-8 border-t border-gray-200 pt-8`}>
              <div
                className={`grid grid-cols-1 row-gap-6 col-gap-4 sm:grid-cols-6`}
              >
                <div className={`sm:col-span-3`}>
                  <label
                    htmlFor={`first_name`}
                    className={`block text-sm font-medium leading-5 text-gray-700`}
                  >
                    First name
                  </label>
                  <div className={`mt-1 rounded-md shadow-xs-sm`}>
                    <input
                      type={`text`}
                      id={`first_name`}
                      value={firstname}
                      name={`first_name`}
                      disabled={disableInputFields == 0 ? true : false}
                      className={`form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
                        disableInputFields == 0 &&
                        "opacity-50 bg-gray-300 cursor-not-allowed"
                        }`}
                      onChange={handleFirstNameInputChange}
                    />
                  </div>
                </div>

                <div className={`sm:col-span-3`}>
                  <label
                    htmlFor={`last_name`}
                    className={`block text-sm font-medium leading-5 text-gray-700`}
                  >
                    Last name
                  </label>
                  <div className={`mt-1 rounded-md shadow-xs-sm`}>
                    <input
                      type={`text`}
                      id={`last_name`}
                      value={lastname}
                      name={`last_name`}
                      disabled={disableInputFields == 0 ? true : false}
                      className={`form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
                        disableInputFields == 0 &&
                        "opacity-50 bg-gray-300 cursor-not-allowed"
                        }`}
                      onChange={handleLastNameInputChange}
                    />
                  </div>
                </div>

                <div className={`sm:col-span-6`}>
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
                      value={email}
                      disabled={`disabled`}
                      className={`form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 opacity-50 bg-gray-300 cursor-not-allowed`}
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
                    disabled={disableInputFields == 1 ? true : false}
                    className={`inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 transition duration-150 ease-in-out ${
                      disableInputFields == 1 ?
                        "opacity-50 bg-indigo-300 cursor-not-allowed" : "hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-xs-outline-indigo active:bg-indigo-700"
                      }`}
                    onClick={handleEditProfile}
                  >
                    Edit Profile
                  </button>
                </span>

                {errorMsg && (
                  <div className={`inline-block ml-2 p-2`}>
                    <div className={`flex`}>
                      <div>
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
                  <div className={`inline-block ml-2 p-2`}>
                    <div className={`flex`}>
                      <div>
                        <h3
                          className={`text-sm leading-5 font-medium text-green-800 break-words`}
                        >
                          {successMsg}
                        </h3>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className={`flex justify-end`}>
                <span className={`ml-3 inline-flex rounded-md shadow-xs-sm`}>
                  <button
                    type={`submit`}
                    className={`inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 transition duration-150 ease-in-out ${
                      disableInputFields == 0 ?
                        "opacity-50 bg-green-300 cursor-not-allowed" : "hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-xs-outline-green active:bg-green-700"
                      }`}
                  >
                    Save Profile Settings
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