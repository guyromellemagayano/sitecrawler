import { MemoizedProfileMenuDropdown } from "@components/dropdowns/ProfileMenuDropdown";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `ProfileMenu` component
 */
const ProfileMenu = () => {
	// Custom context
	const { isComponentReady, user } = useContext(SiteCrawlerAppContext);

	// Custom variables
	const firstName = user?.data?.first_name ?? null;
	const email = user?.data?.email ?? null;

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
				className={classnames(
					"group flex w-full flex-shrink-0 items-center justify-between bg-gray-900 px-4 py-5 transition duration-150 ease-in-out focus:outline-none",
					isComponentReady ? "cursor-pointer hover:bg-gray-1100" : "cursor-default"
				)}
				aria-haspopup="true"
				aria-expanded={isProfileMenuComponentVisible && isComponentReady ? "true" : "false"}
				onClick={isComponentReady ? () => setIsProfileMenuComponentVisible(!isProfileMenuComponentVisible) : null}
			>
				<div className="flex items-center">
					<div className="flex flex-col flex-wrap text-left">
						{isComponentReady ? (
							<p className="truncate-profile-text text-sm font-medium text-white">{firstName}</p>
						) : (
							<Skeleton duration={2} width={80} height={15} />
						)}

						{isComponentReady ? (
							<p className="truncate-profile-text text-xs font-medium text-indigo-200 group-hover:text-white">
								{email}
							</p>
						) : (
							<Skeleton duration={2} width={120} height={15} />
						)}
					</div>
				</div>

				{isComponentReady ? (
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
