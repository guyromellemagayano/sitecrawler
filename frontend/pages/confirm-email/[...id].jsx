import { useState, useEffect } from 'react'
import fetch from 'node-fetch'
import Cookies from 'js-cookie'
import Head from 'next/head'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Layout from '../../components/layout'

const ConfirmEmailDiv = styled.div``

const ConfirmEmail = () => {
	const [success, setSuccess] = useState('false')
  const [errorMsg, setErrorMsg] = useState('')
	const [successMsg, setSuccessMsg] = useState('')
	
	const handlePageRefresh = (e) => {
		e.preventDefault()

		location.reload()
	}

	useEffect(() => {
		let pathArray = window.location.pathname.split('/')
		let secondLevelLocation = pathArray[2]

		if (errorMsg) setErrorMsg('')
    if (successMsg) setSuccessMsg('')

		try {
			async function sendPostRequest() {
				const response = await fetch('/api/auth/registration/verify-email/' + secondLevelLocation + '/', {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'X-CSRFToken': Cookies.get('csrftoken'),
					},
				})
	
				const data = await response.json()

				console.log(data)
				
				if (response.ok && response.status === 200) {
					if (data) {
						setSuccess(!success)
						setSuccessMsg("Congratulations, your profile is now ready to use. Click on the link below to login to your own account.")
					}
				} else {
					const error = new Error(response.statusText)
		
					error.response = response
					error.data = data
		
					throw error
				}
			}

			sendPostRequest();
		} catch(error) {
			if (!error.data) {
        error.data = { message: error.message }
			}
			
      setErrorMsg('An unexpected error occurred. Please try again.')

      throw error
		}
	}, [])

  return (
    <Layout>
      <Head>
        <title>Confirm Email</title>
      </Head>

      <ConfirmEmailDiv
        className={`min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8`}
      >
        <div className={`sm:mx-auto sm:w-full sm:max-w-md`}>
          <div className={`bg-white shadow sm:rounded-lg`}>
            <div className={`px-4 py-5 sm:p-6`}>
              <h3 className={`text-lg leading-6 font-medium text-gray-900`}>
                Email Confirmation {success ? "Success" : "Failed"}
              </h3>
              <div className={`mt-2 max-w-xl text-sm leading-5 text-gray-500`}>
                {successMsg ? <p>{successMsg}</p> : <p>{errorMsg}</p>}
              </div>
              {successMsg ? (
                <div className={`mt-5`}>
                  <Link href="/login">
                    <a
                      type="button"
                      className={`relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:shadow-outline-green focus:border-green-700 active:bg-green-700`}
                    >
                      Go Back to Login
                    </a>
                  </Link>
                </div>
              ) : (
                <div className={`mt-5`}>
                  <button
                    type="button"
										className={`relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:shadow-outline-red focus:border-red-700 active:bg-red-700`}
										onClick={handlePageRefresh}
                  >
                    Reload Link
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </ConfirmEmailDiv>
    </Layout>
  );
}

export default ConfirmEmail

ConfirmEmail.propTypes = {}