import { RevalidationInterval } from "@configs/GlobalValues";
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
import * as React from "react";
import tw from "twin.macro";

const Alert = ({ isError, isSuccess, isWarning, isInfo, asPath = null, message = null, link = "#" }) => {
	const [isOpen, setIsOpen] = React.useState(true);

	const { t } = useTranslation();
	const loginFailed = t("componentAlerts:loginFailed");
	const loginSuccess = t("componentAlerts:loginSuccess");
	const fallbackErrorMessage = t("componentAlerts:fallbackErrorMessage");
	const fallbackWarningMessage = t("componentAlerts:fallbackWarningMessage");
	const fallbackInfoMessage = t("componentAlerts:fallbackInfoMessage");
	const fallbackSuccessMessage = t("componentAlerts:fallbackSuccessMessage");
	const dismissMessage = t("componentAlerts:dismissMessage");

	let alertMessage = message ?? null;

	switch (asPath) {
		case asPath.includes("/login"):
			if (isSuccess) {
				alertMessage = message !== null ? message : loginSuccess;
			} else if (isError) {
				alertMessage = message !== null ? message : loginFailed;
			} else {
				alertMessage = message;
			}
			break;
		default:
			if (isSuccess) {
				alertMessage = message !== null ? message : fallbackSuccessMessage;
			} else if (isError) {
				alertMessage = message !== null ? message : fallbackErrorMessage;
			} else if (isWarning) {
				alertMessage = message !== null ? message : fallbackWarningMessage;
			} else {
				alertMessage = message !== null ? message : fallbackInfoMessage;
			}
			break;
	}

	React.useEffect(() => {
		setTimeout(() => {
			setIsOpen(false);
		}, RevalidationInterval);

		return isOpen;
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
			css={[
				tw`max-w-2xl z-10 origin-top fixed right-0 left-0 bottom-0 rounded-md shadow-lg p-4 mt-1 mx-auto mb-10`,
				isSuccess ? tw`bg-green-100` : isError ? tw`bg-red-100` : isWarning ? tw`bg-yellow-100` : tw`bg-indigo-100`
			]}
		>
			<div tw="flex items-center">
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
						{alertMessage}
					</h3>
				</div>
				<div tw="ml-auto pl-3">
					<div tw="flex items-center -mx-1.5">
						<button
							type="button"
							css={[
								tw`inline-flex bg-red-100 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2`,
								isSuccess
									? tw`text-green-500 hover:bg-green-100  focus:ring-offset-green-50 focus:ring-green-600`
									: isError
									? tw`text-red-500 hover:bg-red-100  focus:ring-offset-red-50 focus:ring-red-600`
									: isWarning
									? tw`text-yellow-500 hover:bg-yellow-100  focus:ring-offset-yellow-50 focus:ring-yellow-600`
									: tw`text-indigo-500 hover:bg-indigo-100  focus:ring-offset-indigo-50 focus:ring-indigo-600`
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
};

Alert.propTypes = {
	component: PropTypes.string,
	isError: PropTypes.bool,
	isInfo: PropTypes.bool,
	isSuccess: PropTypes.bool,
	isWarning: PropTypes.bool,
	link: PropTypes.string,
	message: PropTypes.string
};

export default Alert;
