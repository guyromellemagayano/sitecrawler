// React
import * as React from "react";

// NextJS
import Link from "next/link";

// Extenal
import "twin.macro";
import { ExclamationIcon } from "@heroicons/react/solid";
import { LinkIcon } from "@heroicons/react/solid";
import { Transition } from "@headlessui/react";
import PropTypes from "prop-types";
import ReactHtmlParser from "react-html-parser";
import Skeleton from "react-loading-skeleton";

// Hooks
import { usePages } from "src/hooks/useSite";

// JSON
import TlsErrorModalLabel from "./labels/TlsErrorModal.json";

const TlsErrorModal = ({ show, setShowModal, siteId, scanObjId }) => {
	const [componentReady, setComponentReady] = React.useState(false);

	const brokenSecurityPageLink = `/site/${siteId}/pages/?tls_total=false`;
	const pageApiEndpoint = `/api/site/${siteId}/scan/${scanObjId}/page/?tls_total=false`;

	const { pages } = usePages({
		endpoint: pageApiEndpoint,
		querySid: siteId,
		scanObjId: scanObjId
	});

	React.useEffect(() => {
		pages && show
			? (() => {
					setComponentReady(false);

					setTimeout(() => {
						setComponentReady(true);
					}, 500);
			  })()
			: null;
	}, [pages, show]);

	const handleHideTlsErrorModal = (e) => {
		return e?.key === "Escape" ? setShowModal(false) : null;
	};

	React.useEffect(() => {
		document.addEventListener("keydown", handleHideTlsErrorModal, true);

		return () => {
			document.removeEventListener("keydown", handleHideTlsErrorModal, true);
		};
	});

	return (
		<Transition
			show={show}
			className="fixed z-50 bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center"
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
							<ExclamationIcon tw="h-6 w-6 text-red-600" aria-hidden="true" />
						</div>
						<div tw="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
							<h3 tw="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
								{TlsErrorModalLabel[0].label}
							</h3>
							<div tw="mt-2">
								<p tw="text-sm leading-5 text-gray-500">{ReactHtmlParser(TlsErrorModalLabel[1].label)}</p>

								<div tw="mt-4 mb-2">
									{pages?.count > 0 && pages?.count < 6 ? (
										pages?.results.map((val, key) => {
											return componentReady ? (
												<div key={key} tw="flex-1 mt-1 flex items-center">
													<LinkIcon tw="flex-shrink h-5 w-5 text-gray-400" />
													<span tw="ml-2 flex-1 w-0">
														<Link
															href="/site/[siteId]/pages/[pageId]/details"
															as={`/site/${siteId}/pages/${val?.id}/details`}
															passHref
														>
															<a tw="mr-3 flex items-center outline-none focus:outline-none text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150">
																<span className="truncate-link">{val?.url}</span>
																&nbsp;
																{val?.count - 1 > 0 ? "+" + parseInt(val?.count - 1) : null}{" "}
																{val?.count - 1 > 1 ? "others" : val?.count - 1 === 1 ? "other" : null}
															</a>
														</Link>
													</span>
												</div>
											) : (
												<div key={key} tw="flex-1 mt-1 flex items-center">
													<Skeleton duration={2} width={150} />
												</div>
											);
										})
									) : pages?.count > 5 ? (
										<div tw="flex-1 flex items-center">
											<LinkIcon tw="flex-shrink h-5 w-5 text-gray-400" />
											<span tw="ml-2 flex-1 w-0">
												<Link href={brokenSecurityPageLink} passHref>
													<a tw="mr-3 flex items-center outline-none focus:outline-none text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150">
														<span className="truncate-link">{pages?.results[0]?.url}</span>
														&nbsp;
														{pages?.count - 1 > 0 ? "+" + parseInt(pages?.count - 1) : null}{" "}
														{pages?.count - 1 > 1 ? "others" : pages?.count - 1 === 1 ? "other" : null}
													</a>
												</Link>
											</span>
										</div>
									) : null}
								</div>
							</div>
						</div>
					</div>
					<div tw="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
						<span tw="flex w-full rounded-md shadow-sm sm:w-auto">
							<Link href={brokenSecurityPageLink} passHref>
								<a tw="cursor-pointer w-full mt-3 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
									{TlsErrorModalLabel[3].label}
								</a>
							</Link>
						</span>
						<span tw="mt-3 flex w-full sm:mt-0 sm:w-auto">
							<button
								type="button"
								tw="cursor-pointer inline-flex justify-center w-full mr-3 rounded-md border border-gray-300 px-4 py-2 shadow-sm text-sm font-medium  text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
								onClick={() => setShowModal(!show)}
							>
								{TlsErrorModalLabel[2].label}
							</button>
						</span>
					</div>
				</div>
			</Transition.Child>
		</Transition>
	);
};

TlsErrorModal.propTypes = {};

export default TlsErrorModal;
