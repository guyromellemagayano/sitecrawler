import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import Moment from 'react-moment'

const SitesCrawlInfoDiv = styled.div``

const SitesCrawlInfo = props => {
  const calendarStrings = {
    lastDay : '[Yesterday], dddd [at]',
    sameDay : '[Today], dddd [at]'
  }

  return (
    <SitesCrawlInfoDiv className={`bg-white shadow sm:rounded-lg`}>
      <div className={`px-4 py-5 sm:p-6`}>
        <div className={`mb-3 max-w-xl text-sm leading-5 text-gray-500`}>
          <div className={`mb-3 flex`}>
            <strong>Crawl Status:</strong>
            {/* <div className={`ml-2 max-w-xl`}>
              <span className={`px-2 py-0.5 mr-3 inline-flex text-xs leading-4 font-medium rounded bg-yellow-100 text-yellow-800`}>
                Link Crawling in Progress
              </span>
            </div> */}
            <div className={`ml-2 max-w-xl`}>
              <span className={`px-2 py-0.5 mr-3 inline-flex text-xs leading-4 font-medium rounded bg-green-100 text-green-800`}>
                Crawled
              </span>
            </div>
            {/* <div className={`ml-2 max-w-xl`}>
              <span className={`px-2 py-0.5 mr-3 inline-flex text-xs leading-4 font-medium rounded bg-red-100 text-red-800`}>
                Not Crawling 
              </span>
            </div> */}
          </div>
        </div>
        <div className={`my-2 max-w-xl text-sm leading-5 text-gray-500`}>
          <p className={`mb-3`}>
            <strong>Updated last:</strong> <Moment local calendar={calendarStrings} date={props.updatedAt} />&nbsp;
            <Moment local date={props.updatedAt} format="hh:mm:ss A" />
          </p>
        </div>
        <div className={`mt-4`}>
          <button
            disabled={`disabled`}
            type={`button`}
            className={`mt-3 mr-3 rounded-md shadow sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 opacity-50 cursor-not-allowed`}
          >
            Run Crawler
          </button>
        </div>
      </div>
    </SitesCrawlInfoDiv>
  );
}

export default SitesCrawlInfo

SitesCrawlInfo.propTypes = {}