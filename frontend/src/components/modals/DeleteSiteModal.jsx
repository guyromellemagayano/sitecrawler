// React
import * as React from "react";

// External
import { XCircleIcon, CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/solid";
import { Transition } from "@headlessui/react";
import * as Sentry from "@sentry/nextjs";
import axios from "axios";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import tw from "twin.macro";

// JSON
import DeleteSiteModalLabel from "./labels/DeleteSiteModal.json";
import SettingsLabel from "public/labels/pages/settings/settings.json";

const DeleteSiteModal = (props) => {
	const [disableDeleteSite, setDisableDeleteSite] = React.useState(false);
	const [successMsg, setSuccessMsg] = React.useState([]);
	const [errorMsg, setErrorMsg] = React.useState([]);

	const siteIdApiEndpoint = `/api/site/${props.siteId}/`;
	const siteApiEndpoint = `/api/site/`;
	const sitesPage = "/sites";

	React.useEffect(() => {
		setErrorMsg([]);
		setSuccessMsg([]);
	}, [props.showModal]);

	const handleSiteDeletion = async (e) => {
		e.preventDefault();

		setDisableDeleteSite(true);

		return await axios
			.delete(siteIdApiEndpoint, {
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json",
					"X-CSRFToken": Cookies.get("csrftoken")
				}
			})
			.then((response) => {
				Math.floor(response?.status / 200) === 1
					? (() => {
							mutateSite(siteApiEndpoint, false);
							setSuccessMsg((successMsg) => [...successMsg, DeleteSiteModalLabel[0].description]);

							successMsg &&
								setTimeout(() => {
									setShowModal(!props.showModal);
									setDisableDeleteSite(false);
									props.router.push(sitesPage);
								}, 1500);
					  })()
					: (() => {
							Sentry.captureException(response);

							setDisableDeleteSite(false);
							setErrorMsg((errorMsg) => [...errorMsg, DeleteSiteModalLabel[1].description]);
					  })();
			})
			.catch((error) => {
				Sentry.captureException(error.response);

				setDisableDeleteSite(false);
				setErrorMsg((errorMsg) => [...errorMsg, DeleteSiteModalLabel[1].description]);
			});
	};

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
								Object.keys(successMsg).length > 0
									? tw`bg-green-100`
									: Object.keys(errorMsg).length > 0
									? tw`bg-yellow-100`
									: tw`bg-red-100`
							]}
						>
							{Object.keys(successMsg).length > 0 ? (
								<CheckCircleIcon tw="h-6 w-6 text-green-600" />
							) : Object.keys(errorMsg).length > 0 ? (
								<ExclamationCircleIcon tw="h-6 w-6 text-yellow-600" />
							) : (
								<XCircleIcon tw="h-6 w-6 text-red-600" />
							)}
						</div>
						<div tw="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
							<h3 tw="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
								{Object.keys(successMsg).length > 0
									? DeleteSiteModalLabel[0].label
									: Object.keys(errorMsg).length > 0
									? DeleteSiteModalLabel[1].label
									: SettingsLabel[11].label}
							</h3>
							<div tw="mt-2">
								<p tw="text-sm leading-5 text-gray-500">
									{Object.keys(successMsg).length > 0
										? successMsg[0]
										: Object.keys(errorMsg).length > 0
										? errorMsg[0]
										: SettingsLabel[11].description}
								</p>
							</div>
						</div>
					</div>
					<div css={[Object.keys(successMsg).length > 0 ? tw`hidden` : tw`mt-5 sm:mt-4 sm:flex sm:flex-row-reverse`]}>
						<span tw="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
							<button
								type="button"
								disabled={disableDeleteSite}
								css={[
									tw`cursor-pointer inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-red-600 text-sm leading-5 font-medium text-white shadow-sm sm:text-sm sm:leading-5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ease-in-out duration-150`,
									disableDeleteSite
										? tw`opacity-50 cursor-not-allowed`
										: tw`hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 active:bg-red-700`
								]}
								aria-label="Delete Site"
								onClick={handleSiteDeletion}
							>
								{disableDeleteSite ? SettingsLabel[23].label : SettingsLabel[9].label}
							</button>
						</span>
						<span tw="mt-3 flex w-full sm:mt-0 sm:w-auto">
							<button
								type="button"
								disabled={disableDeleteSite}
								css={[
									tw`cursor-pointer inline-flex justify-center w-full rounded-md border border-gray-300 sm:ml-3 px-4 py-2 bg-white text-sm leading-5 font-medium text-gray-700 shadow-sm sm:text-sm sm:leading-5`,
									disableDeleteSite
										? tw`opacity-50 cursor-not-allowed`
										: tw`hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ease-in-out duration-150`
								]}
								onClick={() => props.setShowModal(!props.showModal)}
							>
								{SettingsLabel[13].label}
							</button>
						</span>
					</div>
				</div>
			</Transition.Child>
		</Transition>
	);
};

DeleteSiteModal.propTypes = {};

export default DeleteSiteModal;
