// React
// Components
import ProfileSidebarSkeleton from "@components/skeletons/ProfileSidebarSkeleton";
// Enums
import { SidebarLabels } from "@enums/SidebarLabels";
import { ProfileSidebarMenu } from "@enums/SidebarMenus";
import { Transition } from "@headlessui/react";
// External
import { ChevronUpIcon } from "@heroicons/react/solid";
// Hooks
import { useComponentVisible } from "@hooks/useComponentVisible";
// NextJS
import Link from "next/link";
import PropTypes from "prop-types";
import * as React from "react";
import tw from "twin.macro";

const ProfileMenu = ({ user }) => {
	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

	return (
		<div ref={ref} tw="flex-shrink-0 flex flex-col relative">
			{user ? (
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
									{user?.first_name}
								</p>
								<p
									className="truncate-profile-text"
									tw="text-xs leading-4 font-medium text-white transition ease-in-out duration-150"
								>
									{user?.email}
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
												user?.plan?.name === "Basic"
													? tw`text-green-800`
													: user?.plan?.name === "Pro"
													? tw`text-blue-800`
													: tw`text-red-800`
											]}
										>
											{user?.plan?.name} {SidebarLabels[0].label}
										</span>
										{(user?.plan?.name === "Basic" || user?.plan?.name === "Pro") && (
											<Link href="/settings/subscription-plans" passHref>
												<a
													css={[
														tw`text-xs leading-4 font-medium inline-flex items-center px-2 py-1 rounded hover:text-white cursor-pointer transition ease-in-out duration-150`,
														user?.plan?.name === "Basic"
															? tw`bg-green-200 text-green-800 hover:bg-green-600`
															: tw`bg-blue-200 text-blue-800 hover:bg-blue-600`
													]}
												>
													<small>{SidebarLabels[1].label}</small>
												</a>
											</Link>
										)}
									</span>
								</div>
								<div tw="border-t border-gray-300"></div>
								{ProfileSidebarMenu.map((val, key) => (
									<div key={key}>
										<div tw="py-1">
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
										<div tw="border-t border-gray-300"></div>
									</div>
								))}
								{ProfileSidebarMenu.filter((page) => page.slug === "global-settings").map((val, key) => (
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
};

ProfileMenu.propTypes = {
	email: PropTypes.string,
	first_name: PropTypes.string,
	name: PropTypes.string
};

ProfileMenu.defaultProps = {
	email: null,
	first_name: null,
	name: null
};

export default ProfileMenu;
