import Link from 'next/link'
import styled from 'styled-components'

const DashboardMobileDropdownDiv = styled.div``

const DashboardMobileDropdown = () => {
  return (
    <>
      <DashboardMobileDropdownDiv 
        className="hidden border-b border-gray-700 md:hidden"
      >
        {/*  
          Mobile menu, toggle classes based on menu state.

          Open: "block", closed: "hidden"
        */}
        <div className="px-2 py-3 sm:px-3">
          <Link href="/dashboard">
            <a className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900 focus:outline-none focus:text-white focus:bg-gray-700">Dashboard</a>
          </Link>
          <Link href="/sites">
            <a className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700">Sites</a>
          </Link>
          <Link href="/reports">
            <a className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700">Reports</a>
          </Link>
          <Link href="/help">
            <a className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700">Help</a>
          </Link>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-700">
          <div className="flex items-center px-5">
            <div className="flex-shrink-0">
              <img className="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
            </div>
            <div className="ml-3">
              <div className="text-base font-medium leading-none text-white">Tom Cook</div>
              <div className="mt-1 text-sm font-medium leading-none text-gray-400">tom@example.com</div>
            </div>
          </div>
          <div className="mt-3 px-2" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
            <Link href="/profile">
              <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700" role="menuitem">Your Profile</a>
            </Link>
            <Link href="/settings">
              <a className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700" role="menuitem">Settings</a>
            </Link>
            <Link href="/logout">
              <a className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700" role="menuitem">Sign out</a>              
            </Link>
          </div>
        </div>
      </DashboardMobileDropdownDiv>
    </>
  )
}

export default DashboardMobileDropdown