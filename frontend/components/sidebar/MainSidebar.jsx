import { useState, useEffect, Fragment } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import useUser from 'hooks/useUser'
import PrimaryMenu from 'components/sidebar/PrimaryMenu'
import SiteMenu from 'components/sidebar/SiteMenu'
import SettingsMenu from 'components/sidebar/SettingsMenu'
import ProfileSidebar from 'components/profile/Sidebar'
import AppLogo from 'components/logo/AppLogo'

const MainSidebarDiv = styled.aside``

const MainSidebar = () => {
  const [windowSiteLocation, setWindowSiteLocation] = useState(false)
  const [windowSettingsLocation, setWindowSettingsLocation] = useState(false)

  const { user: user } = useUser({
    redirectTo: '/login',
    redirectIfFound: false
  })

  useEffect(() => {
    if (window.location.href.indexOf("/site/") > -1) {
      setWindowSiteLocation(!windowSiteLocation)
    }

    if (window.location.href.indexOf("/settings/") > -1) {
      setWindowSettingsLocation(!windowSettingsLocation)
    }
  }, [])

  return (
    <Fragment>
      {user ? (
        <MainSidebarDiv className={`hidden md:flex md:flex-shrink-0`}>
          <div className={`flex flex-col border-r border-gray-200 bg-gray-1000 w-64`}>
            <div className={`h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto`}>
              <div className={`flex items-center flex-shrink-0 flex-column px-5`}>
                <Link href="/dashboard/sites/">
                  <a className={`block w-full`}>
                    <AppLogo
                      className={`h-8 w-auto`}
                      src={`/img/logos/site-logo-white.svg`}
                      alt={`app-logo`}
                    />
                  </a>
                </Link>
              </div>
              {windowSiteLocation ? <SiteMenu /> : (windowSettingsLocation ? <SettingsMenu /> : <PrimaryMenu />)}
            </div>
            <ProfileSidebar />
          </div>
        </MainSidebarDiv>
      ) : null}
    </Fragment>
  )
}

export default MainSidebar

MainSidebar.proptypes = {
	windowSiteLocation: PropTypes.bool,
	windowSettingsLocation: PropTypes.bool,
}