import { AlertDisplayInterval } from "@constants/GlobalValues";
import { Transition } from "@headlessui/react";
import { CheckCircleIcon, XCircleIcon, XIcon } from "@heroicons/react/outline";
import useTranslation from "next-translate/useTranslation";
import PropTypes from "prop-types";
import { memo, useCallback, useEffect, useState } from "react";
import tw from "twin.macro";

/**
 * Custom function to render the `Alert` component
 *
 * @param {boolean} isSuccess
 * @param {string} responseText
 */
export function Alert({ responseText, isSuccess }) {
	const [isOpen, setIsOpen] = useState(true);

	// Translations
	const { t } = useTranslation();
	const dismiss = t("common:dismiss");

	// Handle the alert close
	const handleAlertClose = useCallback(async () => {
		responseText !== null && typeof responseText !== "undefined"
			? setTimeout(() => {
					setIsOpen(false);
			  }, AlertDisplayInterval)
			: null;

		return () => {
			setIsOpen(false);
		};
	}, [responseText]);

	useEffect(() => {
		handleAlertClose();
	}, [handleAlertClose]);

	return (
		<Transition
			show={isOpen}
			enter="alerts-enter"
			enterFrom="alerts-enter-from"
			enterTo="alerts-enter-to"
			leave="alerts-leave"
			leaveFrom="alerts-leave-from"
			leaveTo="alerts-leave-to"
			css={[tw`max-w-sm origin-top rounded-md shadow p-4 mx-4`, isSuccess ? tw`bg-green-100` : tw`bg-red-100`]}
		>
			<div tw="flex items-start">
				<div tw="flex-shrink-0">
					{isSuccess ? <CheckCircleIcon tw="h-5 w-5 text-green-400" /> : <XCircleIcon tw="h-5 w-5 text-red-400" />}
				</div>
				<div tw="ml-3">
					<p css={[tw`text-sm leading-5 font-medium break-words`, isSuccess ? tw`text-green-800` : tw`text-red-800`]}>
						{responseText}
					</p>
				</div>
				<div tw="ml-auto pl-5">
					<div tw="flex items-start -mx-1.5">
						<button
							type="button"
							css={[
								tw`inline-flex rounded-full px-1 focus:outline-none focus:ring-2 focus:ring-offset-2`,
								isSuccess
									? tw`text-green-500 bg-green-100 hover:bg-green-100  focus:ring-offset-green-50 focus:ring-green-600`
									: tw`text-red-500 bg-red-100 hover:bg-red-100  focus:ring-offset-red-50 focus:ring-red-600`
							]}
							onClick={() => setIsOpen(!isOpen)}
						>
							<span tw="sr-only">{dismiss}</span>
							<XIcon tw="h-4 w-4" />
						</button>
					</div>
				</div>
			</div>
		</Transition>
	);
}

Alert.propTypes = {
	isSuccess: PropTypes.bool,
	responseText: PropTypes.string
};

/**
 * Memoized custom `Alert` component
 */
export const MemoizedAlert = memo(Alert);
