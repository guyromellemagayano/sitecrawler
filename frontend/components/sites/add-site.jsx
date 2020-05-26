import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'

const AddSiteDiv = styled.div``

const AddSite = () => {
  return (
    <AddSiteDiv className={`py-4`}>
      <div
        className={`bg-white px-4 py-5 border-b border-gray-200 sm:px-6 bg-white overflow-hidden sm:rounded-lg sm:shadow`}
      >
        <div
          className={`-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-no-wrap`}
        >
          <div className={`ml-4 mt-2 w-64`}>
            <div>
              <div className={`mt-1 relative rounded-md shadow-sm`}>
                <div
                  className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none`}
                >
                  <svg
                    className={`h-5 w-5 text-gray-400`}
                    fill={`currentColor`}
                    viewBox={`0 0 20 20`}
                  >
                    <path
                      fillRule={`evenodd`}
                      d={`M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z`}
                      clipRule={`evenodd`}
                    />
                  </svg>
                </div>
                <input
                  id={`email`}
                  className={`form-input block w-full pl-10 sm:text-sm sm:leading-5`}
                  placeholder={`Search sites...`}
                />
              </div>
            </div>
          </div>
          <div className={`ml-4 mt-2 flex-shrink-0`}>
            <span className={`inline-flex rounded-md shadow-sm`}>
              <Link href="/sites/start/">
                <a
                  className={`relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:shadow-outline-green focus:border-green-700 active:bg-green-700`}
                >
                  Add new site
                </a>
              </Link>
            </span>
          </div>
        </div>
      </div>
    </AddSiteDiv>
  );
};

export default AddSite
