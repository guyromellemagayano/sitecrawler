// React
import { forwardRef, useState } from "react";

// External
import "twin.macro";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { QuestionMarkCircleIcon } from "@heroicons/react/solid";
import { Transition } from "@headlessui/react";
import PropTypes from "prop-types";
import ReactHtmlParser from "react-html-parser";

// Enums
import { VerifyUrlLabels } from "@enums/VerifyUrlLabels";

const ShowHelpModal = forwardRef(
	({ siteData, showModal, setShowModal, copyValue, setCopyValue }, ref) => {
		const [htmlCopied, setHtmlCopied] = useState(false);

		let htmlText =
			"1. Sign in to the administrator account of the following website: " + siteData?.url + "\n\n";
		htmlText +=
			"2. Copy the following meta tag and add it within your website's <head> tag: " +
			"\n" +
			copyValue +
			"\n\n";
		htmlText += "3. Save the changes you made in that file." + "\n\n";
		htmlText += "4. Inform your client that you already made the update to the website.";

		const handleTextareaChange = ({ copyValue }) => {
			setCopyValue({ copyValue, htmlCopied });
		};

		const handleTextAreaCopy = () => {
			setHtmlCopied(true);
		};

		return (
			<Transition show={showModal} as="span">
				<div tw="fixed z-50 bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center">
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
							aria-labelledby="modal-headline"
							aria-modal="true"
							ref={ref}
							role="dialog"
							tw="bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden transform transition-all sm:max-w-lg sm:w-full sm:p-6 whitespace-normal"
						>
							<div tw="sm:flex sm:items-start">
								<div tw="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 bg-yellow-100">
									<QuestionMarkCircleIcon tw="h-6 w-6 text-yellow-600" />
								</div>
								<div tw="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
									<h3 tw="text-lg leading-6 font-medium text-gray-900">
										{VerifyUrlLabels[14].label}
									</h3>
									<div tw="mt-2 max-w-full text-sm leading-5 text-gray-800">
										<p tw="italic mb-3">{VerifyUrlLabels[15].label}</p>
										<ol tw="mt-8 mb-3 text-left list-decimal space-y-3">
											<li tw="ml-4 text-sm leading-6 text-gray-800">
												{ReactHtmlParser(VerifyUrlLabels[16].label)}
												<br tw="mb-2" />
												<textarea
													disabled={true}
													name="verify_site_instructions"
													id="instructions"
													tw="h-56 resize-none block w-full p-3 pb-0 mb-3 text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 rounded-md sm:text-sm border-gray-300"
													value={htmlText}
													onChange={handleTextareaChange}
												></textarea>
												<CopyToClipboard onCopy={handleTextAreaCopy} text={htmlText}>
													<button tw="cursor-pointer inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
														<span>
															{htmlCopied ? VerifyUrlLabels[7].label : VerifyUrlLabels[8].label}
														</span>
													</button>
												</CopyToClipboard>
											</li>
											<li tw="ml-4 text-sm leading-6 text-gray-800">{VerifyUrlLabels[17].label}</li>
										</ol>
									</div>
								</div>
							</div>
							<div tw="mt-5 sm:mt-6">
								<button
									type="button"
									tw="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
									onClick={() => setShowModal(!showModal)}
								>
									{VerifyUrlLabels[25].label}
								</button>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Transition>
		);
	}
);

ShowHelpModal.propTypes = {
	copyValue: PropTypes.string,
	setCopyValue: PropTypes.func,
	setShowModal: PropTypes.func,
	showModal: PropTypes.bool,
	siteData: PropTypes.object
};

ShowHelpModal.defaultProps = {
	copyValue: null,
	setCopyValue: null,
	setShowModal: null,
	showModal: false,
	siteData: null
};

export default ShowHelpModal;
