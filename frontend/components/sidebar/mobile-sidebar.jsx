import React, { useState } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import MobilePrimaryMenu from '../sidebar/mobile-primary-menu'

const MobileSidebarDiv = styled.aside``

const MobileSidebar = () => {
	return (
		<MobileSidebarDiv className={`md:hidden`}>
			<div className={`fixed inset-0 flex z-40`}>
				<div className={`fixed inset-0`}>
					<div className={`absolute inset-0 bg-gray-600 opacity-75`}></div>
				</div>
				<div
					className={`relative flex-1 flex flex-col max-w-xs w-full bg-white`}
				>
					<div className={`absolute top-0 right-0 -mr-14 p-1`}>
						<button
							className={`flex items-center justify-center h-12 w-12 rounded-full focus:outline-none focus:bg-gray-600`}
							aria-label={`Close sidebar`}
						>
							<svg
								className={`h-6 w-5 text-white`}
								stroke={`currentColor`}
								fill={`none`}
								viewBox={`0 0 24 24`}
							>
								<path
									strokeLinecap={`round`}
									strokeLinejoin={`round`}
									strokeWidth={`2`}
									d={`M6 18L18 6M6 6l12 12`}
								/>
							</svg>
						</button>
					</div>
					<div className={`flex-1 h-0 pt-5 pb-4 overflow-y-auto`}>
						<div className={`flex-shrink-0 flex items-center px-4`}>
							<img
								className={`h-8 w-auto`}
								src={`/img/logos/workflow-logo-on-white.svg`}
								alt={`Workflow`}
							/>
						</div>
						<MobilePrimaryMenu />
					</div>
					<div className={`flex-shrink-0 flex border-t border-gray-200 p-4`}>
            <Link href="#">
              <a
                className={`flex-shrink-0 group block focus:outline-none`}
              >
                <div className={`flex items-center`}>
                  <div>
                    <img
                      className={`inline-block h-10 w-10 rounded-full`}
                      src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
                      alt={``}
                    />
                  </div>
                  <div className={`ml-3`}>
                    <p
                      className={`text-base leading-6 font-medium text-gray-700 group-hover:text-gray-900`}
                    >
                      Tom Cook
                    </p>
                    <p
                      className={`text-sm leading-5 font-medium text-gray-1000 group-hover:text-gray-700 group-focus:underline transition ease-in-out duration-150`}
                    >
                      View profile
                    </p>
                  </div>
                </div>
              </a>
            </Link>
					</div>
				</div>
				<div className={`flex-shrink-0 w-14`}>
					{/* Force sidebar to shrink to fit close icon */}
				</div>
			</div>
		</MobileSidebarDiv>
	);
}

export default MobileSidebar