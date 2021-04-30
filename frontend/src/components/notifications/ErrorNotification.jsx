// React
import { useEffect } from "react";

// External
import "twin.macro";
import { Transition } from "@headlessui/react";
import { XCircleIcon, XIcon } from "@heroicons/react/solid";
import PropTypes from "prop-types";

const ErrorNotification = ({ errorMsg, errorMsgLoaded, setErrorMsgLoaded, errorMsgTitle }) => {
	const closeNotificationLabel = "Close";
	const dismissNotificationLabel = "Dismiss";

	useEffect(() => {
		if (errorMsgLoaded) {
			setTimeout(() => {
				setErrorMsgLoaded(false);
			}, 4500);
		}
	}, [errorMsgLoaded]);

	return (
		<Transition show={errorMsgLoaded}>
			<div tw="fixed z-50 inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end">
				<Transition.Child
					enter="transform ease-out duration-300 transition"
					enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
					enterTo="translate-y-0 opacity-100 sm:translate-x-0"
					leave="transition ease-in duration-100"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
					className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto overflow-hidden"
				>
					<div tw="p-4">
						<div tw="flex items-start">
							<div tw="flex-shrink-0">
								<XCircleIcon tw="h-6 w-6 text-red-400" />
							</div>
							<div tw="ml-3 w-0 flex-1 pt-0.5">
								<p tw="text-sm font-medium text-red-400">{errorMsgTitle}</p>
								<p tw="mt-1 text-sm text-gray-500">{errorMsg}</p>
								<div tw="mt-2">
									<button
										tw="bg-white rounded-md text-sm font-medium text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
										onClick={() => setErrorMsgLoaded(!errorMsgLoaded)}
									>
										{dismissNotificationLabel}
									</button>
								</div>
							</div>
							<div tw="ml-4 flex-shrink-0 flex">
								<button
									tw="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									onClick={() => setErrorMsgLoaded(!errorMsgLoaded)}
								>
									<span tw="sr-only">{closeNotificationLabel}</span>
									<XIcon tw="h-5 w-5" />
								</button>
							</div>
						</div>
					</div>
				</Transition.Child>
			</div>
		</Transition>
	);
};

export default ErrorNotification;
