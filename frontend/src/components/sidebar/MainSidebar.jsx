// React
import React from 'react';

// NextJS
import Link from 'next/link';

// External
import 'core-js';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// Hooks
import useUser from 'src/hooks/useUser';

// Components
import AppLogo from 'src/components/logo/AppLogo';
import PrimaryMenu from 'src/components/sidebar/PrimaryMenu';
import ProfileSidebar from 'src/components/profile/Sidebar';
import SettingsMenu from 'src/components/sidebar/SettingsMenu';
import SiteMenu from 'src/components/sidebar/SiteMenu';

const MainSidebarDiv = styled.aside``;

const MainSidebar = (props) => {
	const siteDashboardLink = '/dashboard/sites';

	const { user: user } = useUser({
		redirectTo: '/',
		redirectIfFound: false
	});

	return user ? (
		<MainSidebarDiv className="hidden md:flex md:flex-shrink-0">
			<div className="flex flex-col border-r border-gray-300 bg-gray-1000 w-64">
				<div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
					<div className="flex items-center flex-shrink-0 flex-column px-5">
						<Link href={siteDashboardLink}>
							<a className="block w-full">
								<AppLogo
									className="h-8 w-auto"
									src="/img/logos/site-logo-white.svg"
									alt="app-logo"
								/>
							</a>
						</Link>
					</div>
					{window.location.href.indexOf('/site/') > -1 ? (
						<SiteMenu crawlableHandler={props.crawlableHandler} />
					) : window.location.href.indexOf('/settings/') > -1 ? (
						<SettingsMenu />
					) : (
						<PrimaryMenu />
					)}
				</div>
				<ProfileSidebar />
			</div>
		</MainSidebarDiv>
	) : null;
};

MainSidebar.propTypes = {};

export default MainSidebar;
