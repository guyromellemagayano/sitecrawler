import ProfileSidebarSkeleton from "@components/skeletons/ProfileSidebarSkeleton";
import { Basic, Pro } from "@constants/GlobalValues";
import { SubscriptionPlansSettingsLink } from "@constants/PageLinks";
import { SidebarMenus } from "@constants/SidebarMenus";
import { Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useUser } from "@hooks/useUser";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { memo } from "react";
import tw from "twin.macro";

/**
 * Memoized function to render the `ProfileMenu` component.
 */
const ProfileMenu = memo(() => {
	// SWR hooks
	const { user, validatingUser } = useUser();

	// Custom hooks
	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

	// Translations
	const { t } = useTranslation();
	const upgrade = t("common:upgrade");
	const plan = t("common:plan");

	// Sidebar menus
	const { ProfileSidebarMenus } = SidebarMenus();

	return (
		<div ref={ref} tw="flex-shrink-0 flex flex-col relative">
			{!validatingUser && typeof user !== "undefined" && user !== null && Object.keys(user).length > 0 ? (
				<>
					<button
						type="button"
						className="group hover:bg-gray-1100"
						tw="p-4 flex items-center justify-between flex-shrink-0 w-full focus:outline-none transition ease-in-out duration-150 bg-gray-900"
						id="options-menu"
						aria-haspopup="true"
						aria-expanded={isComponentVisible ? "true" : "false"}
						onClick={() => setIsComponentVisible(!isComponentVisible)}
					>
						<div tw="flex items-center">
							<div tw="flex flex-col flex-wrap text-left">
								<p className="truncate-profile-text" tw="text-sm leading-tight mb-1 font-medium text-white">
									{user?.data?.first_name}
								</p>
								<p
									className="truncate-profile-text"
									tw="text-xs leading-4 font-medium text-white transition ease-in-out duration-150"
								>
									{user?.data?.email}
								</p>
							</div>
						</div>
						<div>
							<ChevronUpIcon tw="w-4 h-4 text-white" />
						</div>
					</button>

					<Transition
						show={isComponentVisible}
						enter="transition ease-out duration-100"
						enterFrom="transform opacity-0 scale-95"
						enterTo="transform opacity-100 scale-100"
						leave="transition ease-in duration-75"
						leaveFrom="transform opacity-100 scale-100"
						leaveTo="transform opacity-0 scale-95"
					>
						<div tw="z-10 mx-3 origin-top absolute right-0 left-0 bottom-0 mt-1 mb-20 rounded-md shadow-lg">
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
											{user?.data?.group?.name} {plan}
										</span>
										{(user?.data?.group?.name === Basic || user?.data?.group?.name === Pro) && (
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
										)}
									</span>
								</div>
								<div tw="border-t border-gray-300"></div>
								{ProfileSidebarMenus.map((val, key) => (
									<div key={key} tw="py-1">
										{val.links
											.filter((page) => page.slug !== "logout")
											.map((val, key) => (
												<Link key={key} href={val.url} passHref>
													<a
														tw="block px-4 py-2 text-sm leading-5 text-gray-700 cursor-pointer hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
														role="menuitem"
													>
														{val.label}
													</a>
												</Link>
											))}
									</div>
								))}
								<div tw="border-t border-gray-300"></div>
								{ProfileSidebarMenus.filter((page) => page.slug === "global-settings").map((val, key) => (
									<div key={key} tw="py-1">
										{val.links
											.filter((page) => page.slug === "logout")
											.map((val, key) => (
												<Link key={key} href={val.url} passHref>
													<a
														tw="block px-4 py-2 text-sm leading-5 text-gray-700 cursor-pointer hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
														role="menuitem"
													>
														{val.label}
													</a>
												</Link>
											))}
									</div>
								))}
							</div>
						</div>
					</Transition>
				</>
			) : (
				<ProfileSidebarSkeleton />
			)}
		</div>
	);
});

export default ProfileMenu;
