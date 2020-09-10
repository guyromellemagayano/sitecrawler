import React from 'react'
import styled from 'styled-components'

const SiteFooterDiv = styled.footer``

const SiteFooter = () => {
  return (
    <>
      <SiteFooterDiv
				classNameName={`max-w-screen md:flex-col lg:flex-row p-3 md:flex md:items-center md:justify-between`}
			>
				<div className="flex justify-center md:order-1">
					<nav className="-mx-2 -my-2 flex flex-wrap justify-center">
						<div className="px-3 py-2">
							<a href="#" className="text-sm leading-6 text-gray-500 hover:text-indigo-500 transition duration-150 ease-in-out">
								About
							</a>
						</div>
						<div className="px-3 py-2">
							<a href="#" className="text-sm leading-6 text-gray-500 hover:text-indigo-500 transition duration-150 ease-in-out">
								Privacy Policy
							</a>
						</div>
						<div className="px-3 py-2">
							<a href="#" className="text-sm leading-6 text-gray-500 hover:text-indigo-500 transition duration-150 ease-in-out">
								Terms
							</a>
						</div>
						<div className="px-3 py-2">
							<a href="#" className="text-sm leading-6 text-gray-500 hover:text-indigo-500 transition duration-150 ease-in-out">
								Support
							</a>
						</div>
					</nav>
				</div>
				<div className="md:order-2">
					<p className="text-center text-sm leading-6 text-gray-500 -px-4">
						&copy; 2020 SiteCrawler, Inc. All rights reserved.
					</p>
				</div>
      </SiteFooterDiv>
    </>
  )
}

export default SiteFooter