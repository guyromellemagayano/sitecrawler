// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";

// External
import { CheckCircleIcon, ExclamationIcon } from "@heroicons/react/outline";
import { Transition } from "@headlessui/react";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import ReactHtmlParser from "react-html-parser";
import tw from "twin.macro";

// JSON
import ChangeToBasicModalLabel from "./labels/ChangeToBasicModal.json";

const ChangeToBasicModal = (props) => {
	const calendar = require("dayjs/plugin/calendar");
	const timezone = require("dayjs/plugin/timezone");
	const utc = require("dayjs/plugin/utc");

	dayjs.extend(calendar);
	dayjs.extend(utc);
	dayjs.extend(timezone);

	const calendarStrings = {
		lastDay: "[Yesterday], dddd [at] hh:mm:ss A",
		lastWeek: "MMMM DD, YYYY [at] hh:mm:ss A",
		sameDay: "[Today], dddd [at] hh:mm:ss A",
		sameElse: "MMMM DD, YYYY [at] hh:mm:ss A"
	};

	const subscriptionPlansLink = `/settings/subscription-plans/`;

	const router = useRouter();

	const handleDisableDowngradeToBasicPlan = (e) => {
		return e?.key === "Escape"
			? (() => {
					props.setShowModal(false);

					setTimeout(() => {
						props.setErrorMsg([]);
						props.setSuccessMsg([]);
					}, 1000);

					router.push(subscriptionPlansLink);
			  })()
			: null;
	};

	React.useEffect(() => {
		document.addEventListener(
			"keydown",
			props.disableDowngradeToBasicPlan ? null : handleDisableDowngradeToBasicPlan,
			true
		);

		return () => {
			document.removeEventListener(
				"keydown",
				props.disableDowngradeToBasicPlan ? null : handleDisableDowngradeToBasicPlan,
				true
			);
		};
	}, [props.disableDowngradeToBasicPlan]);

	return (
		<Transition
			show={props.showModal}
			tw="fixed z-50 bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center"
		>
			<Transition.Child
				enter="ease-out duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="ease-in duration-200"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<div tw="fixed inset-0 transition-opacity" aria-hidden="true">
					<div tw="absolute inset-0 bg-gray-500 opacity-75"></div>
				</div>
			</Transition.Child>

			<span tw="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

			<Transition.Child
				enter="ease-out duration-300"
				enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
				enterTo="opacity-100 translate-y-0 sm:scale-100"
				leave="ease-in duration-200"
				leaveFrom="opacity-100 translate-y-0 sm:scale-100"
				leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
			>
				<div
					tw="bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden transform transition-all sm:max-w-lg sm:w-full sm:p-6"
					role="dialog"
					aria-modal="true"
					aria-labelledby="modal-headline"
				>
					<div tw="sm:flex sm:items-start">
						<div
							css={[
								tw`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10`,
								Object.keys(props.successMsg).length > 0 ? tw`bg-green-100` : tw`bg-yellow-100`
							]}
						>
							{Object.keys(props.successMsg).length > 0 ? (
								<CheckCircleIcon tw="h-6 w-6 text-green-600" />
							) : (
								<ExclamationIcon tw="h-6 w-6 text-yellow-600" />
							)}
						</div>
						<div tw="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
							{Object.keys(props.errorMsg).length > 0 ? (
								props.errorMsg?.map((value, index) => {
									return (
										<h3 key={index} tw="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
											{value.label}
										</h3>
									);
								})
							) : Object.keys(props.successMsg).length > 0 ? (
								props.successMsg?.map((value, index) => {
									return (
										<h3 key={index} tw="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
											{value.label}
										</h3>
									);
								})
							) : (
								<h3 tw="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
									{ChangeToBasicModalLabel[0].label}
								</h3>
							)}

							{Object.keys(props.errorMsg).length > 0 ? (
								props.errorMsg?.map((value, index) => {
									return (
										<div key={index} tw="my-2">
											<p tw="text-sm leading-5 text-gray-500">{value.description}</p>
										</div>
									);
								})
							) : Object.keys(props.successMsg).length > 0 ? (
								props.successMsg?.map((value, index) => {
									return (
										<div key={index} tw="my-2">
											<p tw="text-sm leading-5 text-gray-500">
												{ReactHtmlParser(value.description)}{" "}
												{!props.disableLocalTime
													? dayjs(props.defaultSubscription?.cancel_at).calendar(null, calendarStrings)
													: dayjs.utc(props.defaultSubscription?.cancel_at).calendar(null, calendarStrings)}
												<span tw="ml-1 font-medium">({!props.disableLocalTime ? dayjs.tz.guess() : "UTC"})</span>
											</p>
										</div>
									);
								})
							) : (
								<div tw="my-2">
									<p tw="text-sm leading-5 text-gray-500">{ChangeToBasicModalLabel[0].description}</p>
								</div>
							)}
						</div>
					</div>

					<div tw="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
						<span tw="flex w-full sm:w-auto">
							{!props.hideButtons ? (
								Object.keys(props.errorMsg).length > 0 ? null : (
									<button
										type="button"
										disabled={props.disableDowngradeToBasicPlan}
										css={[
											tw`sm:ml-3 cursor-pointer inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-yellow-600 text-sm leading-5 font-medium text-white shadow-sm sm:text-sm sm:leading-5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition ease-in-out duration-150`,
											props.disableDowngradeToBasicPlan
												? tw`opacity-50 cursor-not-allowed`
												: tw`hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 active:bg-yellow-700`
										]}
										aria-label="Downgrade to Basic Plan"
										onClick={() =>
											setTimeout(() => {
												props.handleSelectPlan(props.basicPlanId, props.basicPlanName, props.defaultPaymentMethod);
											}, 150)
										}
									>
										{props.disableDowngradeToBasicPlan
											? ChangeToBasicModalLabel[3].label
											: ChangeToBasicModalLabel[5].label}
									</button>
								)
							) : null}

							<button
								type="button"
								disabled={props.disableDowngradeToBasicPlan}
								css={[
									tw`cursor-pointer inline-flex justify-center w-full rounded-md border border-gray-300 sm:ml-3 px-4 py-2 bg-white text-sm leading-5 font-medium text-gray-700 shadow-sm sm:text-sm sm:leading-5`,
									props.disableDowngradeToBasicPlan
										? tw`opacity-50 cursor-not-allowed`
										: tw`hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ease-in-out duration-150`
								]}
								onClick={
									props.disableDowngradeToBasicPlan
										? null
										: () =>
												(() => {
													props.setShowModal(false);

													setTimeout(() => {
														props.setErrorMsg([]);
														props.setSuccessMsg([]);
													}, 1000);

													router.push(subscriptionPlansLink);
												})()
								}
							>
								{ChangeToBasicModalLabel[4].label}
							</button>
						</span>
					</div>
				</div>
			</Transition.Child>
		</Transition>
	);
};

ChangeToBasicModal.propTypes = {};

export default ChangeToBasicModal;
