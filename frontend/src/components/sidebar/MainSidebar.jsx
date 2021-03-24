// React
import { useState, useEffect } from "react";

// NextJS
import Link from "next/link";
import { useRouter } from "next/router";

// External
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import tw from "twin.macro";

// Components
const AppLogo = loadable(() => import("src/components/logo/AppLogo"));
const PrimaryMenu = loadable(() => import("src/components/sidebar/PrimaryMenu"));
const ProfileSidebar = loadable(() => import("src/components/profile/Sidebar"));
const SettingsMenu = loadable(() => import("src/components/sidebar/SettingsMenu"));
const SiteMenu = loadable(() => import("src/components/sidebar/SiteMenu"));

const MainSidebar = ({ user, site }) => {
	const [selectedMenu, setSelectedMenu] = useState("");

	const siteDashboardLink = "/";

	const router = useRouter();

	useEffect(() => {
		if (user && user !== undefined && Object.keys(user).length > 0) {
			if (Object.keys(user).length > 0) {
				switch (router.pathname) {
					case "/site":
						setSelectedMenu(<SiteMenu />);
						break;
					case "/settings":
						setSelectedMenu(<SettingsMenu />);
						break;
					default:
						setSelectedMenu(<PrimaryMenu user={user} site={site} />);
						break;
				}
			}
		}
	}, [router, user, site]);

	return (
		<aside tw="hidden lg:flex lg:flex-shrink-0 bg-gray-1000">
			<div tw="flex flex-col w-64">
				<div tw="flex flex-col h-0 flex-1 pt-5 pb-4 overflow-y-auto">
					<div tw="flex items-center flex-shrink-0 flex-row px-3 h-16">
						<Link href={siteDashboardLink} passHref>
							<a tw="p-1 block w-full cursor-pointer">
								<AppLogo className={tw`h-8 w-auto`} src="/images/logos/site-logo-white.svg" alt="app-logo" />
							</a>
						</Link>
					</div>
					{selectedMenu}
				</div>

				<ProfileSidebar />
			</div>
		</aside>
	);
};

MainSidebar.propTypes = {};

export default MainSidebar;
