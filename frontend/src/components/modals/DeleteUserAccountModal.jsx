// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";

// External
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid";
import { Transition } from "@headlessui/react";
import * as Sentry from "@sentry/nextjs";
import axios from "axios";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import tw from "twin.macro";

// JSON
import DeleteUserAccountModalLabel from "./labels/DeleteUserAccountModal.json";

const DeleteUserAccountModal = (props) => {
	const [disableDeleteUser, setDisableDeleteUser] = React.useState(false);
	const [errorMsg, setErrorMsg] = React.useState([]);
	const [successMsg, setSuccessMsg] = React.useState([]);
	const [hideButtons, setHideButtons] = React.useState(false);

	const userApiEndpoint = `/api/auth/user/`;
	const loginPage = "/login";

	const router = useRouter();

	const handleHideSiteDeleteModal = (e) => {
		return e?.key === "Escape" ? props.setShowModal(false) : null;
	};

	React.useEffect(() => {
		document.addEventListener("keydown", disableDeleteUser ? null : handleHideSiteDeleteModal, true);

		return () => {
			document.removeEventListener("keydown", disableDeleteUser ? null : handleHideSiteDeleteModal, true);
		};
	}, [disableDeleteUser]);

	// FIXME: Fix delete user account
	const handleUserDeletion = async (e) => {
		e.preventDefault();

		setDisableDeleteUser(true);

		setTimeout(() => {
			setDisableDeleteUser(false);
			// setSuccessMsg((successMsg) => [...successMsg, DeleteUserAccountModalLabel[7]]);
			setErrorMsg((errorMsg) => [...errorMsg, DeleteUserAccountModalLabel[3]]);
		}, 3000);

		// return await axios
		// 	.delete(userApiEndpoint, {
		// 		headers: {
		// 			"Accept": "application/json",
		// 			"Content-Type": "application/json",
		// 			"X-CSRFToken": Cookies.get("csrftoken")
		// 		}
		// 	})
		// 	.then((response) => {
		// 		Math.floor(response?.status / 204) === 1
		// 			? (() => {
		// 					setDisableDeleteUser(false);

		// 					props.setShowModal(!props.showModal);
		// 					props.mutateUser(userApiEndpoint);

		// 					setTimeout(() => {
		// 						router.push(loginPage);
		// 					}, 1000);
		// 			  })()
		// 			: (() => {
		// 					Sentry.captureException(response);

		// 					setDisableDeleteUser(false);
		// 					setErrorMsg((errorMsg) => [...errorMsg, DeleteUserAccountModalLabel[3].label]);
		// 			  })();
		// 	})
		// 	.catch((error) => {
		// 		Sentry.captureException(error);

		// 		setDisableDeleteUser(false);
		// 		setErrorMsg((errorMsg) => [...errorMsg, DeleteUserAccountModalLabel[3].label]);
		// 	});
	};

	React.useEffect(() => {
		Object.keys(successMsg).length > 0 ? setHideButtons(true) : null;
	}, [successMsg]);

	React.useEffect(() => {
		props.showModal
			? Object.keys(successMsg).length > 0
				? (() => {
						setSuccessMsg([]);
						setHideButtons(false);
				  })()
				: (() => {
						setErrorMsg([]);
				  })()
			: null;
	}, [props.showModal]);

	return (
		<Transition
			show={props.showModal}
			tw="fixed z-50 bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center"
		>
			<Transition.Child
				enter="ease-out duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="ease-in duration-200"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<div tw="fixed inset-0 transition-opacity" aria-hidden="true">
					<div tw="absolute inset-0 bg-gray-500 opacity-75"></div>
				</div>
			</Transition.Child>

			<span tw="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

			<Transition.Child
				enter="ease-out duration-300"
				enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
				enterTo="opacity-100 translate-y-0 sm:scale-100"
				leave="ease-in duration-200"
				leaveFrom="opacity-100 translate-y-0 sm:scale-100"
				leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
			>
				<div
					tw="bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden transform transition-all sm:max-w-lg sm:w-full sm:p-6"
					role="dialog"
					aria-modal="true"
					aria-labelledby="modal-headline"
				>
					<div tw="sm:flex sm:items-start">
						<div
							css={[
								tw`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10`,
								Object.keys(successMsg).length > 0 ? tw`bg-green-100` : tw`bg-red-100`
							]}
						>
							{Object.keys(successMsg).length > 0 ? (
								<CheckCircleIcon tw="h-6 w-6 text-green-600" />
							) : (
								<XCircleIcon tw="h-6 w-6 text-red-600" />
							)}
						</div>
						<div tw="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
							{Object.keys(errorMsg).length > 0 ? (
								errorMsg?.map((value, index) => {
									return (
										<h3 key={index} tw="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
											{value.label}
										</h3>
									);
								})
							) : Object.keys(successMsg).length > 0 ? (
								successMsg?.map((value, index) => {
									return (
										<h3 key={index} tw="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
											{value.label}
										</h3>
									);
								})
							) : (
								<h3 tw="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
									{DeleteUserAccountModalLabel[0].label}
								</h3>
							)}

							{Object.keys(errorMsg).length > 0 ? (
								errorMsg?.map((value, index) => {
									return (
										<div key={index} tw="mt-2">
											<p tw="text-sm leading-5 text-gray-500">{value.description}</p>
										</div>
									);
								})
							) : Object.keys(successMsg).length > 0 ? (
								successMsg?.map((value, index) => {
									return (
										<div key={index} tw="mt-2">
											<p tw="text-sm leading-5 text-gray-500">{value.description}</p>
										</div>
									);
								})
							) : (
								<div tw="mt-2">
									<p tw="text-sm leading-5 text-gray-500">{DeleteUserAccountModalLabel[0].description}</p>
								</div>
							)}
						</div>
					</div>

					{!hideButtons ? (
						<div tw="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
							<span tw="flex w-full sm:w-auto">
								{Object.keys(errorMsg).length > 0 ? null : (
									<button
										type="button"
										disabled={props.disableDeleteUser}
										css={[
											tw`sm:ml-3 cursor-pointer inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-red-600 text-sm leading-5 font-medium text-white shadow-sm sm:text-sm sm:leading-5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition ease-in-out duration-150`,
											disableDeleteUser
												? tw`opacity-50 cursor-not-allowed`
												: tw`hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 active:bg-red-700`
										]}
										aria-label="Delete User"
										onClick={handleUserDeletion}
									>
										{disableDeleteUser ? DeleteUserAccountModalLabel[4].label : DeleteUserAccountModalLabel[6].label}
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
									onClick={disableDeleteUser ? null : () => props.setShowModal(!props.showModal)}
								>
									{Object.keys(errorMsg).length > 0
										? DeleteUserAccountModalLabel[5].label
										: DeleteUserAccountModalLabel[2].label}
								</button>
							</span>
						</div>
					) : null}
				</div>
			</Transition.Child>
		</Transition>
	);
};

DeleteUserAccountModal.propTypes = {};

export default DeleteUserAccountModal;
