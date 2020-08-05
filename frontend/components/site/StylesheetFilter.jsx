import { useState } from 'react'
import styled from 'styled-components'

const StylesheetFilterDiv = styled.div``

const StylesheetFilter = ({ onFilterChange, allFilter, issueFilter, internalFilter, externalFilter }) => {
    const filterHandler = (e) => {
        onFilterChange(e)
    }

    return (
        <StylesheetFilterDiv className={`pb-4`}>
            <div
                className={`bg-white px-4 py-5 border-b border-gray-200 sm:px-6 bg-white rounded-lg sm:shadow-xs`}
            >
                <div
                    className={`-ml-4 -mt-2 flex items-center flex-start flex-wrap sm:flex-no-wrap`}
                >
                    <h4 className={`ml-3 mt-1 mr-1 text-md leading-4 font-semibold text-gray-600`}>Filter</h4>
                    <div className={`ml-4 mt-2 mr-2`}>
                        <div>
                            <label className={`flex items-center`}>
                                <input type="checkbox" className={`form-checkbox`} onChange={filterHandler} checked={allFilter} value="all" />
                                <span className={`ml-2 text-left text-xs leading-4 font-normal text-gray-500`}>All Stylesheets</span>
                            </label>
                        </div>
                    </div>
                    <div className={`ml-4 mt-2 mr-2`}>
                        <div>
                            <label className={`flex items-center`}>
                                <input type="checkbox" className={`form-checkbox`} onChange={filterHandler} checked={issueFilter} value="issues" />
                                <span className={`ml-2 text-left text-xs leading-4 font-normal text-gray-500`}>Stylesheets with Issues</span>
                            </label>
                        </div>
                    </div>
                    <div className={`ml-4 mt-2 mr-2`}>
                        <div>
                            <label className={`flex items-center`}>
                                <input type="checkbox" className={`form-checkbox`} onChange={filterHandler} checked={internalFilter} value="internal" />
                                <span className={`ml-2 text-left text-xs leading-4 font-normal text-gray-500`}>Internal Stylesheets</span>
                            </label>
                        </div>
                    </div>
                    <div className={`ml-4 mt-2 mr-2`}>
                        <div>
                            <label className={`flex items-center`}>
                                <input type="checkbox" className={`form-checkbox`} onChange={filterHandler} checked={externalFilter} value="external" />
                                <span className={`ml-2 text-left text-xs leading-4 font-normal text-gray-500`}>External Stylesheets</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </StylesheetFilterDiv>
    )
}

export default StylesheetFilter