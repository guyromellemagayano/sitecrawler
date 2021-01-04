import { Fragment } from 'react';
import AppLogo from 'components/logo/AppLogo';
import Link from 'next/link';
import PrimaryMenu from 'components/sidebar/PrimaryMenu';
import ProfileSidebar from 'components/profile/Sidebar';
import PropTypes from 'prop-types';
import SettingsMenu from 'components/sidebar/SettingsMenu';
import SiteMenu from 'components/sidebar/SiteMenu';
import styled from 'styled-components';
import useUser from 'hooks/useUser';

const MainSidebarDiv = styled.aside``;

const MainSidebar = (props) => {
	const { user: user } = useUser({
		redirectTo: '/',
		redirectIfFound: false
	});

	return (
		<Fragment>
			{user ? (
				<MainSidebarDiv className={`hidden md:flex md:flex-shrink-0`}>
					<div
						className={`flex flex-col border-r border-gray-300 bg-gray-1000 w-64`}
					>
						<div
							className={`h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto`}
						>
							<div
								className={`flex items-center flex-shrink-0 flex-column px-5`}
							>
								<Link href='/dashboard/sites'>
									<a className={`block w-full`}>
										<AppLogo
											className={`h-8 w-auto`}
											src={`/img/logos/site-logo-white.svg`}
											alt={`app-logo`}
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
			) : null}
		</Fragment>
	);
};

export default MainSidebar;

MainSidebar.proptypes = {
	windowSettingsLocation: PropTypes.bool,
	windowSiteLocation: PropTypes.bool,
	user: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.object,
		PropTypes.array,
		PropTypes.string,
		PropTypes.shape({ current: PropTypes.any })
	]),
	props: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.object,
		PropTypes.array,
		PropTypes.string,
		PropTypes.shape({ current: PropTypes.any })
	])
};
