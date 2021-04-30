// React
import { useState } from "react";

// NextJS
import { useRouter } from "next/router";
import Link from "next/link";

// External
import "twin.macro";
import { ExclamationIcon } from "@heroicons/react/solid";
import { Transition } from "@headlessui/react";
import PropTypes from "prop-types";

// Hooks
import useDeleteMethod from "src/hooks/useDeleteMethod";

const DeleteSite = ({ user, siteId, settingsLabel }) => {
	const [showModal, setShowModal] = useState(false);

	const router = useRouter();

	const deleteSiteSettings = async (endpoint) => {
		const redirectTo = "/";

		try {
			const response = await useDeleteMethod(endpoint);
			const data = await response.data;

			if (Math.floor(response.status / 200) === 1) {
				if (data) {
					router.push(redirectTo);
				}
			} else {
				return null;
			}
		} catch (error) {
			return null;
		}
	};

	const handleSiteDeletion = async () => {
		return await deleteSiteSettings(`/api/site/${siteId.id}/`);
	};

	return (
		<>
			<Transition
				show={showModal}
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
								<ExclamationIcon tw="h-6 w-6 text-red-600" />
							</div>
							<div tw="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
								<h3 tw="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
									{settingsLabel[11].label}
								</h3>
								<div tw="mt-2">
									<p tw="text-sm leading-5 text-gray-500">{settingsLabel[11].description}</p>
								</div>
							</div>
						</div>
						<div tw="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
							<span tw="flex w-full rounded-md shadow-sm sm:w-auto">
								<button
									type="button"
									tw="cursor-pointer w-full mt-3 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
									aria-label="Delete Site"
									onClick={handleSiteDeletion}
								>
									{settingsLabel[9].label}
								</button>
							</span>
							<span tw="mt-3 flex w-full rounded-md shadow-sm sm:ml-3 sm:mt-0 sm:w-auto">
								<button
									type="button"
									tw="cursor-pointer inline-flex justify-center w-full mr-3 rounded-md border border-gray-300 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									onClick={() => setShowModal(!showModal)}
								>
									{settingsLabel[13].label}
								</button>
							</span>
						</div>
					</div>
				</Transition.Child>
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
