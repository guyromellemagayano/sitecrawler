import React, { useState } from 'react'
import styled from 'styled-components'
import MenuDropdown from './menu-dropdown'

const AvatarDiv = styled.div``

const Avatar = () => {
  const [dropdown, setDropdown] = useState(false)

  return (
    <>
      <AvatarDiv>
        {/* Profile dropdown */}
        <div className="ml-3 relative">
          <div>
            <button 
              className="max-w-xs flex items-center text-sm rounded-full text-white focus:outline-none focus:shadow-solid" 
              id="user-menu" 
              aria-label="User menu"
              aria-haspopup="true"
              onClick={e => {
                setDropdown(!dropdown)
              }}
            >
              <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
            </button>
          </div>
          <MenuDropdown
            isDropdownOpen={dropdown}
          />
        </div>
      </AvatarDiv>
    </>
  )
}

export default Avatar