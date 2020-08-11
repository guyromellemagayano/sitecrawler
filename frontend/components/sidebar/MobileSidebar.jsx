import { Fragment, useState, useEffect } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import useUser from 'hooks/useUser'
import Transition from 'hooks/Transition'
import MobilePrimaryMenu from 'components/sidebar/MobilePrimaryMenu'
import MobileSiteMenu from 'components/sidebar/MobileSiteMenu'
import MobileSettingsMenu from 'components/sidebar/MobileSettingsMenu'
import ProfileSidebar from 'components/profile/Sidebar'
import AppLogo from 'components/logo/AppLogo'

const MobileSidebarDiv = styled.aside``

const MobileSidebar = props => {
	const [updateProps, setUpdateProps] = useState(props.show)
	const [windowSiteLocation, setWindowSiteLocation] = useState(false)
	const [windowSettingsLocation, setWindowSettingsLocation] = useState(false)
	
	const handleUpdateProps = () => {
		setUpdateProps(props.show)
	}

	const { user: user } = useUser({
    redirectTo: '/login',
    redirectIfFound: false
  })

  useEffect(() => {
    if (window.location.href.indexOf("/site/") > -1) {
      setWindowSiteLocation(!windowSiteLocation)
    }

    if (window.location.href.indexOf("/settings/") > -1) {
      setWindowSettingsLocation(!windowSettingsLocation)
    }
  }, [])

	return (
		<Fragment>
      {user ? (
				<MobileSidebarDiv className={`md:hidden`}>
					<Transition show={props.show ? !updateProps : updateProps}>
						<Transition
							enter="transition-opacity ease-linear duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="transition-opacity ease-linear duration-300"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<div className={`fixed inset-0 flex z-40`}>
								<div className={`fixed inset-0`}>
									<div className={`absolute inset-0 bg-gray-600 opacity-75`}></div>
								</div>
								<Transition
									enter="transition ease-in-out duration-300 transform"
									enterFrom="-translate-x-full"
									enterTo="translate-x-0"
									leave="transition ease-in-out duration-300 transform"
									leaveFrom="translate-x-0"
									leaveTo="-translate-x-full"
								>
									<div
										className={`relative flex-1 flex flex-col max-w-xs w-full bg-gray-1000`}
									>
										<div className={`absolute top-0 right-0 mt-4 mr-4 p-1`}>
											<button
												className={`btn-close-sidebar flex items-center justify-center h-8 w-8 rounded-full focus:outline-none focus:bg-gray-600`}
												aria-label={`Close sidebar`}
												onClick={handleUpdateProps}
											>
												<svg
													className={`h-6 w-5 text-gray-400`}
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
												<AppLogo
													className={`h-8 w-auto`}
													src={`/img/logos/site-logo-white.svg`}
													alt={`app-logo`}
												/>
											</div>
											{windowSiteLocation ? <MobileSiteMenu /> : windowSettingsLocation ? <MobileSettingsMenu /> : <MobilePrimaryMenu />}
										</div>
										<ProfileSidebar />
									</div>
								</Transition>
								<div className={`flex-shrink-0 w-14`}>
									{/* Force sidebar to shrink to fit close icon */}
								</div>
							</div>
						</Transition>
					</Transition>
				</MobileSidebarDiv>
			) : null}
		</Fragment>
	)
}

export default MobileSidebar

MobileSidebar.propTypes = {
	updateProps: PropTypes.bool,
	windowSiteLocation: PropTypes.bool,
	windowSettingsLocation: PropTypes.bool,
	handleUpdateProps: PropTypes.func,
}