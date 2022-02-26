import { UserApiEndpoint } from "@constants/ApiEndpoints";
import { Switch } from "@headlessui/react";
import { handlePutMethod } from "@helpers/handleHttpMethods";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import useTranslation from "next-translate/useTranslation";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSWRConfig } from "swr";

/**
 * Custom function to render the `TimestampSettingsForm` component
 */
const TimestampSettingsForm = () => {
	// Translations
	const { t } = useTranslation();
	const timestampSettingsHeadline = t("settings:timestampSettings.headline");
	const timestampSettingsSubheadline = t("settings:timestampSettings.subHeadline");
	const timestampSettingsDisableLocalTime = t("settings:timestampSettings.disableLocalTime");

	// Custom context
	const { isComponentReady, setConfig } = useContext(SiteCrawlerAppContext);

	// SWR hooks
	const {
		user,
		userId,
		username,
		email,
		permissions,
		largePageSizeThreshold,
		disableLocalTime,
		setDisableLocalTime,
		settings
	} = useUser();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	return (
		<div className="space-y-8 divide-y divide-gray-200">
			<div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4">
				<div className="sm:col-span-3">
					<div className="relative flex items-center">
						<div className="absolute flex h-5 items-center">
							{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
								<Switch
									checked={!disableLocalTime}
									onChange={() => {
										setDisableLocalTime(!disableLocalTime);

										// Mutate updated "disabledLocalTime" user setting
										(async () => {
											const body = {
												id: userId,
												username: username,
												email: email,
												permissions: permissions,
												large_page_size_threshold: largePageSizeThreshold,
												settings: {
													disableLocalTime: !disableLocalTime
												}
											};

											const timestampSettingsResponse = await handlePutMethod(UserApiEndpoint, body);
											const timestampSettingsResponseData = timestampSettingsResponse?.data ?? null;
											const timestampSettingsResponseStatus = timestampSettingsResponse?.status ?? null;
											const timestampSettingsResponseMethod = timestampSettingsResponse?.config?.method ?? null;

											if (
												timestampSettingsResponseData !== null &&
												Math.round(timestampSettingsResponseStatus / 200) === 1
											) {
												// Show alert message after successful 200 OK or 201 Created response is issued
												if (!disableLocalTime) {
													setConfig({
														isLocalTimeDisabled: true,
														method: timestampSettingsResponseMethod,
														status: timestampSettingsResponseStatus
													});
												} else {
													setConfig({
														isLocalTimeEnabled: true,
														method: timestampSettingsResponseMethod,
														status: timestampSettingsResponseStatus
													});
												}

												mutate(
													UserApiEndpoint,
													{
														...user,
														data: timestampSettingsResponseData
													},
													false
												);
											} else {
												// Show alert message after unsuccessful 200 OK or 201 Created response is issued
												setConfig({
													isUser: true,
													method: timestampSettingsResponseMethod,
													status: timestampSettingsResponseStatus
												});

												mutate(UserApiEndpoint);
											}
										})();
									}}
									className={classnames(
										!disableLocalTime ? "bg-indigo-600" : "bg-gray-200",
										"relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
									)}
								>
									<span className="sr-only">{timestampSettingsDisableLocalTime}</span>
									<span
										className={classnames(
											!disableLocalTime ? "translate-x-5" : "translate-x-0",
											"pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out"
										)}
									>
										<span
											className={classnames(
												!disableLocalTime ? "opacity-0 duration-100 ease-out" : "opacity-100 duration-200 ease-in",
												"absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
											)}
											aria-hidden="true"
										>
											<svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
												<path
													d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
													stroke="currentColor"
													strokeWidth={2}
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										</span>
										<span
											className={classnames(
												!disableLocalTime ? "opacity-100 duration-200 ease-in" : "opacity-0 duration-100 ease-out",
												"absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
											)}
											aria-hidden="true"
										>
											<svg className="h-3 w-3 text-indigo-600" fill="currentColor" viewBox="0 0 12 12">
												<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
											</svg>
										</span>
									</span>
								</Switch>
							) : (
								<Skeleton duration={2} width={44} height={20} />
							)}
						</div>
						<div className="ml-2 pl-12 text-sm leading-5">
							<label htmlFor="candidates" className="font-medium text-gray-700">
								{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
									timestampSettingsHeadline
								) : (
									<Skeleton duration={2} width={125} height={15} />
								)}
							</label>
							<p className="text-gray-500">
								{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
									timestampSettingsSubheadline
								) : (
									<Skeleton duration={2} width={250} height={15} />
								)}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

/**
 * Memoized custom `TimestampSettingsForm` component
 */
export const MemoizedTimestampSettingsForm = memo(TimestampSettingsForm);
