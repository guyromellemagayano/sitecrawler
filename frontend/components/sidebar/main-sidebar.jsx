import { useState, useEffect } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import PrimaryMenu from './primary-menu'
import SiteMenu from './site-menu'
import ProfileMenu from './profile-menu'
import ProfileSidebar from '../profile/sidebar'

const MainSidebarDiv = styled.aside``

const MainSidebar = () => {
  const [windowSiteLocation, setWindowSiteLocation] = useState(false)
  const [windowProfileLocation, setWindowProfileLocation] = useState(false)

  useEffect(() => {
    if (window.location.href.indexOf("/site/") > -1) {
      setWindowSiteLocation(!windowSiteLocation)
    } 

    if (window.location.href.indexOf("/profile") > -1) {
      setWindowProfileLocation(!windowProfileLocation)
    }
  }, [setWindowSiteLocation, setWindowProfileLocation])
  
  return (
    <MainSidebarDiv className={`hidden md:flex md:flex-shrink-0`}>
      <div className={`flex flex-col w-64 border-r border-gray-200 bg-white`}>
        <div className={`h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto`}>
          <div className={`flex items-center flex-shrink-0 px-4`}>
            <img
              className={`h-8 w-auto`}
              src={`/img/logos/workflow-logo-on-white.svg`}
              alt={`Workflow`}
            />
          </div>
          {windowSiteLocation ? <SiteMenu /> : windowProfileLocation ? <ProfileMenu /> : <PrimaryMenu />}
        </div>
        <ProfileSidebar />
      </div>
    </MainSidebarDiv>
  )
}

export default MainSidebar

MainSidebar.propTypes = {}