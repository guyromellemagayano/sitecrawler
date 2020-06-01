import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'

const ProfileSettingsDiv = styled.div``

const ProfileSettings = () => {
  return (
    <ProfileSettingsDiv className={`max-w-lg bg-white shadow sm:rounded-lg`}>
      <div className={`px-4 py-5 sm:p-6`}>
        <h2 className={`text-lg leading-6 font-semibold text-black`}>
          Guy Romelle Magayano
        </h2>
      </div>
    </ProfileSettingsDiv>
  );
}

export default ProfileSettings