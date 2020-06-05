import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import Moment from 'react-moment'

const SitesOverviewDiv = styled.div``

const SitesOverview = props => {
  const calendarStrings = {
    lastDay : '[Yesterday], dddd [at]',
    sameDay : '[Today], dddd [at]'
  }

  return (
    <SitesOverviewDiv className={`max-w-6xl bg-white shadow sm:rounded-lg`}>
      <div className={`px-4 py-5 sm:p-6`}>
        <h2 className={`text-lg leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}>
          <a href={`${props.url}`} target={`_blank`} title={`${props.url}`}>
            {props.url}
          </a>
        </h2>
        <div className={`mt-5 mb-3 max-w-xl text-sm leading-5 text-gray-100`}>
          <div className={`mb-2 flex`}>
            <strong>Site Status:</strong>
            {props.verified ? (
              <div className={`ml-2 max-w-xl`}>
                <span className={`px-2 py-0.5 mr-3 inline-flex text-xs leading-4 font-medium rounded bg-green-100 text-green-800`}>Verified</span>
              </div>
            ): (
              <div className={`ml-2 max-w-xl`}>
                <span className={`px-2 py-0.5 mr-3 inline-flex text-xs leading-4 font-medium rounded bg-red-100 text-red-800`}>Unverified</span>
              </div>
            )}
          </div>
        </div>
        <div className={`my-2 max-w-xl text-sm leading-5 text-gray-100`}>
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
        <div className={`my-2 max-w-xl text-sm leading-5 text-gray-100`}>
          <p className={`mb-3`}>
            <strong>Created on:</strong> <Moment local calendar={calendarStrings} date={props.createdAt} />&nbsp;
            <Moment local date={props.createdAt} format="hh:mm:ss A" /><br />
            <strong>Last crawled:</strong> <Moment local calendar={calendarStrings} date={props.updatedAt} />&nbsp;
            <Moment local date={props.updatedAt} format="hh:mm:ss A" />
          </p>
        </div>
        <div className={`mt-5`}>
          <button
            type={`button`}
            className={`mt-3 mr-3 rounded-md shadow sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:shadow-outline-green focus:border-green-700 active:bg-green-700`}
          >
            Run Crawler
          </button>
          <Link href="/sites/settings">
            <a
              type={`button`}
              className={`mt-3 mr-3 rounded-md shadow sm:mt-0 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-100 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-100 transition ease-in-out duration-150`}
            >
              Site Settings
            </a>
          </Link>
        </div>
      </div>
    </SitesOverviewDiv>
  );
}

export default SitesOverview

SitesOverview.propTypes = {}