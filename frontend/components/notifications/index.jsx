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
			enter="transform ease-out duration-300 transition"
			enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
			enterTo="translate-y-0 opacity-100 sm:translate-x-0"
			leave="transition ease-in duration-100"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
		>
			<div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
				<div className="p-4">
					<div className="flex items-start">
						<div className="flex-shrink-0">
							{isSuccess ? (
								<CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
							) : (
								<XCircleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />
							)}
						</div>
						<div className="ml-3 w-0 flex-1 pt-0.5">
							<p className="break-words text-sm font-medium text-gray-900">{responseTitle}</p>
							<p className="mt-1 break-words text-sm text-gray-500">{responseText}</p>
						</div>
						<div className="flex ml-4 flex-shrink-0">
							<button
								type="button"
								className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
								onClick={() => setIsOpen(false)}
							>
								<span className="sr-only">{dismiss}</span>
								<XIcon className="h-5 w-5" aria-hidden="true" />
							</button>
						</div>
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
