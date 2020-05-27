import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'

const SitesTimestampDiv = styled.div``

const SitesTimestamp = () => {
  return (
    <SitesTimestampDiv className={`max-w-lg bg-white shadow sm:rounded-lg`}>
      <div className={`px-4 sm:p-6`}>
        <div className={`my-2 max-w-xl text-sm leading-5 text-gray-500`}>
          <h4 className={`mb-5 text-lg leading-6 font-medium text-gray-900`}>
            Timestamp Details
          </h4>
          <p className={`mb-3`}>
            Created on: May 26 2020 23:38:38 <br />
            Last crawled: 26 May 2020 23:42:04
          </p>
          <p className={`mb-3`}>
            Recrawl started: May 26 2020 23:38:38 <br />
            Recrawl completed: 26 May 2020 23:42:04
          </p>
        </div>
      </div>
    </SitesTimestampDiv>
  );
}

export default SitesTimestamp