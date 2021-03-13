// React
import React, { useState, useEffect } from 'react';

// NextJS
import Link from 'next/link';

// External
import { Transition } from '@headlessui/react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import tw from 'twin.macro';

// JSON
import SidebarLabel from 'public/label/components/profile/Sidebar.json';
import SidebarPages from 'public/data/sidebar-pages.json';

// Hooks
import useDropdownOutsideClick from 'src/hooks/useDropdownOutsideClick';

// Components
import ChevronTopSvg from 'src/components/svg/ChevronTopSvg';

const Sidebar = ({ user, userLoaded }) => {
	const [showDropdown, setShowDropdown] = useState(false);
	const [profileLoaded, setProfileLoaded] = useState(false);
	const {
		ref,
		isComponentVisible,
		setIsComponentVisible
	} = useDropdownOutsideClick(false);

	const handleDropdownToggle = () => {
		setShowDropdown(!showDropdown);
		setIsComponentVisible(!isComponentVisible);
	};

	useEffect(() => {
		if (user && user !== undefined && userLoaded) {
			setTimeout(() => {
				setProfileLoaded(true);
			}, 1500);
		}
	}, [user, userLoaded]);

	return profileLoaded ? (
		<div ref={ref} tw="flex-shrink-0 flex flex-col relative">
			<button
				type="button"
				className="group"
				tw="p-4 flex items-center justify-between flex-shrink-0 w-full focus:outline-none transition ease-in-out duration-150 bg-gray-900 hover:bg-gray-1100"
				id="options-menu"
				aria-haspopup="true"
				aria-expanded={isComponentVisible ? 'true' : 'false'}
				onClick={handleDropdownToggle}
			>
				<div tw="flex items-center">
					<div tw="flex flex-col flex-wrap text-left">
						<p tw="text-sm leading-tight mb-1 font-medium text-white">
							{user.first_name} {user.last_name}
						</p>
						<p tw="text-xs leading-4 font-medium text-white transition ease-in-out duration-150">
							@{user.username}
						</p>
					</div>
				</div>
				<div>
					<ChevronTopSvg className={tw`w-4 h-4 text-white`} />
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
					<div
						tw="rounded-md bg-white ring-1 ring-black ring-opacity-5"
						role="menu"
						aria-orientation="vertical"
						aria-labelledby="options-menu"
					>
						<div tw="py-1">
							<span
								className="group"
								tw="flex justify-between items-center my-1 px-4 py-2"
							>
								<span
									css={[
										tw`text-sm leading-5 font-medium`,
										user.group.name === 'Basic'
											? tw`text-green-800`
											: user.group.name === 'Pro'
											? tw`text-blue-800`
											: tw`text-red-800`
									]}
								>
									{user.group.name} {SidebarLabel[0].label}
								</span>
								{(user.group.name === 'Basic' || user.group.name === 'Pro') && (
									<Link href="/dashboard/settings/subscriptions">
										<a
											css={[
												tw`text-xs leading-4 font-medium inline-flex items-center px-2 py-1 rounded hover:text-white cursor-pointer transition ease-in-out duration-150`,
												user.group.name === 'Basic'
													? tw`bg-green-200 text-green-800 hover:bg-green-600`
													: tw`bg-blue-200 text-blue-800 hover:bg-blue-600`
											]}
										>
											<small>{SidebarLabel[1].label}</small>
										</a>
									</Link>
								)}
							</span>
						</div>
						<div tw="border-t border-gray-300"></div>
						<div tw="py-1">
							{SidebarPages.filter((page) => page.slug !== 'logout').map(
								(val, key) => {
									return (
										<Link key={key} href={val.url}>
											<a
												tw="block px-4 py-2 text-sm leading-5 text-gray-700 cursor-pointer hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
												role="menuitem"
											>
												{val.label}
											</a>
										</Link>
									);
								}
							)}
						</div>
						<div tw="border-t border-gray-300"></div>
						<div tw="py-1">
							{SidebarPages.filter((page) => page.slug === 'logout').map(
								(val, key) => {
									return (
										<Link key={key} href={val.url}>
											<a
												tw="block px-4 py-2 text-sm leading-5 text-gray-700 cursor-pointer hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
												role="menuitem"
											>
												{val.label}
											</a>
										</Link>
									);
								}
							)}
						</div>
					</div>
				</div>
			</Transition>
		</div>
	) : (
		<div tw="flex-shrink-0 flex flex-col bg-gray-1100">
			<Link href="/dashboard/settings/profile">
				<a className="group" tw="p-4 flex-shrink-0 w-full block">
					<div tw="flex items-center">
						<div>
							<Skeleton circle={true} duration={2} width={40} height={40} />
						</div>
						<div tw="ml-3">
							<Skeleton duration={2} width={145} />
							<Skeleton duration={2} width={145} />
						</div>
					</div>
				</a>
			</Link>
		</div>
	);
};

Sidebar.propTypes = {};

export default Sidebar;
