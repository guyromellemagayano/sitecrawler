import { useState } from 'react'
import Head from 'next/head'
import styled from 'styled-components'
import DashboardAvatar from '../src/components/dashboard/avatar'
import DashboardMenu from '../src/components/dashboard/menu'
import DashboardMobileDropdown from '../src/components/dashboard/mobile-dropdown'
import DashboardNotifications from '../src/components/dashboard/notifications'

const SitesDiv = styled.section``

const Sites = () => {
  const [mobileMenu, setMobileMenu] = useState(false)

  return (
    <>
      <Head>
        <title>Sites</title>
      </Head>

      <SitesDiv>
      </SitesDiv>
    </>
  )
}

export default Sites
