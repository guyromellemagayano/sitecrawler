import { MemoizedProfileMenuDropdown } from "@components/dropdowns/ProfileMenuDropdown";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import { memo, useContext, useMemo } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import "twin.macro";

/**
 * Custom function to render the `ProfileMenu` component
 */
const ProfileMenu = () => {
	// Custom context
	const { setConfig } = useContext(SiteCrawlerAppContext);

	// Custom hooks
	const {
		ref: profileMenuRef,
		isComponentVisible: isProfileMenuComponentVisible,
		setIsComponentVisible: setIsProfileMenuComponentVisible
	} = useComponentVisible(false);

	// `user` SWR hook
	const { user, errorUser } = useUser();

	useMemo(() => {
		let isMounted = true;

		(async () => {
			if (!isMounted) return;

			// Show alert message after failed `user` SWR hook fetch
			errorUser
				? setConfig({
						isSites: true,
						method: errorUser?.config?.method ?? null,
						status: errorUser?.status ?? null
				  })
				: null;
		})();

		return () => {
			isMounted = false;
		};
	}, [user, errorUser]);

	return (
		<div ref={profileMenuRef} tw="flex-shrink-0 flex flex-col relative">
			<button
				type="button"
				tw="p-4 flex items-center justify-between flex-shrink-0 w-full focus:outline-none transition ease-in-out duration-150 bg-gray-900 cursor-pointer hover:bg-gray-1100"
				id="options-menu"
				aria-haspopup="true"
				aria-expanded={isProfileMenuComponentVisible ? "true" : "false"}
				onClick={() => setIsProfileMenuComponentVisible(!isProfileMenuComponentVisible)}
			>
				<div tw="flex items-center">
					<div tw="flex flex-col flex-wrap text-left">
						<p className="truncate-profile-text" tw="text-sm leading-tight mb-1 font-medium text-white">
							{user?.data?.first_name?.length > 0 ? user.data.first_name : null}
						</p>
						<p
							className="truncate-profile-text"
							tw="text-xs leading-4 font-medium text-white transition ease-in-out duration-150"
						>
							{user?.data?.email?.length > 0 ? user.data.email : null}
						</p>
					</div>
				</div>

				{user?.data?.first_name?.length > 0 || user?.data?.email?.length ? (
					<div>
						<ChevronUpIcon tw="w-4 h-4 text-white" />
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
