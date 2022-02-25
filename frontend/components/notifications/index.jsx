import { NotificationDisplayInterval } from "@constants/GlobalValues";
import { Transition } from "@headlessui/react";
import { CheckCircleIcon, XCircleIcon, XIcon } from "@heroicons/react/outline";
import useTranslation from "next-translate/useTranslation";
import PropTypes from "prop-types";
import { Fragment, memo, useEffect, useState } from "react";

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
		<Transition
			show={isOpen}
			as={Fragment}
			enter="notifications-enter"
			enterFrom="notifications-enter-from"
			enterTo="notifications-enter-to"
			leave="notifications-leave"
			leaveFrom="notifications-leave-from"
			leaveTo="notifications-leave-to"
		>
			<div className="pointer-events-auto mx-4 w-full max-w-sm origin-top overflow-hidden rounded-lg bg-white p-4 ring-1 ring-black ring-opacity-5">
				<div className="flex items-start">
					<div className="flex-shrink-0">
						{isSuccess ? (
							<CheckCircleIcon className="h-5 w-5 text-green-400" />
						) : (
							<XCircleIcon className="h-5 w-5 text-red-400" />
						)}
					</div>
					<div className="ml-3 w-0 flex-1 pt-0.5">
						<p className="text-sm font-medium text-gray-900">{responseTitle}</p>
						<p className="mt-1 text-sm text-gray-500">{responseText}</p>
					</div>
					<div className="ml-4 flex flex-shrink-0">
						<button
							type="button"
							className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
							onClick={() => setIsOpen(false)}
						>
							<span className="sr-only">{dismiss}</span>
							<XIcon className="h-4 w-4" />
						</button>
					</div>
				</div>
			</div>
		</Transition>
	);
};

Notification.propTypes = {
	isSuccess: PropTypes.bool,
	responseText: PropTypes.string,
	responseTitle: PropTypes.string
};

/**
 * Memoized custom `Notification` component
 */
export const MemoizedNotification = memo(Notification);
