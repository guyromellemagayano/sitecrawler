// React
import * as React from "react";

// External
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import tw from "twin.macro";

// Enums
import { GlobalSettingsLabels } from "@enums/GlobalSettingsLabels";
import { UserApiEndpoint } from "@enums/ApiEndpoints";

// Hooks
import { usePatchMethod } from "@hooks/useHttpMethod";

const TimestampSettingsForm = ({
	componentReady,
	mutateUser,
	setErrorMsg,
	setSuccessMsg,
	user
}) => {
	const handleToggleTimestamp = async (e) => {
		e.preventDefault();

		await updateTimestampSettings(UserApiEndpoint, !user?.settings?.disableLocalTime);
	};

	const updateTimestampSettings = async (endpoint, state) => {
		user.settings.disableLocalTime = state;

		const response = await usePatchMethod(endpoint, user);
		const data = response.data;

		Math.floor(response?.status / 200 === 1)
			? data?.settings?.disableLocalTime
				? setSuccessMsg((successMsg) => [...successMsg, GlobalSettingsLabels[9].label])
				: setSuccessMsg((successMsg) => [...successMsg, GlobalSettingsLabels[10].label])
			: setErrorMsg((errorMsg) => [...errorMsg, GlobalSettingsLabels[11].label]);

		mutateUser(UserApiEndpoint);
	};

	return (
		<div tw="space-y-8 divide-y divide-gray-200">
			<div tw="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-5">
				<div tw="sm:col-span-3">
					{componentReady ? (
						<div tw="relative flex items-center">
							<div tw="absolute flex items-center h-5">
								<span
									role="checkbox"
									tabIndex="0"
									aria-checked={!user?.settings?.disableLocalTime}
									css={[
										tw`relative inline-flex flex-shrink-0 h-6 w-10 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring`,
										!user?.settings?.disableLocalTime ? tw`bg-indigo-600` : tw`bg-gray-200`
									]}
									onClick={handleToggleTimestamp}
								>
									<span
										aria-hidden="true"
										css={[
											tw`relative inline-block h-5 w-5 rounded-full bg-white transform transition ease-in-out duration-200`,
											!user?.settings?.disableLocalTime ? tw`translate-x-4` : tw`translate-x-0`
										]}
									>
										<span
											css={[
												tw`absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`,
												!user?.settings?.disableLocalTime
													? tw`opacity-0 ease-out duration-100`
													: tw`opacity-100 ease-in duration-200`
											]}
										>
											{/* TODO: convert this to SVG component */}
											<svg tw="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
												<path
													d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										</span>
										<span
											css={[
												tw`absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`,
												!user?.settings?.disableLocalTime
													? tw`opacity-100 ease-in duration-200`
													: tw`opacity-0 ease-out duration-100`
											]}
										>
											{/* TODO: convert this to SVG component */}
											<svg tw="h-3 w-3 text-indigo-600" fill="currentColor" viewBox="0 0 12 12">
												<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
											</svg>
										</span>
									</span>
								</span>
							</div>
							<div tw="ml-2 pl-12 text-sm leading-5">
								<label htmlFor="candidates" tw="font-medium text-gray-700">
									{GlobalSettingsLabels[1].label}
								</label>
								<p tw="text-gray-500">{GlobalSettingsLabels[1].description}</p>
							</div>
						</div>
					) : (
						<>
							<div tw="inline-flex space-x-3 my-1 max-w-sm">
								<Skeleton duration={2} width={50} height={40} />
								<span tw="space-y-3">
									<Skeleton duration={2} width={125} height={15} />
									<Skeleton duration={2} width={250} height={15} />
								</span>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

TimestampSettingsForm.propTypes = {
	componentReady: PropTypes.bool,
	disableLocalTime: PropTypes.bool,
	mutateUser: PropTypes.func,
	setErrorMsg: PropTypes.func,
	setSuccessMsg: PropTypes.func
};

TimestampSettingsForm.defaultProps = {
	componentReady: false,
	disableLocalTime: false,
	mutateUser: null,
	setErrorMsg: null,
	setSuccessMsg: null
};

export default TimestampSettingsForm;
