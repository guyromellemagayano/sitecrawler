import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import fetch from 'node-fetch'
import useSWR from 'swr'
import Cookies from 'js-cookie'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import PrimaryMenu from './PrimaryMenu'
import SiteMenu from './SiteMenu'
import ProfileMenu from './ProfileMenu'
import ProfileSidebar from '../profile/Sidebar'

const fetcher = async (url) => {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-CSRFToken': Cookies.get('csrftoken'),
    },
  })

  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }

  return data
}

const MainSidebarDiv = styled.aside``

const MainSidebar = () => {
  const [windowSiteLocation, setWindowSiteLocation] = useState(false)
  const [windowProfileLocation, setWindowProfileLocation] = useState(false)
  const [siteData, setSiteData] = useState([])

  useEffect(() => {
    if (window.location.href.indexOf("/site/") > -1) {
      setWindowSiteLocation(!windowSiteLocation)
    }

    if (window.location.href.indexOf("/profile") > -1) {
      setWindowProfileLocation(!windowProfileLocation)
    }
  }, [setWindowSiteLocation, setWindowProfileLocation])

  const { data: stats, error } = useSWR(`/api/site/${useRouter().query.id}/scan/`, fetcher)

  if (windowSiteLocation) {
    if (error) return <div>{error.message}</div>
    if (!stats) return <div>Loading...</div>
    
    const useSiteResults = async (e) => {
      return await Promise.all(e.results.map(async (val, key) => {
        try {
          const res = await fetch(`/api/site/${val.site_id}/scan/${val.id}/`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'X-CSRFToken': Cookies.get('csrftoken'),
            },
          })
  
          const data = await res.json()
  
          if (res.status !== 200) {
            throw new Error(data.message)
          }
  
          return setSiteData(data)
        } catch (error) {
          console.error(error)
        }
      }))
    }
  
    useSiteResults(stats)
  }

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
          {windowSiteLocation ? <SiteMenu data={siteData} /> : windowProfileLocation ? <ProfileMenu /> : <PrimaryMenu />}
        </div>
        <ProfileSidebar />
      </div>
    </MainSidebarDiv>
  )
}

export default MainSidebar

MainSidebar.propTypes = {}