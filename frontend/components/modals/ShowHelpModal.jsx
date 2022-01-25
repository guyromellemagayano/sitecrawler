import { Transition } from "@headlessui/react";
import { QuestionMarkCircleIcon } from "@heroicons/react/solid";
import useTranslation from "next-translate/useTranslation";
import PropTypes from "prop-types";
import { forwardRef, memo, useCallback, useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ReactHtmlParser from "react-html-parser";
import "twin.macro";

/**
 * Custom function to render the `ShowHelpModal` component
 *
 * @param {object} siteData
 * @param {boolean} showModal
 * @param {function} setShowModal
 */
const ShowHelpModal = ({ siteData = null, showModal = false, setShowModal }, ref) => {
	const [siteVerificationId, setSiteVerificationId] = useState("");
	const [siteUrl, setSiteUrl] = useState("");
	const [copyValue, setCopyValue] = useState("");
	const [htmlCopied, setHtmlCopied] = useState(false);

	// Handle the copy to clipboard functionality
	const handleSiteData = useCallback(async () => {
		if (siteData !== null && Object.keys(siteData)?.length > 0) {
			setSiteVerificationId(siteData?.verification_id ?? null);
			setSiteUrl(siteData?.url ?? null);

			if (typeof copyValue === "string" && copyValue == "") {
				setCopyValue('<meta name="epic-crawl-id" content="' + siteVerificationId + '" />');
			}
		}
	}, [siteData]);

	useEffect(() => {
		handleSiteData();
	}, [handleSiteData]);

	// Handle textarea change
	const handleTextareaChange = ({ copyValue }) => {
		setCopyValue({ copyValue, htmlCopied });
	};

	// Translation
	const { t } = useTranslation();
	const instructionHtmlText = t("sites:instructionHtmlText", { url: siteUrl }, { value: copyValue });
	const pasteContents = t("sites:pasteContents");
	const clickCopyToClipboard = t("sites:clickCopyToClipboard");
	const notSure = t("sites:notSure");
	const doTheFollowing = t("sites:doTheFollowing");
	const copiedText = t("common:copiedText");
	const copyText = t("common:copyText");
	const close = t("common:close");

	return (
		<Transition show={showModal}>
			<div ref={ref} tw="fixed z-50 bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center">
				<Transition.Child
					enter="show-help-modal-first-child-enter"
					enterFrom="show-help-modal-first-child-enter-from"
					enterTo="show-help-modal-first-child-enter-to"
					leave="show-help-modal-first-child-leave"
					leaveFrom="show-help-modal-first-child-leave-from"
					leaveTo="show-help-modal-first-child-leave-to"
				>
					<div tw="fixed inset-0 transition-opacity" aria-hidden="true">
						<div tw="absolute inset-0 bg-gray-500 opacity-75"></div>
					</div>
				</Transition.Child>

				<span tw="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

				<Transition.Child
					enter="show-help-modal-second-child-enter"
					enterFrom="show-help-modal-second-child-enter-from"
					enterTo="show-help-modal-second-child-enter-to"
					leave="show-help-modal-second-child-leave"
					leaveFrom="show-help-modal-second-child-leave-from"
					leaveTo="show-help-modal-second-child-leave-to"
				>
					<div
						aria-labelledby="modal-headline"
						aria-modal="true"
						role="dialog"
						tw="bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden transform transition-all sm:max-w-lg sm:w-full sm:p-6 whitespace-normal"
					>
						<div tw="sm:flex sm:items-start">
							<div tw="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 bg-yellow-100">
								<QuestionMarkCircleIcon tw="h-6 w-6 text-yellow-600" />
							</div>
							<div tw="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
								<h3 tw="text-lg leading-6 font-medium text-gray-900">{notSure}</h3>
								<div tw="mt-2 max-w-full text-sm leading-5 text-gray-800">
									<p tw="italic mb-3">{doTheFollowing}</p>
									<ol tw="mt-8 mb-3 text-left list-decimal space-y-3">
										<li tw="ml-4 text-sm leading-6 text-gray-800">
											{ReactHtmlParser(clickCopyToClipboard)}
											<br tw="mb-2" />
											<textarea
												disabled={true}
												name="verify_site_instructions"
												id="instructions"
												tw="h-56 resize-none block w-full p-3 pb-0 mb-3 text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 rounded-md sm:text-sm border-gray-300"
												value={instructionHtmlText}
												onChange={handleTextareaChange}
											></textarea>
											<CopyToClipboard onCopy={() => setHtmlCopied(!htmlCopied)} text={instructionHtmlText}>
												<button tw="cursor-pointer inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
													<span>{htmlCopied ? copiedText : copyText}</span>
												</button>
											</CopyToClipboard>
										</li>
										<li tw="ml-4 text-sm leading-6 text-gray-800">{pasteContents}</li>
									</ol>
								</div>
							</div>
						</div>
						<div tw="mt-5 sm:mt-6">
							<button
								type="button"
								tw="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
								onClick={() => setShowModal(close)}
							>
								{close}
							</button>
						</div>
					</div>
				</Transition.Child>
			</div>
		</Transition>
	);
};

ShowHelpModal.propTypes = {
	setShowModal: PropTypes.func,
	showModal: PropTypes.bool,
	siteData: PropTypes.shape({
		url: PropTypes.string,
		verification_id: PropTypes.number
	})
};

/**
 * Memoized custom `ShowHelpModal` component
 */
export const ForwardRefShowHelpModal = forwardRef(ShowHelpModal);
export const MemoizedShowHelpModal = memo(ForwardRefShowHelpModal);
