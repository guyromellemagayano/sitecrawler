// React
import { useState, useEffect } from "react";

// NextJS
import { useRouter } from "next/router";

// External
import "twin.macro";
import { ExclamationIcon } from "@heroicons/react/solid";
import { Transition } from "@headlessui/react";
import PropTypes from "prop-types";

// Hooks
import useDeleteMethod from "src/hooks/useDeleteMethod";

// Components
import DeleteSiteSkeleton from "src/components/skeletons/DeleteSiteSkeleton";

const DeleteSite = ({ user, siteId, settingsLabel, mutateSite }) => {
	const [componentReady, setComponentReady] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [updateSite, setUpdateSite] = useState(false);

	const siteIdApiEndpoint = "/api/site/" + siteId.id;

	const router = useRouter();

	useEffect(() => {
		if (user && user !== undefined && Object.keys(user).length > 0) {
			setTimeout(() => {
				setComponentReady(true);
			}, 500);
		}
	}, [user]);

	const handleSiteDeletion = async (e) => {
		e.preventDefault();

		const response = await useDeleteMethod(siteIdApiEndpoint);

		if (Math.floor(response.status / 200) === 1) {
			setTimeout(() => {
				setShowModal(!showModal);
			}, 500);

			setUpdateSite(true);
		}
	};

	useEffect(() => {
		if (updateSite) {
			mutateSite;

			setTimeout(() => {
				router.push("/sites");
			}, 1000);
		}
	}, [updateSite]);

	return componentReady ? (
		<div>
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
									onClick={(e) => handleSiteDeletion(e)}
								>
									{settingsLabel[9].label}
								</button>
							</span>
							<span tw="mt-3 flex w-full sm:mt-0 sm:w-auto">
								<button
									type="button"
									tw="cursor-pointer inline-flex justify-center w-full mr-3 rounded-md border border-gray-300 px-4 py-2 shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									onClick={() => setShowModal(!showModal)}
								>
									{settingsLabel[13].label}
								</button>
							</span>
						</div>
					</div>
				</Transition.Child>
			</Transition>

			<div tw="max-w-full p-4">
				<div tw="pt-4 m-auto">
					<h5 tw="text-xl leading-6 font-medium text-gray-900">{settingsLabel[9].label}</h5>
					<p tw="max-w-full mt-2 text-sm leading-5 text-gray-500">{settingsLabel[10].label}</p>
				</div>
			</div>

			<div tw="max-w-full lg:max-w-3xl p-4 pt-0 pb-2">
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
	) : (
		<DeleteSiteSkeleton />
	);
};

DeleteSite.propTypes = {};

export default DeleteSite;
