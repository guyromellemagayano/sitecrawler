import { Agency, Basic, Pro } from "@constants/GlobalValues";
import { SubscriptionPlansSettingsLink } from "@constants/PageLinks";
import { SidebarMenus } from "@constants/SidebarMenus";
import { Transition } from "@headlessui/react";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import PropTypes from "prop-types";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `ProfileMenuDropdown` component
 *
 * @param {boolean} isComponentVisibile
 */
const ProfileMenuDropdown = ({ isComponentVisible = false }) => {
	// Translations
	const { t } = useTranslation();
	const upgrade = t("common:upgrade");
	const plan = t("common:plan");

	// Sidebar menus
	const { ProfileSidebarMenus } = SidebarMenus();

	// Custom context
	const { isComponentReady, user } = useContext(SiteCrawlerAppContext);

	return (
		<Transition
			show={isComponentVisible}
			enter="transition ease-out duration-100"
			enterFrom="transform opacity-0 scale-95"
			enterTo="transform opacity-100 scale-100"
			leave="transition ease-in duration-75"
			leaveFrom="transform opacity-100 scale-100"
			leaveTo="transform opacity-0 scale-95"
		>
			<div className="absolute right-0 left-0 bottom-0 z-50 mx-3 mt-1 mb-20 origin-top rounded-md shadow-lg">
				<div className="rounded-md bg-white" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
					<div className="py-1">
						<span className="group my-1 flex items-center justify-between px-4 py-2">
							{isComponentReady && user?.data?.group?.name ? (
								<span
									className={classnames(
										"text-sm font-medium leading-5",
										user.data.group.name === Basic
											? "text-green-800"
											: user.data.group.name === Pro
											? "text-blue-800"
											: user.data.group.name === Agency
											? "text-red-800"
											: "text-gray-800"
									)}
								>
									{user.data.group.name ? (
										user.data.group.name + " " + plan
									) : (
										<Skeleton duration={2} width={67} height={20} />
									)}
								</span>
							) : null}

							{isComponentReady && user?.data?.group?.name ? (
								user.data.group.name === Basic || user.data.group.name === Pro ? (
									<Link href={SubscriptionPlansSettingsLink} passHref>
										<a
											className={classnames(
												"inline-flex cursor-pointer items-center rounded px-2 py-1 text-xs font-medium leading-4 transition duration-150 ease-in-out hover:text-white",
												user.data.group.name === Basic
													? "bg-green-200 text-green-800 hover:bg-green-600"
													: "bg-blue-200 text-blue-800 hover:bg-blue-600"
											)}
										>
											<small>{upgrade}</small>
										</a>
									</Link>
								) : null
							) : (
								<Skeleton duration={2} width={57} height={24} />
							)}
						</span>
					</div>
					<div className="border-t border-gray-300"></div>
					<div className="py-1">
						{ProfileSidebarMenus[0].links.map((val, key) => (
							<Link key={key} href={val.url} passHref>
								<a
									className="block cursor-pointer px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none"
									role="menuitem"
								>
									{val.title}
								</a>
							</Link>
						))}
					</div>
					<div className="border-t border-gray-300"></div>
					<div className="py-1">
						{ProfileSidebarMenus[1].links.map((val, key) => (
							<Link key={key} href={val.url} passHref>
								<a
									className="block cursor-pointer px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none"
									role="menuitem"
								>
									{val.title}
								</a>
							</Link>
						))}
					</div>
				</div>
			</div>
		</Transition>
	);
};

ProfileMenuDropdown.propTypes = {
	isComponentVisible: PropTypes.bool
};

/**
 * Memoized custom `ProfileMenuDropdown` component
 */
export const MemoizedProfileMenuDropdown = memo(ProfileMenuDropdown);
