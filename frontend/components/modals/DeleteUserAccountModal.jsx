import { UserApiEndpoint } from "@constants/ApiEndpoints";
import { ModalDisplayInterval } from "@constants/GlobalValues";
import { LoginLink } from "@constants/PageLinks";
import { Dialog, Transition } from "@headlessui/react";
import { handleDeleteMethod } from "@helpers/handleHttpMethods";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/outline";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { forwardRef, Fragment, memo, useContext, useMemo, useState } from "react";
import { useSWRConfig } from "swr";

/**
 * Custom function to render the "DeleteUserAccountModal" component
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

	// Router
	const { push } = useRouter();

	// Custom context
	const { state, setConfig } = useContext(SiteCrawlerAppContext);

	// SWR hooks
	const { userIdApiEndpoint } = useUser();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Handle user deletion
	const handleUserDeletion = async (e) => {
		e.preventDefault();

		// Disable the "DeleteUserAccountModal" component
		setDisableDeleteUser(true);

		const deleteUserAccountResponse = await handleDeleteMethod(userIdApiEndpoint);
		const deleteUserAccountResponseData = deleteUserAccountResponse?.data ?? null;
		const deleteUserAccountResponseStatus = deleteUserAccountResponse?.status ?? null;
		const deleteUserAccountResponseMethod = deleteUserAccountResponse?.config?.method ?? null;

		if (deleteUserAccountResponseData !== null && Math.round(deleteUserAccountResponseStatus / 200) === 1) {
			// Mutate "user" endpoint after successful 200 OK or 201 Created response is issued
			mutate(UserApiEndpoint);

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

		(async () => {
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
			<Dialog
				as="div"
				className="fixed inset-0 z-50 overflow-y-auto"
				initialFocus={ref}
				onClose={!disableDeleteUser ? setShowModal : () => {}}
			>
				<div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
						&#8203;
					</span>

					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					>
						{state?.responses?.map((value, key) => {
							// Alert Messsages
							const responseTitle = value.responseTitle ?? null;
							const responseText = value.responseText ?? null;
							const isSuccess = value.isSuccess ?? null;

							return (
								<div
									key={key}
									className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
								>
									<div className="sm:flex sm:items-start">
										<div
											className={classnames(
												"mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10",
												isSuccess ? "bg-green-100" : "bg-red-100"
											)}
										>
											{isSuccess ? (
												<CheckCircleIcon className="h-6 w-6 text-green-600" />
											) : (
												<XCircleIcon className="h-6 w-6 text-red-600" />
											)}
										</div>
										<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
											<Dialog.Title as="h3" className="delete-user-account-modal-second-child-title">
												{responseTitle}
											</Dialog.Title>

											<div className="mt-2">
												<Dialog.Description as="p" className="delete-user-account-modal-second-child-description">
													{responseText}
												</Dialog.Description>
											</div>
										</div>
									</div>

									{!hideButtons ? (
										<div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
											<span className="flex w-full rounded-md shadow-sm sm:w-auto">
												{!isSuccess ? null : (
													<button
														type="button"
														disabled={disableDeleteUser}
														className={classnames(
															"relative mt-3 inline-flex w-full cursor-pointer items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium leading-5 text-white sm:mt-0",
															disableDeleteUser
																? "cursor-not-allowed opacity-50"
																: "hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:bg-red-700"
														)}
														aria-label="Delete User"
														onClick={handleUserDeletion}
													>
														{disableDeleteUser ? processing : proceed}
													</button>
												)}

												<button
													type="button"
													disabled={disableDeleteUser}
													className={classnames(
														"mr-3 inline-flex w-full cursor-pointer justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium  text-gray-700 shadow-sm ",
														disableDeleteUser
															? "cursor-not-allowed opacity-50"
															: "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
													)}
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
			</Dialog>
		</Transition.Root>
	);
};

/**
 * Memoized custom "DeleteUserAccountModal" component
 */
const ForwardRefDeleteUserAccountModal = forwardRef(DeleteUserAccountModal);
export const MemoizedDeleteUserAccountModal = memo(ForwardRefDeleteUserAccountModal);
