/* eslint-disable jsx-a11y/anchor-is-valid */
import { Basic, Pro } from "@constants/GlobalValues";
import { SubscriptionPlansSettingsLink } from "@constants/PageLinks";
import { SidebarMenus } from "@constants/SidebarMenus";
import { Transition } from "@headlessui/react";
import { useLoading } from "@hooks/useLoading";
import { useUser } from "@hooks/useUser";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import PropTypes from "prop-types";
import { memo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import tw from "twin.macro";

/**
 * Custom function to render the `ProfileMenuDropdown` component
 */
export function ProfileMenuDropdown({ isComponentVisible }) {
	// SWR hooks
	const { user } = useUser();

	// Custom hooks
	const { isComponentReady } = useLoading();

	// Translations
	const { t } = useTranslation();
	const upgrade = t("common:upgrade");
	const plan = t("common:plan");

	// Sidebar menus
	const { ProfileSidebarMenus } = SidebarMenus();

	return (
		<Transition
			show={isComponentVisible}
			enter="profile-menu-dropdown-enter"
			enterFrom="profile-menu-dropdown-enter-from"
			enterTo="profile-menu-dropdown-enter-to"
			leave="profile-menu-dropdown-leave"
			leaveFrom="profile-menu-dropdown-leave-from"
			leaveTo="profile-menu-dropdown-leave-to"
			tw="z-50 mx-3 origin-top absolute right-0 left-0 bottom-0 mt-1 mb-20 rounded-md shadow-lg"
		>
			<div tw="rounded-md bg-white" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
				<div tw="py-1">
					<span className="group" tw="flex justify-between items-center my-1 px-4 py-2">
						<span
							css={[
								tw`text-sm leading-5 font-medium`,
								user?.data?.group?.name === Basic
									? tw`text-green-800`
									: user?.data?.group?.name === Pro
									? tw`text-blue-800`
									: tw`text-red-800`
							]}
						>
							{isComponentReady && user?.data?.group?.name ? (
								user?.data?.group?.name + " " + plan
							) : (
								<Skeleton duration={2} width={67} height={20} />
							)}
						</span>
						{isComponentReady && user?.data?.group?.name ? (
							user?.data?.group?.name === Basic || user?.data?.group?.name === Pro ? (
								<Link href={SubscriptionPlansSettingsLink} passHref>
									<a
										css={[
											tw`text-xs leading-4 font-medium inline-flex items-center px-2 py-1 rounded hover:text-white cursor-pointer transition ease-in-out duration-150`,
											user?.data?.group?.name === Basic
												? tw`bg-green-200 text-green-800 hover:bg-green-600`
												: tw`bg-blue-200 text-blue-800 hover:bg-blue-600`
										]}
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
				<div tw="border-t border-gray-300"></div>
				<div tw="py-1">
					{ProfileSidebarMenus[0].links.map((val, key) => (
						<Link key={key} href={val.url} passHref>
							<a
								tw="block px-4 py-2 text-sm leading-5 text-gray-700 cursor-pointer hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
								role="menuitem"
							>
								{val.title}
							</a>
						</Link>
					))}
				</div>
				<div tw="border-t border-gray-300"></div>
				<div tw="py-1">
					{ProfileSidebarMenus[1].links.map((val, key) => (
						<Link key={key} href={val.url} passHref>
							<a
								tw="block px-4 py-2 text-sm leading-5 text-gray-700 cursor-pointer hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
								role="menuitem"
							>
								{val.title}
							</a>
						</Link>
					))}
				</div>
			</div>
		</Transition>
	);
}

ProfileMenuDropdown.propTypes = {
	isComponentVisible: PropTypes.bool
};

/**
 * Memoized custom `ProfileMenuDropdown` component
 */
export const MemoizedProfileMenuDropdown = memo(ProfileMenuDropdown);
