import Link from 'next/link'
import styled from 'styled-components'

const DashboardDropdownDiv = styled.div``

const DashboardDropdown = (props) => {
  return (
    <>
      {/*  
        Profile dropdown panel, show/hide based on dropdown state.

        Entering: "transition ease-out duration-100"
          From: "transform opacity-0 scale-95"
          To: "transform opacity-100 scale-100"
        Leaving: "transition ease-in duration-75"
          From: "transform opacity-100 scale-100"
          To: "transform opacity-0 scale-95"
      */}
      <DashboardDropdownDiv
        className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg ${props.isDropdownOpen ? 'transition ease-in duration-75 transition ease-out duration-100 transform opacity-100 scale-100' : 'transition ease-out duration-100 transform opacity-0 scale-95'}`}
      >
        <div className="py-1 rounded-md bg-white shadow-xs">
          <Link href="/profile">
            <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
          </Link>
          <Link href="/settings">
            <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
          </Link>
          <a href="/api/auth/logout/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</a>
        </div>
      </DashboardDropdownDiv>
    </>
  )
}

export default DashboardDropdown