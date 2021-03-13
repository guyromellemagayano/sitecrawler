// React
import React, { useState, useEffect } from 'react';

// NextJS
import Link from 'next/link';

// External
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import tw from 'twin.macro';

// Components
const AppLogo = loadable(() => import('src/components/logo/AppLogo'));
const PrimaryMenu = loadable(() =>
	import('src/components/sidebar/PrimaryMenu')
);

// FIXME: debug this
const ProfileSidebar = loadable(() => import('src/components/profile/Sidebar'));
const SettingsMenu = loadable(() =>
	import('src/components/sidebar/SettingsMenu')
);
const SiteMenu = loadable(() => import('src/components/sidebar/SiteMenu'));

const MainSidebar = ({ user, userLoaded, site, sitesLoaded }) => {
	const [logoLoaded, setLogoLoaded] = useState(false);

	const siteDashboardLink = '/dashboard/sites';

	useEffect(() => {
		setTimeout(() => {
			setLogoLoaded(true);
		}, 1500);
	}, [user, userLoaded]);

	return (
		<aside tw="hidden md:flex md:flex-shrink-0 bg-gray-1000">
			<div tw="flex flex-col border-r border-gray-300 bg-gray-1000 w-64">
				<div tw="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
					<div tw="flex items-center flex-shrink-0 flex-row px-3">
						<Link href={siteDashboardLink} replace={true}>
							{logoLoaded ? (
								<a tw="p-1 block w-full">
									<AppLogo
										className={tw`h-8 w-auto`}
										src="/img/logos/site-logo-white.svg"
										alt="app-logo"
									/>
								</a>
							) : (
								<div tw="p-1 block">
									<Skeleton duration={2} width={175} height={35} />
								</div>
							)}
						</Link>
					</div>

					{/* FIXME: fix React issue on switching components */}
					{window.location.href.indexOf('/site/') > -1 ? (
						<SiteMenu crawlableHandler={props.crawlableHandler} />
					) : window.location.href.indexOf('/settings/') > -1 ? (
						<SettingsMenu />
					) : (
						<PrimaryMenu
							site={site}
							sitesLoaded={sitesLoaded}
							user={user}
							userLoaded={userLoaded}
						/>
					)}
				</div>

				<ProfileSidebar user={user} userLoaded={userLoaded} />
			</div>
		</aside>
	);
};

MainSidebar.propTypes = {};

export default MainSidebar;
