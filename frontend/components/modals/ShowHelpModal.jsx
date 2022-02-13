import { ResetCopyStateTimeout } from "@constants/GlobalValues";
import { Dialog, Transition } from "@headlessui/react";
import { ClipboardIcon, QuestionMarkCircleIcon } from "@heroicons/react/solid";
import useTranslation from "next-translate/useTranslation";
import { forwardRef, Fragment, memo, useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import "twin.macro";

/**
 * Custom function to render the `ShowHelpModal` component
 *
 * @param {object} siteData
 * @param {boolean} showModal
 * @param {function} setShowModal
 */
const ShowHelpModal = ({ siteData = null, showModal = false, setShowModal }, ref) => {
	const [siteVerificationId, setSiteVerificationId] = useState(null);
	const [siteUrl, setSiteUrl] = useState(null);
	const [copyValue, setCopyValue] = useState(null);
	const [copied, setCopied] = useState(false);

	// Handle the copy to clipboard functionality
	useEffect(() => {
		if (siteData !== null) {
			setSiteVerificationId(siteData.verification_id ?? null);
			setSiteUrl(siteData.url ?? null);

			if (siteVerificationId !== null) {
				console.log(siteData.verification_id);

				setCopyValue(`<meta name="epic-crawl-id" content="${siteVerificationId}" />`);
			}
		}
	}, [siteData]);

	// Handle textarea change
	const handleTextareaChange = ({ copyValue }) => {
		setCopyValue({ copyValue, copied });
	};

	// Handle input copy
	const handleInputCopy = () => {
		setCopied(true);
	};

	// Reset copied state as soon as the modal is closed
	useEffect(() => {
		if (copied) {
			setTimeout(() => {
				setCopied(false);
			}, ResetCopyStateTimeout);
		}
	}, [copied]);

	// Translation
	const { t } = useTranslation();
	const pasteContents = t("sites:pasteContents");
	const clickCopyToClipboard = t("sites:clickCopyToClipboard");
	const notSure = t("sites:notSure");
	const doTheFollowing = t("sites:doTheFollowing");
	const copiedText = t("common:copiedText");
	const copyText = t("common:copyText");
	const closeText = t("common:close");
	const instruction1 = t("sites:instruction1");
	const instruction2 = t("sites:instruction2");
	const instruction3 = t("sites:instruction3");
	const instruction4 = t("sites:instruction4");

	// Custom variables
	let instructionHtmlText = `1. ${instruction1}: ` + siteUrl + "\n\n";
	instructionHtmlText += `2. ${instruction2}: ` + "\n" + copyValue + "\n\n";
	instructionHtmlText += `3. ${instruction3}.` + "\n\n";
	instructionHtmlText += `4. ${instruction4}` + "\n\n";

	return (
		<Transition.Root show={showModal} as={Fragment}>
			<Dialog
				as="div"
				className="show-help-modal-dialog"
				initialFocus={ref}
				onClose={!copied ? setShowModal : () => {}}
			>
				<div tw="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
					<Transition.Child
						enter="show-help-modal-first-child-enter"
						enterFrom="show-help-modal-first-child-enter-from"
						enterTo="show-help-modal-first-child-enter-to"
						leave="show-help-modal-first-child-leave"
						leaveFrom="show-help-modal-first-child-leave-from"
						leaveTo="show-help-modal-first-child-leave-to"
					>
						<Dialog.Overlay className="show-help-modal-dialog-overlay" />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span tw="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
						&#8203;
					</span>

					<Transition.Child
						as={Fragment}
						enter="show-help-modal-second-child-enter"
						enterFrom="show-help-modal-second-child-enter-from"
						enterTo="show-help-modal-second-child-enter-to"
						leave="show-help-modal-second-child-leave"
						leaveFrom="show-help-modal-second-child-leave-from"
						leaveTo="show-help-modal-second-child-leave-to"
					>
						<div tw="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
							<div tw="sm:flex sm:items-start">
								<div tw="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 bg-yellow-100">
									<QuestionMarkCircleIcon tw="h-6 w-6 text-yellow-600" />
								</div>
								<div tw="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
									<Dialog.Title as="h3" className="show-help-modal-second-child-title">
										{notSure}
									</Dialog.Title>

									<div tw="mt-2">
										<Dialog.Description as="p" className="show-help-modal-second-child-description">
											{doTheFollowing}
										</Dialog.Description>

										<ol tw="mt-8 mb-3 text-left list-decimal space-y-3">
											<li tw="ml-4 text-sm leading-6 text-gray-800">
												{clickCopyToClipboard}
												<br tw="mb-2" />
												<textarea
													disabled={true}
													name="verify_site_instructions"
													id="instructions"
													tw="h-56 resize-none block w-full p-3 pb-0 mb-3 text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 rounded-md sm:text-sm border-gray-300"
													value={instructionHtmlText}
													onChange={handleTextareaChange}
												></textarea>
												<CopyToClipboard onCopy={handleInputCopy} text={instructionHtmlText}>
													<button tw="space-x-2 cursor-pointer justify-center w-full inline-flex items-center shadow-sm px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
														<ClipboardIcon tw="h-5 w-5 text-gray-400" />
														<span>{copied ? copiedText : copyText}</span>
													</button>
												</CopyToClipboard>
											</li>
											<li tw="ml-4 text-sm leading-6 text-gray-800">{pasteContents}</li>
										</ol>
									</div>
								</div>
							</div>

							<div tw="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
								<button
									type="button"
									tw="cursor-pointer inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm text-sm font-medium  text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									onClick={() => setShowModal(!showModal)}
								>
									{closeText}
								</button>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	);
};

/**
 * Memoized custom `ShowHelpModal` component
 */
const ForwardRefShowHelpModal = forwardRef(ShowHelpModal);
export const MemoizedShowHelpModal = memo(ForwardRefShowHelpModal);
