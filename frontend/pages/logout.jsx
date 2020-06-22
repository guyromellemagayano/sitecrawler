import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import PropTypes from 'prop-types'
import Layout from '../components/Layout'

const Logout = () => {
  const router = useRouter()

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
          router.push('/login')
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
      Logging out...
    </Layout>
  )
}

export default Logout

Logout.propTypes = {}