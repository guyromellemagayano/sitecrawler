/* eslint-disable jsx-a11y/anchor-is-valid */
import { MemoizedAlert } from "@components/alerts";
import { MemoizedProfileMenuDropdown } from "@components/dropdowns/ProfileMenuDropdown";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useGetErrorHandler } from "@hooks/useErrorHandler";
import { useLoading } from "@hooks/useLoading";
import { useUser } from "@hooks/useUser";
import { memo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import tw from "twin.macro";

/**
 * Custom function to render the `ProfileMenu` component
 */
export function ProfileMenu() {
	// SWR hooks
	const { user, errorUser, validatingUser } = useUser();

	// Custom hooks
	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
	const { isComponentReady } = useLoading();
	const { errorMessage: userErrorMessage } = useGetErrorHandler("user", user, errorUser, validatingUser);

	return (
		<>
			{userErrorMessage !== [] && userErrorMessage?.length > 0 ? (
				<div tw="fixed right-6 bottom-6 grid grid-flow-row gap-4">
					{userErrorMessage.map((value, key) => (
						<MemoizedAlert key={key} message={value} isError />
					))}
				</div>
			) : null}

			<div tw="flex-shrink-0 flex flex-col relative">
				<div ref={ref}>
					<button
						type="button"
						css={[
							tw`p-4 flex items-center justify-between flex-shrink-0 w-full focus:outline-none transition ease-in-out duration-150 bg-gray-900 `,
							isComponentReady ? tw`cursor-pointer hover:bg-gray-1100` : tw`cursor-default`
						]}
						id="options-menu"
						aria-haspopup="true"
						aria-expanded={isComponentVisible && isComponentReady ? "true" : "false"}
						onClick={isComponentReady ? () => setIsComponentVisible(!isComponentVisible) : null}
					>
						<div tw="flex items-center">
							<div tw="flex flex-col flex-wrap text-left">
								<p className="truncate-profile-text" tw="text-sm leading-tight mb-1 font-medium text-white">
									{isComponentReady && user?.data?.first_name ? (
										user?.data?.first_name
									) : (
										<Skeleton duration={2} width={85} height={15} tw="mb-1" />
									)}
								</p>
								<p
									className="truncate-profile-text"
									tw="text-xs leading-4 font-medium text-white transition ease-in-out duration-150"
								>
									{isComponentReady && user?.data?.email ? (
										user?.data?.email
									) : (
										<Skeleton duration={2} width={130} height={15} />
									)}
								</p>
							</div>
						</div>

						{isComponentReady && user?.data?.first_name && user?.data?.email ? (
							<div>
								<ChevronUpIcon tw="w-4 h-4 text-white" />
							</div>
						) : null}
					</button>

					<MemoizedProfileMenuDropdown isComponentVisible={isComponentVisible} />
				</div>
			</div>
		</>
	);
}

/**
 * Memoized custom `ProfileMenu` component
 */
export const MemoizedProfileMenu = memo(ProfileMenu);
