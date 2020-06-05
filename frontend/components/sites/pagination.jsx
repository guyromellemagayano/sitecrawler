import React from 'react'
import styled from 'styled-components'

const PaginationDiv = styled.div``

const Pagination = () => {
  return (
    <PaginationDiv className={`bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 align-middle shadow sm:rounded-lg`}>
      <div className={`flex-1 flex justify-between sm:hidden`}>
        <a
          href="#"
          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-100 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150`}
        >
          Previous
        </a>
        <a
          href="#"
          className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-100 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150`}
        >
          Next
        </a>
      </div>
      <div className={`hidden sm:flex-1 sm:flex sm:items-center sm:justify-between`}>
        <div>
          <p className={`text-sm leading-5 text-gray-700`}>
            Showing
            <span className={`font-medium`}>&nbsp;1&nbsp;</span>
            to
            <span className={`font-medium`}>&nbsp;10&nbsp;</span>
            of
            <span className={`font-medium`}>&nbsp;97&nbsp;</span>
            results
          </p>
        </div>
        <div>
          <nav className={`relative z-0 inline-flex shadow-sm`}>
            <button
              type={`button`}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-100 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-100 transition ease-in-out duration-150`}
              aria-label={`Previous`}
            >
              <svg className={`h-5 w-5`} fill={`currentColor`} viewBox={`0 0 20 20`}>
                <path
                  fillRule={`evenodd`}
                  d={`M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z`}
                  clipRule={`evenodd`}
                />
              </svg>
            </button>
            <button
              type={`button`}
              className={`-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-100 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150`}
            >
              1
            </button>
            <button
              type={`button`}
              className={`-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-100 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150`}
            >
              2
            </button>
            <button
              type={`button`}
              className={`hidden md:inline-flex -ml-px relative items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-100 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150`}
            >
              3
            </button>
            <button
              type={`button`}
              className={`-ml-px relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-100 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-100 transition ease-in-out duration-150`}
              aria-label={`Next`}
            >
              <svg className={`h-5 w-5`} fill={`currentColor`} viewBox={`0 0 20 20`}>
                <path
                  fillRule={`evenodd`}
                  d={`M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z`}
                  clipRule={`evenodd`}
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </PaginationDiv>
  );
}

export default Pagination