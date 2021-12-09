import { MemoizedDeleteUserAccountModal } from "@components/modals/DeleteUserAccountModal";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useLoading } from "@hooks/useLoading";
import useTranslation from "next-translate/useTranslation";
import { memo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import tw from "twin.macro";

/**
 * Custom function to render the `DeleteUserAccountSettings` component
 */
export function DeleteUserAccountSettings() {
	// Translations
	const { t } = useTranslation();
	const deleteUserAccountModalRequestTitle = t("settings:deleteUserAccountModalRequest.title");
	const request = t("common:request");

	// Custom hooks
	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
	const { isComponentReady } = useLoading();

	return (
		<>
			<MemoizedDeleteUserAccountModal ref={ref} setShowModal={setIsComponentVisible} showModal={isComponentVisible} />

			<div tw="pb-12">
				<h5 tw="text-xl leading-6 font-bold text-gray-900">
					{isComponentReady ? deleteUserAccountModalRequestTitle : <Skeleton duration={2} width={175} height={24} />}
				</h5>

				<div tw="max-w-full lg:max-w-3xl pt-0 pb-2 mt-6">
					<div tw="flex justify-start">
						<span tw="inline-flex rounded-md shadow-sm">
							{isComponentReady ? (
								<button
									type="button"
									disabled={isComponentVisible}
									id="user-account-delete-modal-button"
									css={[
										tw`cursor-pointer inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-red-600 text-sm leading-5 font-medium text-white shadow-sm sm:text-sm sm:leading-5 transition ease-in-out duration-150`,
										isComponentVisible
											? tw`opacity-50 cursor-not-allowed`
											: tw`hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 active:bg-red-700`
									]}
									onClick={() => setIsComponentVisible(!isComponentVisible)}
								>
									{request}
								</button>
							) : (
								<Skeleton duration={2} width={78} height={38} tw="w-full px-4 py-2 inline-flex" />
							)}
						</span>
					</div>
				</div>
			</div>
		</>
	);
}

export const MemoizedDeleteUserAccountSettings = memo(DeleteUserAccountSettings);
