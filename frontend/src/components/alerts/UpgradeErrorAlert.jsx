// React
import * as React from "react";

// NextJS
import Link from "next/link";

// External
import { ExclamationIcon } from "@heroicons/react/solid";
import { Transition } from "@headlessui/react";
import ReactHtmlParser from "react-html-parser";
import tw from "twin.macro";

const UpgradeErrorAlert = ({ message = "", link = "#" }) => {
	const [isOpen, setIsOpen] = React.useState(false);

	const upgradeMessage =
		"The data you are currently viewing is not available on your current plan. Subscribe to our <strong>Pro</strong> or <strong>Agency</strong> plans so you can view them at any time.";
	const upgradeButtonLabel = "Upgrade Plan";

	React.useEffect(() => {
		setTimeout(() => {
			setIsOpen(true);
		}, 500);

		return () => {
			setIsOpen(true);
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
			tw="max-w-2xl z-0 origin-top transform -translate-y-16 relative right-0 left-0 bottom-0 rounded-md bg-yellow-100 shadow-lg p-4 my-1 mx-auto"
		>
			<span tw="flex">
				<span tw="flex-shrink-0">
					<ExclamationIcon tw="h-5 w-5 text-yellow-400" aria-hidden="true" />
				</span>
				<span tw="ml-3 flex-1 md:flex md:justify-between">
					<p tw="text-sm text-yellow-700">
						{message !== "" && message !== undefined ? message : ReactHtmlParser(upgradeMessage)}
					</p>
					<p tw="mt-3 text-sm md:mt-0 md:ml-6">
						<Link href={link} passHref>
							<a tw="whitespace-nowrap font-medium text-yellow-700 hover:text-yellow-600">
								{upgradeButtonLabel} <span aria-hidden="true">&rarr;</span>
							</a>
						</Link>
					</p>
				</span>
			</span>
		</Transition>
	);
};

export default UpgradeErrorAlert;
