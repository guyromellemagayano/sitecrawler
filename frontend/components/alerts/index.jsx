import { RevalidationInterval } from "@constants/GlobalValues";
import { Transition } from "@headlessui/react";
import {
	CheckCircleIcon,
	ExclamationCircleIcon,
	InformationCircleIcon,
	XCircleIcon,
	XIcon
} from "@heroicons/react/outline";
import useTranslation from "next-translate/useTranslation";
import PropTypes from "prop-types";
import { memo, useState } from "react";
import tw from "twin.macro";

/**
 * Custom function to render the `Alert` component
 *
 * @param {boolean} isError
 * @param {boolean} isSuccess
 * @param {boolean} isWarning
 * @param {string} message
 */
export function Alert({ isError = false, isSuccess = false, isWarning = false, message = false }) {
	const [isOpen, setIsOpen] = useState(true);

	const { t } = useTranslation();
	const dismissMessage = t("common:dismissMessage");

	// https://ux.stackexchange.com/questions/85882/for-how-long-should-alerts-be-displayed/85897#85897
	let alertRetentionTime = "";

	message !== null && typeof message !== "undefined"
		? (alertRetentionTime = message?.length * 75)
		: (alertRetentionTime = RevalidationInterval);

	setTimeout(() => {
		setIsOpen(false);
	}, alertRetentionTime);

	return (
		<Transition
			show={isOpen}
			enter="transition-opacity duration-75"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="transition-opacity duration-150"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
			css={[
				tw`max-w-sm z-10 origin-top rounded-md shadow p-4`,
				isSuccess ? tw`bg-green-100` : isError ? tw`bg-red-100` : isWarning ? tw`bg-yellow-100` : tw`bg-indigo-100`
			]}
		>
			<div tw="flex items-start">
				<div tw="flex-shrink-0">
					{isSuccess ? (
						<CheckCircleIcon tw="h-5 w-5 text-green-400" />
					) : isError ? (
						<XCircleIcon tw="h-5 w-5 text-red-400" />
					) : isWarning ? (
						<ExclamationCircleIcon tw="h-5 w-5 text-yellow-400" />
					) : (
						<InformationCircleIcon tw="h-5 w-5 text-indigo-400" />
					)}
				</div>
				<div tw="ml-3">
					<h3
						css={[
							tw`text-sm leading-5 font-medium break-words`,
							isSuccess
								? tw`text-green-800`
								: isError
								? tw`text-red-800`
								: isWarning
								? tw`text-yellow-800`
								: tw`text-indigo-800`
						]}
					>
						{message}
					</h3>
				</div>
				<div tw="ml-auto pl-3">
					<div tw="flex items-center -mx-1.5">
						<button
							type="button"
							css={[
								tw`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2`,
								isSuccess
									? tw`text-green-500 bg-green-100 hover:bg-green-100  focus:ring-offset-green-50 focus:ring-green-600`
									: isError
									? tw`text-red-500 bg-red-100 hover:bg-red-100  focus:ring-offset-red-50 focus:ring-red-600`
									: isWarning
									? tw`text-yellow-500 bg-yellow-100 hover:bg-yellow-100  focus:ring-offset-yellow-50 focus:ring-yellow-600`
									: tw`text-indigo-500 bg-indigo-100 hover:bg-indigo-100  focus:ring-offset-indigo-50 focus:ring-indigo-600`
							]}
							onClick={() => setIsOpen(false)}
						>
							<span tw="sr-only">{dismissMessage}</span>
							<XIcon tw="h-5 w-5" />
						</button>
					</div>
				</div>
			</div>
		</Transition>
	);
}

Alert.propTypes = {
	isError: PropTypes.bool,
	isSuccess: PropTypes.bool,
	isWarning: PropTypes.bool,
	message: PropTypes.bool
};

/**
 * Memoized custom `Alert` component
 */
export const MemoizedAlert = memo(Alert);
