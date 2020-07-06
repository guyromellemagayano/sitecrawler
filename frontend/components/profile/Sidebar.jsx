import Link from 'next/link'
import fetch from 'node-fetch'
import Cookies from 'js-cookie'
import styled from 'styled-components'
import useSWR from 'swr'
import Layout from '../Layout'

const apiParameters = {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-CSRFToken': Cookies.get('csrftoken'),
  },
}

const ProfileSidebarDiv = styled.div``

const ProfileSidebar = () => {
  const fetcher = (url) => fetch(url, apiParameters).then(res => res.json())

  const { data, error } = useSWR('/api/auth/user/', fetcher, { refreshInterval: 1000 })

  if (error) return <Layout>Failed to load</Layout>
  if (!data) return <Layout>Loading...</Layout>

  return (
    <ProfileSidebarDiv className={`flex-shrink-0 flex border-t border-gray-200`}>
      <Link href="/dashboard/settings/profile">
        <a className={`p-4 flex-shrink-0 w-full group block hover:text-gray-900 hover:bg-gray-100 transition ease-in-out duration-150`}>
          <div className={`flex items-center`}>
            <div>
              <img
                className={`inline-block h-10 w-10 rounded-full`}
                src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
                alt={``}
              />
            </div>
            <div className={`ml-3`}>
              <p
                className={`text-sm leading-5 font-medium text-gray-700 group-hover:text-gray-900`}
              >
                {data.username}
              </p>
              <p
                className={`text-xs leading-4 font-medium text-gray-500 group-hover:text-gray-700 transition ease-in-out duration-150`}
              >
                View profile
              </p>
            </div>
          </div>
        </a>
      </Link>
    </ProfileSidebarDiv>
  )
}

export default ProfileSidebar