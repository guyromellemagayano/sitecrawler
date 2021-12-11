import { RevalidationInterval } from "@constants/GlobalValues";
import { Transition } from "@headlessui/react";
import { ExclamationCircleIcon, InformationCircleIcon, XCircleIcon } from "@heroicons/react/outline";
import { CheckCircleIcon, XIcon } from "@heroicons/react/solid";
import useTranslation from "next-translate/useTranslation";
import PropTypes from "prop-types";
import { memo, useCallback, useEffect, useState } from "react";
import tw from "twin.macro";

/**
 * Custom function to render the `Alert` component
 *
 * @param {boolean} isError
 * @param {boolean} isSuccess
 * @param {boolean} isWarning
 * @param {string} heading
 * @param {string} message
 */
export function Notification({
	isError = false,
	isSuccess = false,
	isWarning = false,
	heading = null,
	message = null
}) {
	const [isOpen, setIsOpen] = useState(true);

	// Translations
	const { t } = useTranslation();
	const close = t("common:close");

	// Handle the closing of the notification
	const handleOnNotificationClose = useCallback(async () => {
		// https://ux.stackexchange.com/questions/85882/for-how-long-should-alerts-be-displayed/85897#85897
		let alertRetentionTime = "";

		heading !== null &&
		typeof heading !== "undefined" &&
		heading !== "" &&
		message !== null &&
		typeof message !== "undefined" &&
		message !== ""
			? (alertRetentionTime = message?.length * 75 + heading?.length * 75)
			: (alertRetentionTime = RevalidationInterval);

		setTimeout(() => {
			return () => {
				setIsOpen(false);
			};
		}, alertRetentionTime);
	}, [heading, message]);

	useEffect(() => {
		handleOnNotificationClose();
	}, [handleOnNotificationClose]);

	return (
		<Transition show={isOpen}>
			<div tw="fixed z-50 inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end">
				<Transition.Child
					enter="notifications-enter"
					enterFrom="notifications-enter-from"
					enterTo="notifications-enter-to"
					leave="notifications-leave"
					leaveFrom="notifications-leave-from"
					leaveTo="notifications-leave-to"
				>
					<div tw="max-w-sm w-full  shadow-lg rounded-lg pointer-events-auto overflow-hidden">
						<div tw="p-4">
							<div tw="flex items-start">
								<div tw="flex-shrink-0">
									{isSuccess ? (
										<CheckCircleIcon tw="h-5 w-5 text-green-400" aria-hidden="true" />
									) : isError ? (
										<XCircleIcon tw="h-5 w-5 text-red-400" aria-hidden="true" />
									) : isWarning ? (
										<ExclamationCircleIcon tw="h-5 w-5 text-yellow-400" aria-hidden="true" />
									) : (
										<InformationCircleIcon tw="h-5 w-5 text-indigo-400" aria-hidden="true" />
									)}
								</div>
								<div tw="ml-3 w-0 flex-1 pt-0.5">
									<p
										css={[
											tw`text-sm font-medium`,
											isSuccess
												? tw`text-green-400`
												: isError
												? tw`text-red-400`
												: isWarning
												? tw`text-yellow-400`
												: tw`text-indigo-400`
										]}
									>
										{heading}
									</p>
									<p tw="mt-1 text-sm text-gray-500">{message}</p>
								</div>
								<div tw="ml-4 flex-shrink-0 flex">
									<button
										tw="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
										onClick={() => setIsOpen(!isOpen)}
									>
										<span tw="sr-only">{close}</span>
										<XIcon tw="h-5 w-5" aria-hidden="true" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</Transition.Child>
			</div>
		</Transition>
	);
}

Notification.propTypes = {
	heading: PropTypes.shape({
		length: PropTypes.number
	}),
	isError: PropTypes.bool,
	isSuccess: PropTypes.bool,
	isWarning: PropTypes.bool,
	message: PropTypes.shape({
		length: PropTypes.number
	})
};

/**
 * Memoized custom `Notification` component
 */
export const MemoizedNotification = memo(Notification);
