import { NotificationDisplayInterval } from "@constants/GlobalValues";
import { Transition } from "@headlessui/react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";
import { classnames } from "@utils/classnames";
import useTranslation from "next-translate/useTranslation";
import PropTypes from "prop-types";
import { Fragment, memo, useEffect, useState } from "react";

/**
 * Custom function to render the "Alert" component
 *
 * @param {boolean} isSuccess
 * @param {string} responseText
 */
const Alert = ({ responseText = null, isSuccess = false }) => {
	const [isOpen, setIsOpen] = useState(true);

	// Translations
	const { t } = useTranslation();
	const dismiss = t("common:dismiss");

	// Handle the alert close
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
			<div
				className={classnames(
					"rounded-lg p-4 shadow-sm ring-1 ring-opacity-5",
					isSuccess ? "bg-green-50 ring-green-50" : "bg-red-50 ring-red-50"
				)}
			>
				<div className="flex">
					<div className="flex-shrink-0">
						{isSuccess ? (
							<CheckCircleIcon className="h-4 w-4 text-green-400" aria-hidden="true" />
						) : (
							<XCircleIcon className="h-4 w-4 text-red-400" aria-hidden="true" />
						)}
					</div>
					<div className="ml-3">
						<p className={classnames("break-words text-sm font-medium", isSuccess ? "text-green-800" : "text-red-800")}>
							{responseText}
						</p>
					</div>
					<div className="ml-auto pl-3">
						<div className="-mx-1.5 -my-1.5">
							<button
								type="button"
								className={classnames(
									"inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2",
									isSuccess
										? "bg-green-50 text-green-500 hover:bg-green-100  focus:ring-green-600 focus:ring-offset-green-50"
										: "bg-red-50 text-red-500 hover:bg-red-100  focus:ring-red-600 focus:ring-offset-red-50"
								)}
								onClick={() => setIsOpen(false)}
							>
								<span className="sr-only">{dismiss}</span>
								<XIcon className="h-4 w-4" aria-hidden="true" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	);
};

Alert.propTypes = {
	isSuccess: PropTypes.bool,
	responseText: PropTypes.string
};

/**
 * Memoized custom "Alert" component
 */
export const MemoizedAlert = memo(Alert);
