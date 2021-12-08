/* eslint-disable jsx-a11y/anchor-is-valid */
import { MemoizedAlert } from "@components/alerts";
import { MemoizedProfileMenuDropdown } from "@components/dropdowns/ProfileMenuDropdown";
import { MemoizedProfileSidebarSkeleton } from "@components/skeletons/ProfileSidebarSkeleton";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useGetErrorHandler } from "@hooks/useErrorHandler";
import { useLoading } from "@hooks/useLoading";
import { useUser } from "@hooks/useUser";
import { memo } from "react";
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
								{isComponentReady ? (
									<>
										<p className="truncate-profile-text" tw="text-sm leading-tight mb-1 font-medium text-white">
											{user?.data?.first_name}
										</p>
										<p
											className="truncate-profile-text"
											tw="text-xs leading-4 font-medium text-white transition ease-in-out duration-150"
										>
											{user?.data?.email}
										</p>
									</>
								) : (
									<MemoizedProfileSidebarSkeleton />
								)}
							</div>
						</div>

						{isComponentReady ? (
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
