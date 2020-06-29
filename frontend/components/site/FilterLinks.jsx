import { useState } from 'react'
import styled from 'styled-components'
import Transition from '../../hooks/Transition'

const FilterLinksDiv = styled.div``

const FilterLinks = () => {
  const [showDropdown, setShowDropdown] = useState(false)

  const setDropdownToggle = (e) => {
    setShowDropdown(!showDropdown)
  }

  return (
    <FilterLinksDiv className={`py-4`}>
      <div
        className={`bg-white px-4 py-5 border-b border-gray-200 sm:px-6 bg-white sm:rounded-lg sm:shadow`}
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
          <div className={`ml-4 mt-2 flex items-center flex-shrink-0`}>
            <span className={`inline-flex rounded-md shadow-sm`}>
              <div className={`relative inline-block text-left`}>
                <div>
                  <span className={`rounded-md shadow-sm`}>
                    <button
                      type="button"
                      className={`inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150`}
                      id="options-menu"
                      aria-haspopup="true"
                      aria-expanded={`${showDropdown ? "true" : "false"}`}
                      onClick={setDropdownToggle}
                    >
                      Export
                      <svg
                        className={`-mr-1 ml-2 h-5 w-5`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </span>
                </div>

                <Transition show={showDropdown}>
                  {/*
                    Dropdown panel, show/hide based on dropdown state.

                    Entering: "transition ease-out duration-100"
                      From: "transform opacity-0 scale-95"
                      To: "transform opacity-100 scale-100"
                    Leaving: "transition ease-in duration-75"
                      From: "transform opacity-100 scale-100"
                      To: "transform opacity-0 scale-95"
                  */}
                  <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <div
                      className={`origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg`}
                    >
                      <div className={`rounded-md bg-white shadow-xs`}>
                        <div
                          className={`py-1`}
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="options-menu"
                        >
                          <button
                            className={`block w-full text-left px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem`}
                          >
                            CSV
                          </button>
                          <button
                            className={`block w-full text-left px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900`}
                            role="menuitem"
                          >
                            PDF
                          </button>
                        </div>
                      </div>
                    </div>
                  </Transition>
                </Transition>
              </div>
            </span>
          </div>
        </div>
      </div>
    </FilterLinksDiv>
  )
}

export default FilterLinks
