import Link from 'next/link'
import styled from 'styled-components'

const DashboardMenuDiv = styled.div``

const DashboardMenu = () => {
  return (
    <>
      <DashboardMenuDiv
        className={`hidden md:block`}
      >
        <div className={`ml-10 flex items-baseline`}>
          <Link href="/dashboard">
            <a className={`px-3 py-2 rounded-md text-sm font-medium text-white bg-gray-900 focus:outline-none focus:text-white focus:bg-gray-700`}>Dashboard</a>
          </Link>
          <Link href="/sites">
            <a className={`ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700`}>Sites</a>
          </Link>
          <Link href="/audit-logs">
          <a className={`ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700`}>Audit Logs</a>
          </Link>
          <Link href="/support">
            <a className={`ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700`}>Support</a>
          </Link>
        </div>
      </DashboardMenuDiv>
    </>
  )
}

export default DashboardMenu