import { NotificationDisplayInterval } from "@constants/GlobalValues";
import { Transition } from "@headlessui/react";
import { CheckCircleIcon, XCircleIcon, XIcon } from "@heroicons/react/outline";
import useTranslation from "next-translate/useTranslation";
import PropTypes from "prop-types";
import { memo, useEffect, useState } from "react";

/**
 * Custom function to render the `Notification` component
 *
 * @param {boolean} isSuccess
 * @param {string} responseTitle
 * @param {string} responseText
 */
const Notification = ({ responseTitle = null, responseText = null, isSuccess = false }) => {
	const [isOpen, setIsOpen] = useState(true);

	// Translations
	const { t } = useTranslation();
	const dismiss = t("common:dismiss");

	// Handle the notification close
	useEffect(() => {
		const timeout = setTimeout(() => {
			setIsOpen(false);
		}, NotificationDisplayInterval);

		return () => {
			clearTimeout(timeout);
		};
	});

	return (
		<div aria-live="assertive" tw="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start">
			<div tw="w-full flex flex-col items-center space-y-4 sm:items-end">
				<Transition
					show={isOpen}
					enter="notifications-enter"
					enterFrom="notifications-enter-from"
					enterTo="notifications-enter-to"
					leave="notifications-leave"
					leaveFrom="notifications-leave-from"
					leaveTo="notifications-leave-to"
				>
					<div tw="max-w-sm w-full bg-white rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
						<div tw="p-4">
							<div tw="flex items-start">
								<div tw="flex-shrink-0">
									{isSuccess ? (
										<CheckCircleIcon tw="h-5 w-5 text-green-400" />
									) : (
										<XCircleIcon tw="h-5 w-5 text-red-400" />
									)}
								</div>
								<div tw="ml-3 w-0 flex-1 pt-0.5">
									<p tw="text-sm font-medium text-gray-900">{responseTitle}</p>
									<p tw="mt-1 text-sm text-gray-500">{responseText}</p>
								</div>
								<div tw="ml-4 flex-shrink-0 flex">
									<button
										type="button"
										tw="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
										onClick={() => setIsOpen(false)}
									>
										<span tw="sr-only">{dismiss}</span>
										<XIcon tw="h-4 w-4" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</Transition>
			</div>
		</div>
	);
};

Notification.propTypes = {
	isSuccess: PropTypes.bool,
	responseText: PropTypes.string
};

/**
 * Memoized custom `Notification` component
 */
export const MemoizedNotification = memo(Notification);
