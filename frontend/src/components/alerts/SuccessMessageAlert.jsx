import { RevalidationInterval } from "@enums/GlobalValues";
import { Transition } from "@headlessui/react";
import { CheckCircleIcon, XIcon } from "@heroicons/react/solid";
import useTranslation from "next-translate/useTranslation";
import PropTypes from "prop-types";
import * as React from "react";
import "twin.macro";

export const SuccessMessageAlert = ({ message = "" }) => {
	const [isOpen, setIsOpen] = React.useState(true);

	const { t } = useTranslation("common");
	const dismissMessage = t("dismissMessage");

	React.useEffect(() => {
		setTimeout(() => {
			setIsOpen(false);
		}, RevalidationInterval);

		return () => {
			setIsOpen(false);
		};
	}, []);

	return (
		<Transition
			show={isOpen}
			enter="transition-opacity duration-75"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="transition-opacity duration-150"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
			tw="max-w-2xl z-10 origin-top fixed right-0 left-0 bottom-0 rounded-md bg-green-100 shadow-lg p-4 mt-1 mx-auto mb-10"
		>
			<div tw="flex items-center">
				<div tw="flex-shrink-0">
					<CheckCircleIcon tw="h-5 w-5 text-green-400" />
				</div>
				<div tw="ml-3">
					<h3 tw="text-sm leading-5 font-medium text-green-800 break-words">{message}</h3>
				</div>
				<div tw="ml-auto pl-3">
					<div tw="flex items-center -mx-1.5">
						<button
							type="button"
							tw="inline-flex bg-green-100 rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
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
};

SuccessMessageAlert.propTypes = {
	className: PropTypes.string,
	message: PropTypes.string
};
