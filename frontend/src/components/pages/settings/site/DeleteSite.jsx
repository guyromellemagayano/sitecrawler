// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";

// External
import tw from "twin.macro";
import axios from "axios";
import Cookies from "js-cookie";
import { ExclamationIcon } from "@heroicons/react/solid";
import { Transition } from "@headlessui/react";
import PropTypes from "prop-types";

// Components
import DeleteSiteSkeleton from "src/components/skeletons/DeleteSiteSkeleton";

const DeleteSite = ({ user, siteId, settingsLabel, mutateSite }) => {
	const [componentReady, setComponentReady] = React.useState(false);
	const [disableDeleteSite, setDisableDeleteSite] = React.useState(false);
	const [showModal, setShowModal] = React.useState(false);

	const siteIdApiEndpoint = "/api/site/" + siteId.id + "/";
	const sitesPage = "/sites";

	const router = useRouter();

	React.useEffect(() => {
		if (user && user !== undefined && Object.keys(user).length > 0) {
			setTimeout(() => {
				setComponentReady(true);
			}, 500);
		}
	}, [user]);

	const handleSiteDeletion = async (e) => {
		e.preventDefault();

		setDisableDeleteSite(!disableDeleteSite);

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
							setShowModal(!showModal);
							setDisableDeleteSite(!disableDeleteSite);

							mutateSite;
							router.push(sitesPage);
					  })()
					: null;
			})
			.catch((error) => {
				return error?.response;
			});
	};

	return componentReady ? (
		<div>
			{/* TODO: Turn this into a single component */}
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
									{disableDeleteSite ? settingsLabel[23].label : settingsLabel[9].label}
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
							onClick={() => setShowModal(!showModal)}
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
