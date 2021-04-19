// React
import { useState } from "react";

// NextJS
import Router, { useRouter } from "next/router";

// External
import { Transition } from "@headlessui/react";
import loadable from "@loadable/component";
import Skeleton from "react-loading-skeleton";
import tw from "twin.macro";
import PropTypes from "prop-types";

// Hooks
import useDeleteMethod from "src/hooks/useDeleteMethod";

// Components
const ExclamationSvg = loadable(() => import("src/components/svg/solid/ExclamationSvg"));

const DeleteSite = ({ user, siteId, settingsLabel }) => {
	const [showModal, setShowModal] = useState(false);

	const deleteSiteSettings = async (endpoint) => {
		const redirectTo = "/";

		try {
			const response = await useDeleteMethod(endpoint);
			const data = await response.data;

			if (Math.floor(response.status / 200) === 1) {
				if (data) {
					setTimeout(() => Router.push(redirectTo), 150);
				}
			} else {
				if (data) {
					console.log(data);
				}
			}
		} catch (error) {
			// FIXME: fix error handling
			throw error.message;
		}
	};

	const handleSiteDeletion = async () => {
		return await deleteSiteSettings(`/api/site/${siteId.id}/`);
	};

	return (
		<>
			<Transition show={showModal} className="fixed z-50 inset-0 overflow-y-auto">
				<div tw="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
					<Transition.Child
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
						className="fixed inset-0 transition-opacity"
					>
						<div aria-hidden="true">
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
						tw="inline-block align-bottom bg-white rounded-lg px-4 pt-3 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6"
					>
						<div role="dialog" aria-modal="true" aria-labelledby="modal-headline">
							<div tw="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mb-3">
								<ExclamationSvg className={tw`h-6 w-6 text-red-600`} />
							</div>
							<div tw="text-center">
								<h2 tw="mb-6 text-xl leading-6 font-semibold text-gray-900" id="modal-headline">
									{settingsLabel[11].label}
								</h2>
								<p tw="mb-8 text-sm leading-5 font-normal">{settingsLabel[11].description}</p>

								<button
									type="button"
									tw="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 mb-2 bg-red-600 text-base leading-6 font-medium text-white shadow-sm sm:text-sm sm:leading-5 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
									aria-label="Delete Site"
									onClick={handleSiteDeletion}
								>
									{settingsLabel[9].label}
								</button>
								<button
									type="button"
									tw="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									aria-label="Cancel Delete Site"
									onClick={() =>
										setTimeout(() => {
											setShowModal(!showModal);
										}, 150)
									}
								>
									{settingsLabel[13].label}
								</button>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Transition>

			<div>
				<div tw="px-4 py-5 sm:p-6">
					<div>
						<div>
							<div>
								<h3 tw="text-lg leading-6 font-medium text-gray-900">{settingsLabel[9].label}</h3>
								<p tw="mt-1 text-sm leading-5 text-gray-500">{settingsLabel[10].label}</p>
							</div>
						</div>
					</div>
					<div tw="pt-5 flex justify-between">
						<div tw="flex justify-start">
							<span tw="inline-flex rounded-md shadow-sm">
								<button
									type="button"
									id="siteDeleteModalButton"
									tw="inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
									onClick={() => setTimeout(() => setShowModal(!showModal), 150)}
								>
									{settingsLabel[12].label}
								</button>
							</span>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

DeleteSite.propTypes = {};

export default DeleteSite;
