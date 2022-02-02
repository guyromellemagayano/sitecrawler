import { MemoizedProfileMenuDropdown } from "@components/dropdowns/ProfileMenuDropdown";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { useAlertMessage } from "@hooks/useAlertMessage";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useUser } from "@hooks/useUser";
import { memo, useMemo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import tw from "twin.macro";

/**
 * Custom function to render the `ProfileMenu` component
 */
const ProfileMenu = () => {
	// Custom hooks
	const {
		ref: profileMenuRef,
		isComponentVisible: isProfileMenuComponentVisible,
		setIsComponentVisible: setIsProfileMenuComponentVisible
	} = useComponentVisible(false);
	const { state, setConfig } = useAlertMessage();

	// `user` SWR hook
	const { user, errorUser, validatingUser } = useUser();

	// TODO: Error handling for `user` SWR hook
	useMemo(() => {
		// Show alert message after failed `user` SWR hook fetch
		typeof errorUser !== "undefined" && errorUser !== null
			? setConfig({
					isUser: true,
					method: errorUser?.config?.method ?? null,
					status: errorUser?.status ?? null
			  })
			: null;
	}, [errorUser]);

	return (
		<div ref={profileMenuRef} tw="flex-shrink-0 flex flex-col relative">
			<button
				type="button"
				css={[
					tw`p-4 flex items-center justify-between flex-shrink-0 w-full focus:outline-none transition ease-in-out duration-150 bg-gray-900`,
					!validatingUser ? tw`cursor-pointer hover:bg-gray-1100` : tw`cursor-default`
				]}
				id="options-menu"
				aria-haspopup="true"
				aria-expanded={isProfileMenuComponentVisible ? "true" : "false"}
				onClick={!validatingUser ? () => setIsProfileMenuComponentVisible(!isProfileMenuComponentVisible) : () => {}}
			>
				<div tw="flex items-center">
					<div tw="flex flex-col flex-wrap text-left">
						<p className="truncate-profile-text" tw="text-sm leading-tight mb-1 font-medium text-white">
							{!validatingUser ? (
								user?.data?.first_name?.length > 0 ? (
									user.data.first_name
								) : null
							) : (
								<Skeleton duration={2} width={85} height={15} tw="mb-1" />
							)}
						</p>
						<p
							className="truncate-profile-text"
							tw="text-xs leading-4 font-medium text-white transition ease-in-out duration-150"
						>
							{!validatingUser ? (
								user?.data?.email?.length > 0 ? (
									user.data.email
								) : null
							) : (
								<Skeleton duration={2} width={130} height={15} />
							)}
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
