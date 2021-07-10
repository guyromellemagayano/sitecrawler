// React
import * as React from "react";

// JSON
import NewActivePlanModalLabel from "./labels/NewActivePlanModal.json";

// External
import { styled } from "twin.macro";
import { Transition } from "@headlessui/react";

// Components
import AppImage from "src/components/images/AppImage";

const ConfettiBgImgSpan = styled.span`
	background: url("/images/backgrounds/subscription-success-bg.png");
	background-size: cover;
	background-position: top center;
	background-repeat: no-repeat;
	min-height: 10rem;
	width: 100%;
	position: absolute;
	z-index: -1;
`;

const NewActivePlanModal = (props) => {
	const handleHideSiteDeleteModal = (e) => {
		return e?.key === "Escape" ? props.setShowModal(false) : null;
	};

	React.useEffect(() => {
		document.addEventListener("keydown", handleHideSiteDeleteModal, true);

		return () => {
			document.removeEventListener("keydown", handleHideSiteDeleteModal, true);
		};
	});

	return (
		<Transition show={props.showModal} tw="fixed z-50 inset-0 overflow-y-auto">
			<div tw="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
				<Transition.Child
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div tw="fixed inset-0 transition-opacity">
						<div tw="absolute inset-0 bg-gray-500 opacity-75"></div>
					</div>
				</Transition.Child>
				<span tw="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
				&#8203;
				<Transition.Child
					enter="ease-out duration-300"
					enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					enterTo="opacity-100 translate-y-0 sm:scale-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100 translate-y-0 sm:scale-100"
					leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					tw="inline-block align-bottom bg-white rounded-lg px-4 pt-3 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full sm:p-6 lg:p-0"
					role="dialog"
					aria-modal="true"
					aria-labelledby="modal-headline"
				>
					<ConfettiBgImgSpan />

					<div tw="hidden sm:block absolute top-0 right-0 pt-4 pr-4 z-50">
						<button
							type="button"
							tw="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
							aria-label="Close"
							onClick={() =>
								setTimeout(() => {
									props.setShowModal(!props.showModal);
								}, 150)
							}
						>
							<svg tw="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
					<div>
						<AppImage
							src="/images/backgrounds/subscription-success-badge.png"
							alt="badge-modal-img"
							tw="w-full inline-flex justify-center mx-auto mt-12 mb-14"
							width={72}
							height={72}
						/>
						<div tw="text-center sm:mt-3">
							<h2 tw="mb-3 text-3xl leading-6 font-bold text-gray-900" id="modal-headline">
								{NewActivePlanModalLabel[1].label}
							</h2>
							<p tw="mb-6 text-base leading-6 font-semibold">Your {props.updatedPlanName} plan is now active.</p>
							{props.currentSubscriptions &&
								props.currentSubscriptions?.results &&
								props.currentSubscriptions?.results
									.filter((result) => result.id === props.updatedPlanId)
									.map((val, key) => {
										return (
											<div
												key={key}
												tw="mx-auto max-w-md lg:mx-0 lg:max-w-none lg:col-start-1 lg:col-end-3 lg:row-start-2 lg:row-end-3"
											>
												<div tw="h-full flex flex-col">
													<div tw="flex-1 flex flex-col">
														<div tw="flex-1 flex flex-col justify-between p-6 bg-white sm:p-10 lg:p-6 xl:p-6">
															<ul tw="grid grid-cols-2 mb-6">
																{val.features.map((val2, key) => {
																	return (
																		<li key={key} tw="flex items-start my-1">
																			<div tw="flex-shrink-0">
																				<svg
																					tw="h-6 w-6 text-green-500"
																					stroke="currentColor"
																					fill="none"
																					viewBox="0 0 24 24"
																				>
																					<path
																						strokeLinecap="round"
																						strokeLinejoin="round"
																						strokeWidth="2"
																						d="M5 13l4 4L19 7"
																					/>
																				</svg>
																			</div>
																			<p tw="ml-3 text-sm leading-6 font-medium text-gray-500">{val2}</p>
																		</li>
																	);
																})}
															</ul>

															<button
																type="button"
																tw="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-indigo-600 text-base leading-6 font-medium text-white shadow-sm sm:text-sm sm:leading-5 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
																aria-label="Start Crawling"
																onClick={() =>
																	setTimeout(() => {
																		props.setShowModal(!props.showModal);
																	}, 500)
																}
															>
																{NewActivePlanModalLabel[0].label}
															</button>
														</div>
													</div>
												</div>
											</div>
										);
									})}
						</div>
					</div>
				</Transition.Child>
			</div>
		</Transition>
	);
};

NewActivePlanModal.propTypes = {};

export default NewActivePlanModal;
