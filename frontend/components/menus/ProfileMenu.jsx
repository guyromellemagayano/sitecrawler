import { MemoizedProfileMenuDropdown } from "@components/dropdowns/ProfileMenuDropdown";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classNames } from "@utils/classNames";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `ProfileMenu` component
 */
const ProfileMenu = () => {
	// Custom context
	const { setConfig, isComponentReady } = useContext(SiteCrawlerAppContext);

	// SWR hooks
	const { user, firstname, email } = useUser();

	// Custom hooks
	const {
		ref: profileMenuRef,
		isComponentVisible: isProfileMenuComponentVisible,
		setIsComponentVisible: setIsProfileMenuComponentVisible
	} = useComponentVisible(false);

	return (
		<div ref={profileMenuRef} className="relative flex flex-shrink-0 flex-col">
			<button
				type="button"
				className={classNames(
					"flex w-full flex-shrink-0 items-center justify-between bg-gray-900 p-4 transition duration-150 ease-in-out focus:outline-none",
					isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail
						? "cursor-pointer hover:bg-gray-1100"
						: "cursor-default"
				)}
				id="options-menu"
				aria-haspopup="true"
				aria-expanded={
					isProfileMenuComponentVisible &&
					isComponentReady &&
					user &&
					Math.round(user?.status / 100) === 2 &&
					!user?.data?.detail
						? "true"
						: "false"
				}
				onClick={
					isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail
						? () => setIsProfileMenuComponentVisible(!isProfileMenuComponentVisible)
						: null
				}
			>
				<div className="flex items-center">
					<div className="flex flex-col flex-wrap text-left">
						<p className="truncate-profile-text mb-1 text-sm font-medium leading-tight text-white">
							{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
								firstname
							) : (
								<Skeleton duration={2} width={85} height={15} className="mb-1" />
							)}
						</p>
						<p className="truncate-profile-text text-xs font-medium leading-4 text-white transition duration-150 ease-in-out">
							{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
								email
							) : (
								<Skeleton duration={2} width={130} height={15} />
							)}
						</p>
					</div>
				</div>

				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
					<div>
						<ChevronUpIcon className="h-4 w-4 text-white" />
					</div>
				) : null}
			</button>

			<MemoizedProfileMenuDropdown isComponentVisible={isProfileMenuComponentVisible} />
		</div>
	);
};

/**
 * Memoized custom `ProfileMenu` component
 */
export const MemoizedProfileMenu = memo(ProfileMenu);
