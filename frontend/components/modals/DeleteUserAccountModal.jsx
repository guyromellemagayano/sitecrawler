import { UserApiEndpoint } from "@constants/ApiEndpoints";
import { ModalDisplayInterval } from "@constants/GlobalValues";
import { LoginLink } from "@constants/PageLinks";
import { Transition } from "@headlessui/react";
import { handleDeleteMethod } from "@helpers/handleHttpMethods";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/outline";
import { SiteCrawlerAppContext } from "@pages/_app";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { forwardRef, Fragment, memo, useContext, useMemo, useState } from "react";
import { useSWRConfig } from "swr";
import tw from "twin.macro";

/**
 * Custom function to render the `DeleteUserAccountModal` component
 *
 * @param {boolean} showModal
 * @param {function} setShowModal
 */
const DeleteUserAccountModal = ({ showModal = false, setShowModal }, ref) => {
	const [hideButtons, setHideButtons] = useState(false);
	const [isDeleted, setIsDeleted] = useState(false);
	const [disableDeleteUser, setDisableDeleteUser] = useState(false);

	// Translations
	const { t } = useTranslation();
	const processing = t("common:processing");
	const proceed = t("common:proceed");
	const cancel = t("common:cancel");

	// Custom context
	const { state, setConfig, userIdApiEndpoint } = useContext(SiteCrawlerAppContext);

	// Router
	const { push } = useRouter();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Handle user deletion
	const handleUserDeletion = async (e) => {
		e.preventDefault();

		// Disable the `DeleteUserAccountModal` component
		setDisableDeleteUser(true);

		const deleteUserAccountResponse = await handleDeleteMethod(userIdApiEndpoint);
		const deleteUserAccountResponseData = deleteUserAccountResponse?.data ?? null;
		const deleteUserAccountResponseStatus = deleteUserAccountResponse?.status ?? null;
		const deleteUserAccountResponseMethod = deleteUserAccountResponse?.config?.method ?? null;

		if (deleteUserAccountResponseData !== null && Math.round(deleteUserAccountResponseStatus / 200) === 1) {
			// Mutate `user` endpoint after successful 200 OK or 201 Created response is issued
			await mutate(UserApiEndpoint);

			// Show alert message after successful 200 OK or 201 Created response is issued
			setConfig({
				isUser: true,
				method: deleteUserAccountResponseMethod,
				status: deleteUserAccountResponseStatus
			});

			// Close the modal after successful 200 OK or 201 Created response is issued
			setTimeout(() => {
				setShowModal(!showModal);
			}, ModalDisplayInterval);

			// Reenable submission as soon as 200 OK or 201 Created response is issued
			setDisableDeleteUser(false);
			setHideButtons(true);
			setIsDeleted(true);
		} else {
			// Show alert message after successful 200 OK or 201 Created response is issued
			setConfig({
				isUser: true,
				method: deleteUserAccountResponseMethod,
				status: deleteUserAccountResponseStatus
			});

			// Reenable submission as soon as 200 OK or 201 Created response is issued
			setDisableDeleteUser(false);
			setHideButtons(false);
			setIsDeleted(false);
		}
	};

	useMemo(() => {
		let isMounted = true;

		(() => {
			if (!isMounted) return;

			if (isDeleted && hideButtons) {
				setHideButtons(false);
				setIsDeleted(false);

				push(LoginLink);
			}
		})();

		return () => {
			isMounted = false;
		};
	}, [isDeleted, hideButtons]);

	return (
		<Transition.Root show={showModal} as={Fragment}>
			<div ref={ref} tw="fixed z-50 bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center">
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
					as={Fragment}
					enter="delete-user-account-modal-second-child-enter"
					enterFrom="delete-user-account-modal-second-child-enter-from"
					enterTo="delete-user-account-modal-second-child-enter-to"
					leave="delete-user-account-modal-second-child-leave"
					leaveFrom="delete-user-account-modal-second-child-leave-from"
					leaveTo="delete-user-account-modal-second-child-leave-to"
				>
					{state?.responses?.map((value, key) => {
						// Alert Messsages
						const responseTitle = value.responseTitle ?? null;
						const responseText = value.responseText ?? null;
						const isSuccess = value.isSuccess ?? null;

						return (
							<div
								key={key}
								aria-labelledby="modal-headline"
								aria-modal="true"
								role="dialog"
								tw="bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden transform transition-all sm:max-w-lg sm:w-full sm:p-6"
							>
								<div tw="sm:flex sm:items-start">
									<div
										css={[
											tw`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10`,
											isSuccess ? tw`bg-green-100` : tw`bg-red-100`
										]}
									>
										{isSuccess ? (
											<CheckCircleIcon tw="h-6 w-6 text-green-600" />
										) : (
											<XCircleIcon tw="h-6 w-6 text-red-600" />
										)}
									</div>
									<div tw="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
										<h3 tw="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
											{responseTitle}
										</h3>

										<div tw="mt-2">
											<p tw="text-sm leading-5 text-gray-500">{responseText}</p>
										</div>
									</div>
								</div>

								{!hideButtons ? (
									<div tw="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
										<span tw="flex w-full rounded-md shadow-sm sm:w-auto">
											{!isSuccess ? null : (
												<button
													type="button"
													disabled={disableDeleteUser}
													css={[
														tw`cursor-pointer w-full mt-3 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-600`,
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
													tw`cursor-pointer inline-flex justify-center w-full mr-3 rounded-md border border-gray-300 px-4 py-2 shadow-sm text-sm font-medium  text-gray-700 bg-white `,
													disableDeleteUser
														? tw`opacity-50 cursor-not-allowed`
														: tw`hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
												]}
												onClick={() => setShowModal(false)}
											>
												{!isSuccess ? close : cancel}
											</button>
										</span>
									</div>
								) : null}
							</div>
						);
					}) ?? null}
				</Transition.Child>
			</div>
		</Transition.Root>
	);
};

/**
 * Memoized custom `DeleteUserAccountModal` component
 */
const ForwardRefDeleteUserAccountModal = forwardRef(DeleteUserAccountModal);
export const MemoizedDeleteUserAccountModal = memo(ForwardRefDeleteUserAccountModal);
