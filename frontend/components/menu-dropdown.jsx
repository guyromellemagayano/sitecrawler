import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'

const MenuDropdownDiv = styled.div``

const MenuDropdown = (props) => {
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
      <MenuDropdownDiv
        className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg transition ease-out duration-100 ${props.isDropdownOpen ? 'transform opacity-100 scale-100' : 'transform opacity-0 scale-95'}`}
      >
        <div className="py-1 rounded-md bg-white shadow-xs">
          <Link href="/profile">
            <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
          </Link>
          <Link href="/settings">
            <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
          </Link>
          <Link href="/logout">
            <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</a>
          </Link>
        </div>
      </MenuDropdownDiv>
    </>
  )
}

export default MenuDropdown