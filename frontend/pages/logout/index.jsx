import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Cookies from 'js-cookie'
import PropTypes from 'prop-types'
import Layout from 'components/Layout'

const Logout = () => {
  const router = useRouter()
  const pageTitle = 'Log Out'

  const handleLogoutUser = async () => {
    const response = await fetch('/api/auth/logout/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
      }
    })

    const data = await response.json()

    if (response.ok) {
      if (data) {      
        window.setTimeout(() => {
          router.push('/')
        }, 1000)
      }
    } else {
      const error = new Error(response.statusText)

      error.response = response
      error.data = data

      throw error
    }
  }

  useEffect(() => {
    handleLogoutUser()
  })

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <p className={`text-2xl font-bold leading-7 text-gray-900 sm:text-1xl sm:leading-9 sm:truncate`}>Logging out...</p>
    </Layout>
  )
}

export default Logout

Logout.propTypes = {
  handleLogoutUser: PropTypes.func
}