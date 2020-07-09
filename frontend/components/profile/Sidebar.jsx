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

  const { data, error } = useSWR('/api/auth/user/', fetcher)

  if (error) return <Layout>Failed to load</Layout>
  if (!data) return <Layout>Loading...</Layout>

  return (
    <ProfileSidebarDiv className={`flex-shrink-0 flex flex-col border-gray-200`}>
      <span
        className={`flex justify-between items-center mt-1 group px-3 py-2 text-sm leading-5 font-medium text-green-800`}
      >
        Basic Plan
        <Link href="#">
          <a className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium leading-4 bg-green-200 text-green-800`}>
            <small>Upgrade</small>
          </a>
        </Link>
      </span>
      <Link href="/dashboard/settings/profile">
        <a className={`border-t p-4 flex-shrink-0 w-full group block hover:text-gray-900 hover:bg-gray-100 transition ease-in-out duration-150`}>
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
      <Link href="/logout">
        <a
          className={`border-t mt-1 group text-center px-2 py-2 text-sm leading-5 font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150`}
        >
          Sign Out
        </a>
      </Link>
    </ProfileSidebarDiv>
  )
}

export default ProfileSidebar
