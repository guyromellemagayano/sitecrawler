import { NotificationDisplayInterval } from "@constants/GlobalValues";
import { Transition } from "@headlessui/react";
import { CheckCircleIcon, XCircleIcon, XIcon } from "@heroicons/react/outline";
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
			enter="transition-opacity duration-75"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="transition-opacity duration-150"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
		>
			<div
				className={classnames(
					"mx-4 max-w-sm origin-top rounded-md p-4 shadow",
					isSuccess ? "bg-green-100" : "bg-red-100"
				)}
			>
				<div className="flex items-start">
					<div className="flex-shrink-0">
						{isSuccess ? (
							<CheckCircleIcon className="h-5 w-5 text-green-400" />
						) : (
							<XCircleIcon className="h-5 w-5 text-red-400" />
						)}
					</div>
					<div className="ml-3">
						<p
							className={classnames(
								"break-words text-sm font-medium leading-5",
								isSuccess ? "text-green-800" : "text-red-800"
							)}
						>
							{responseText}
						</p>
					</div>
					<div className="ml-auto pl-5">
						<div className="-mx-1.5 flex items-start">
							<button
								type="button"
								className={classnames(
									"inline-flex rounded-full px-1 focus:outline-none focus:ring-2 focus:ring-offset-2",
									isSuccess
										? "bg-green-100 text-green-500 hover:bg-green-100  focus:ring-green-600 focus:ring-offset-green-50"
										: "bg-red-100 text-red-500 hover:bg-red-100  focus:ring-red-600 focus:ring-offset-red-50"
								)}
								onClick={() => setIsOpen(false)}
							>
								<span className="sr-only">{dismiss}</span>
								<XIcon className="h-4 w-4" />
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
