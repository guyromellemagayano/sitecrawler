// React
import { Transition } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/solid";
// NextJS
import Link from "next/link";
import PropTypes from "prop-types";
import { useEffect } from "react";
import ReactHtmlParser from "react-html-parser";
// External
import "twin.macro";
// JSON
import SiteVerifyModalLabel from "./labels/SiteVerifyModal.json";

const SiteVerifyErrorModal = ({ showModal, handleShowModal }) => {
	const sitesLink = "/sites";

	const handleHideSiteVerifyErrorModal = (e) => {
		return e?.key === "Escape" ? handleShowModal : null;
	};

	useEffect(() => {
		document.addEventListener("keydown", handleHideSiteVerifyErrorModal, true);

		return () => {
			document.removeEventListener("keydown", handleHideSiteVerifyErrorModal, true);
		};
	});

	return (
		<Transition
			show={showModal}
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
						<div tw="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
							<XCircleIcon tw="h-6 w-6 text-red-600" aria-hidden="true" />
						</div>
						<div tw="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
							<h3 tw="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
								{SiteVerifyModalLabel[1].label}
							</h3>
							<div tw="mt-2">
								<p tw="text-sm leading-5 text-gray-500">{ReactHtmlParser(SiteVerifyModalLabel[2].label)}</p>
							</div>
						</div>
					</div>
					<div tw="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
						<span tw="flex w-full rounded-md shadow-sm sm:w-auto">
							<Link href={sitesLink} passHref>
								<a tw="cursor-pointer w-full mt-3 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
									{SiteVerifyModalLabel[4].label}
								</a>
							</Link>
						</span>
						<span tw="mt-3 flex w-full sm:mt-0 sm:w-auto">
							<button
								type="button"
								tw="cursor-pointer inline-flex justify-center w-full mr-3 rounded-md border border-gray-300 px-4 py-2 shadow-sm text-sm font-medium  text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
								onClick={handleShowModal}
							>
								{SiteVerifyModalLabel[3].label}
							</button>
						</span>
					</div>
				</div>
			</Transition.Child>
		</Transition>
	);
};

SiteVerifyErrorModal.propTypes = {
	showModal: PropTypes.bool.isRequired,
	handleShowModal: PropTypes.func.isRequired
};

SiteVerifyErrorModal.defaultProps = {
	showModal: false,
	handleShowModal: null
};

export default SiteVerifyErrorModal;
