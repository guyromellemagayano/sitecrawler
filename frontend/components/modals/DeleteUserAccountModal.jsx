/* eslint-disable react-hooks/exhaustive-deps */
import { UserApiEndpoint } from "@constants/ApiEndpoints";
import { RevalidationInterval } from "@constants/GlobalValues";
import { LoginLink } from "@constants/PageLinks";
import { Transition } from "@headlessui/react";
import { handleDeleteMethod } from "@helpers/handleHttpMethods";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/outline";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useUser } from "@hooks/useUser";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { forwardRef, memo, useCallback, useEffect, useState } from "react";
import tw from "twin.macro";

/**
 * Custom function to render the `DeleteUserAccountModal` component
 *
 * @param {boolean} showModal
 * @param {function} setShowModal
 */
export function DeleteUserAccountModal({ showModal = false, setShowModal }, ref) {
	const [userIdApiEndpoint, setUserIdApiEndpoint] = useState(null);
	const [errorHeadline, setErrorHeadline] = useState(null);
	const [errorSubheadline, setErrorSubheadline] = useState(null);
	const [successHeadline, setSuccessHeadline] = useState(null);
	const [successSubheadline, setSuccessSubheadline] = useState(null);
	const [hideButtons, setHideButtons] = useState(false);

	// Translations
	const { t } = useTranslation();
	const deleteUserAccountModalRequestHeadline = t("settings:deleteUserAccountModalRequest.headline");
	const deleteUserAccountModalRequestSubheadline = t("settings:deleteUserAccountModalRequest.subHeadline");
	const deleteUserAccountModalRequestSuccessHeadline = t("settings:deleteUserAccountModalRequestSuccess.headline");
	const deleteUserAccountModalRequestSuccessSubheadline = t(
		"settings:deleteUserAccountModalRequestSuccess.subHeadline"
	);
	const deleteUserAccountModalRequestFailedHeadline = t("settings:deleteUserAccountModalRequestFailed.headline");
	const deleteUserAccountModalRequestFailedSubheadline = t("settings:deleteUserAccountModalRequestFailed.subHeadline");
	const processing = t("settings:processing");
	const proceed = t("settings:proceed");
	const cancel = t("common:cancel");

	// SWR hooks
	const { user, errorUser, validatingUser } = useUser();

	// Custom hooks
	const { isComponentVisible: disableDeleteUser, setIsComponentVisible: setDisableDeleteUser } =
		useComponentVisible(false);

	// Router
	const router = useRouter();

	// Handle the `userId` API endpoint
	const handleUserIdApiEndpoint = useCallback(async () => {
		if (!validatingUser) {
			if (
				!errorUser &&
				typeof user !== "undefined" &&
				user !== null &&
				Object.keys(user)?.length > 0 &&
				Math.round(user?.status / 200) === 1
			) {
				setUserIdApiEndpoint(`${UserApiEndpoint + user?.data?.id}`);
			}
		}
	}, [user, errorUser, validatingUser]);

	useEffect(() => {
		handleUserIdApiEndpoint();
	}, [handleUserIdApiEndpoint]);

	console.log(userIdApiEndpoint, successHeadline, successSubheadline, errorHeadline, errorSubheadline);

	// Handle user deletion
	const handleUserDeletion = useCallback(
		async (e) => {
			e.preventDefault();

			setDisableDeleteUser(!disableDeleteUser);

			const deleteUserAccountResponse = await handleDeleteMethod(userIdApiEndpoint);
			const deleteUserAccountResponseData = deleteUserAccountResponse?.data ?? null;
			const deleteUserAccountResponseStatus = deleteUserAccountResponse?.status ?? null;

			if (deleteUserAccountResponseData !== null && Math.round(deleteUserAccountResponseStatus / 200) === 1) {
				setDisableDeleteUser(false);
				setSuccessHeadline(deleteUserAccountModalRequestSuccessHeadline);
				setSuccessSubheadline(deleteUserAccountModalRequestSuccessSubheadline);

				setTimeout(() => {
					setShowModal(!showModal);
				}, RevalidationInterval);
			} else {
				setDisableDeleteUser(false);
				setErrorHeadline(deleteUserAccountModalRequestFailedHeadline);
				setErrorSubheadline(deleteUserAccountModalRequestFailedSubheadline);
			}
		},
		[showModal, userIdApiEndpoint]
	);

	// Handle the `router.push` state
	const handleRouterPush = useCallback(async () => {
		router.push(LoginLink);
	}, [showModal]);

	useEffect(() => {
		handleRouterPush();
	}, [handleRouterPush]);

	// Handle the `hideButtons` state
	const handleHideButtons = useCallback(async () => {
		if (showModal) {
			if (
				successHeadline !== null &&
				successHeadline.length > 0 &&
				successSubheadline !== null &&
				successSubheadline?.length > 0
			) {
				setSuccessHeadline(null);
				setSuccessSubheadline(null);
				setHideButtons(false);
			} else {
				setHideButtons(false);
			}
		}
	}, [showModal, successHeadline, successSubheadline]);

	useEffect(() => {
		handleHideButtons();
	}, [handleHideButtons]);

	return (
		<Transition
			show={showModal}
			tw="fixed z-50 bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center"
		>
			<Transition.Child
				enter="delete-user-account-modal-first-child-enter"
				enterFrom="delete-user-account-modal-first-child-enter-from"
				enterTo="delete-user-account-modal-first-child-enter-to"
				leave="delete-user-account-modal-first-child-leave"
				leaveFrom="delete-user-account-modal-first-child-leave-from"
				leaveTo="delete-user-account-modal-first-child-leave-to"
			>
				<div tw="fixed inset-0 transition-opacity" aria-hidden="true">
					<div tw="absolute inset-0 bg-gray-500 opacity-75"></div>
				</div>
			</Transition.Child>

			<span tw="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

			<Transition.Child
				enter="delete-user-account-modal-second-child-enter"
				enterFrom="delete-user-account-modal-second-child-enter-from"
				enterTo="delete-user-account-modal-second-child-enter-to"
				leave="delete-user-account-modal-second-child-leave"
				leaveFrom="delete-user-account-modal-second-child-leave-from"
				leaveTo="delete-user-account-modal-second-child-leave-to"
			>
				<div
					aria-labelledby="modal-headline"
					aria-modal="true"
					ref={ref}
					role="dialog"
					tw="bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden transform transition-all sm:max-w-lg sm:w-full sm:p-6"
				>
					<div tw="sm:flex sm:items-start">
						<div
							css={[
								tw`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10`,
								successHeadline !== null &&
								successHeadline?.length > 0 &&
								successSubheadline !== null &&
								successSubheadline?.length > 0
									? tw`bg-green-100`
									: tw`bg-red-100`
							]}
						>
							{successHeadline !== null &&
							successHeadline?.length > 0 &&
							successSubheadline !== null &&
							successSubheadline?.length > 0 ? (
								<CheckCircleIcon tw="h-6 w-6 text-green-600" />
							) : (
								<XCircleIcon tw="h-6 w-6 text-red-600" />
							)}
						</div>
						<div tw="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
							<h3 tw="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
								{errorHeadline !== null && errorHeadline?.length > 0
									? errorHeadline
									: successHeadline !== null && successHeadline?.length > 0
									? successHeadline
									: deleteUserAccountModalRequestHeadline}
							</h3>

							<div tw="mt-2">
								<p tw="text-sm leading-5 text-gray-500">
									{errorSubheadline !== null && errorSubheadline?.length > 0
										? errorSubheadline
										: successSubheadline !== null && successSubheadline?.length > 0
										? successSubheadline
										: deleteUserAccountModalRequestSubheadline}
								</p>
							</div>
						</div>
					</div>

					{!hideButtons ? (
						<div tw="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
							<span tw="flex w-full sm:w-auto">
								{errorHeadline !== null &&
								errorHeadline.length > 0 &&
								errorSubheadline !== null &&
								errorSubheadline?.length > 0 ? null : (
									<button
										type="button"
										disabled={disableDeleteUser}
										css={[
											tw`sm:ml-3 cursor-pointer inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-red-600 text-sm leading-5 font-medium text-white shadow-sm sm:text-sm sm:leading-5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition ease-in-out duration-150`,
											disableDeleteUser
												? tw`opacity-50 cursor-not-allowed`
												: tw`hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 active:bg-red-700`
										]}
										aria-label="Delete User"
										onClick={handleUserDeletion}
									>
										{disableDeleteUser ? processing : proceed}
									</button>
								)}

								<button
									type="button"
									disabled={disableDeleteUser}
									css={[
										tw`cursor-pointer inline-flex justify-center w-full rounded-md border border-gray-300 sm:ml-3 px-4 py-2 bg-white text-sm leading-5 font-medium text-gray-700 shadow-sm sm:text-sm sm:leading-5`,
										disableDeleteUser
											? tw`opacity-50 cursor-not-allowed`
											: tw`hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ease-in-out duration-150`
									]}
									onClick={disableDeleteUser ? null : () => setShowModal(!setShowModal)}
								>
									{errorHeadline !== null &&
									errorHeadline.length > 0 &&
									errorSubheadline !== null &&
									errorSubheadline?.length > 0
										? close
										: cancel}
								</button>
							</span>
						</div>
					) : null}
				</div>
			</Transition.Child>
		</Transition>
	);
}

/**
 * Memoized custom `DeleteUserAccountModal` component
 */
export const ForwardRefDeleteUserAccountModal = forwardRef(DeleteUserAccountModal);
export const MemoizedDeleteUserAccountModal = memo(ForwardRefDeleteUserAccountModal);
