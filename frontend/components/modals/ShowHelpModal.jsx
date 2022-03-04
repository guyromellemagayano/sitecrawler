import { ResetCopyStateTimeout } from "@constants/GlobalValues";
import { Dialog, Transition } from "@headlessui/react";
import { QuestionMarkCircleIcon } from "@heroicons/react/outline";
import { ClipboardIcon } from "@heroicons/react/solid";
import useTranslation from "next-translate/useTranslation";
import { forwardRef, Fragment, memo, useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

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

	// Custom hooks
	const showHelpRef = useRef(null);

	// Handle the copy to clipboard functionality
	useEffect(() => {
		if (siteData !== null) {
			setSiteVerificationId(siteData.verification_id ?? null);
			setSiteUrl(siteData.url ?? null);

			if (siteVerificationId !== null) {
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
			const timeout = setTimeout(() => {
				setCopied(false);
			}, ResetCopyStateTimeout);

			return () => clearTimeout(timeout);
		}
	}, [copied]);

	// Handle close modal
	const handleCloseModal = () => {
		setShowModal(false);
	};

	// Translation
	const { t } = useTranslation();
	const pasteContents = t("sites:pasteContents");
	const clickCopyToClipboard = t("sites:clickCopyToClipboard");
	const notSureText = t("sites:notSure");
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
				className="fixed inset-0 z-50 overflow-y-auto"
				initialFocus={showHelpRef}
				onClose={copied ? () => {} : handleCloseModal}
			>
				<div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
						&#8203;
					</span>

					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					>
						<div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
							<div className="sm:flex sm:items-start">
								<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
									<QuestionMarkCircleIcon className="h-6 w-6 text-yellow-600" aria-hidden="true" />
								</div>
								<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
									<Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
										{notSureText}
									</Dialog.Title>

									<div className="mt-2">
										<Dialog.Description as="p" className="mb-3 text-sm italic text-gray-500">
											{doTheFollowing}
										</Dialog.Description>

										<ol className="mt-8 mb-3 list-decimal space-y-3 text-left">
											<li className="ml-4 text-sm leading-6 text-gray-800">
												{clickCopyToClipboard}
												<br className="mb-2" />
												<textarea
													disabled={true}
													name="verify_site_instructions"
													id="instructions"
													className="mb-3 block h-56 w-full resize-none rounded-md border-gray-300 p-3 pb-0 text-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
													value={instructionHtmlText}
													onChange={handleTextareaChange}
												></textarea>
												<CopyToClipboard onCopy={handleInputCopy} text={instructionHtmlText}>
													<button
														ref={showHelpRef}
														className="inline-flex w-full cursor-pointer items-center justify-center space-x-2 rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
													>
														<ClipboardIcon className="h-4 w-4 text-gray-400" />
														<span>{copied ? copiedText : copyText}</span>
													</button>
												</CopyToClipboard>
											</li>
											<li className="ml-4 text-sm leading-6 text-gray-800">{pasteContents}</li>
										</ol>
									</div>
								</div>
							</div>

							<div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
								<button
									type="button"
									className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
									onClick={handleCloseModal}
									ref={ref}
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
