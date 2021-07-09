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
import ReactHtmlParser from "react-html-parser";
import tw from "twin.macro";

// JSON
import DeleteSiteModalLabel from "./labels/DeleteSiteModal.json";

const DeleteSiteModal = (props) => {
	const [disableDeleteSite, setDisableDeleteSite] = React.useState(false);
	const [errorMsg, setErrorMsg] = React.useState([]);
	const [successMsg, setSuccessMsg] = React.useState([]);
	const [hideButtons, setHideButtons] = React.useState(false);

	const siteIdApiEndpoint = `/api/site/${props.siteId}/`;
	const siteApiEndpoint = `/api/site/`;
	const sitesPage = "/sites";

	const { asPath } = useRouter();
	const router = useRouter();

	const handleHideSiteDeleteModal = (e) => {
		return e?.key === "Escape" ? props.setShowModal(false) : null;
	};

	React.useEffect(() => {
		document.addEventListener("keydown", disableDeleteSite ? null : handleHideSiteDeleteModal, true);

		return () => {
			document.removeEventListener("keydown", disableDeleteSite ? null : handleHideSiteDeleteModal, true);
		};
	}, [disableDeleteSite]);

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
				Math.floor(response?.status / 204) === 1
					? (() => {
							setDisableDeleteSite(false);
							setSuccessMsg((successMsg) => [...successMsg, DeleteSiteModalLabel[7]]);

							asPath.includes("settings")
								? (() => {
										setTimeout(() => {
											props.setShowModal(!props.showModal);
											router.push(sitesPage);
										}, 3000);
								  })()
								: (() => {
										setTimeout(() => {
											props.setShowModal(!props.showModal);
											props.mutateSite(siteApiEndpoint);
										}, 3000);
								  })();
					  })()
					: (() => {
							Sentry.captureException(response);

							setDisableDeleteSite(false);
							setErrorMsg((errorMsg) => [...errorMsg, DeleteSiteModalLabel[3]]);
					  })();
			})
			.catch((error) => {
				Sentry.captureException(error);

				setDisableDeleteSite(false);
				setErrorMsg((errorMsg) => [...errorMsg, DeleteSiteModalLabel[3]]);
			});
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
									{DeleteSiteModalLabel[0].label}
								</h3>
							)}

							{Object.keys(errorMsg).length > 0 ? (
								errorMsg?.map((value, index) => {
									return (
										<div key={index} tw="my-2">
											<p tw="text-sm leading-5 text-gray-500">{value.description}</p>
										</div>
									);
								})
							) : Object.keys(successMsg).length > 0 ? (
								successMsg?.map((value, index) => {
									return (
										<div key={index} tw="my-2">
											<p tw="text-sm leading-5 text-gray-500">{ReactHtmlParser(value.description)}</p>
										</div>
									);
								})
							) : (
								<div tw="my-2">
									<p tw="text-sm leading-5 text-gray-500">{DeleteSiteModalLabel[0].description}</p>
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
										disabled={props.disableDeleteSite}
										css={[
											tw`sm:ml-3 cursor-pointer inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-red-600 text-sm leading-5 font-medium text-white shadow-sm sm:text-sm sm:leading-5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition ease-in-out duration-150`,
											disableDeleteSite
												? tw`opacity-50 cursor-not-allowed`
												: tw`hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 active:bg-red-700`
										]}
										aria-label="Delete Site"
										onClick={handleSiteDeletion}
									>
										{disableDeleteSite ? DeleteSiteModalLabel[4].label : DeleteSiteModalLabel[6].label}
									</button>
								)}

								<button
									type="button"
									disabled={disableDeleteSite}
									css={[
										tw`cursor-pointer inline-flex justify-center w-full rounded-md border border-gray-300 sm:ml-3 px-4 py-2 bg-white text-sm leading-5 font-medium text-gray-700 shadow-sm sm:text-sm sm:leading-5`,
										disableDeleteSite
											? tw`opacity-50 cursor-not-allowed`
											: tw`hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ease-in-out duration-150`
									]}
									onClick={disableDeleteSite ? null : () => props.setShowModal(!props.showModal)}
								>
									{Object.keys(errorMsg).length > 0 ? DeleteSiteModalLabel[5].label : DeleteSiteModalLabel[2].label}
								</button>
							</span>
						</div>
					) : null}
				</div>
			</Transition.Child>
		</Transition>
	);
};

DeleteSiteModal.propTypes = {};

export default DeleteSiteModal;
