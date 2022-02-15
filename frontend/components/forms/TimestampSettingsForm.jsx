import { UserApiEndpoint } from "@constants/ApiEndpoints";
import { Switch } from "@headlessui/react";
import { handlePutMethod } from "@helpers/handleHttpMethods";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import { Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSWRConfig } from "swr";
import tw from "twin.macro";

/**
 * Custom function to render the `TimestampSettingsForm` component
 */
const TimestampSettingsForm = () => {
	// Translations
	const { t } = useTranslation();
	const timestampSettingsHeadline = t("settings:timestampSettings.headline");
	const timestampSettingsSubheadline = t("settings:timestampSettings.subHeadline");

	// Custom context
	const { isComponentReady, setConfig } = useContext(SiteCrawlerAppContext);

	// SWR hooks
	const {
		user,
		userId,
		username,
		email,
		firstname,
		lastname,
		settings,
		permissions,
		group,
		largePageSizeThreshold,
		disableLocalTime,
		setDisableLocalTime
	} = useUser();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	return (
		<div tw="space-y-8 divide-y divide-gray-200">
			<div tw="mt-6 grid grid-cols-1 gap-y-6 gap-x-4">
				<div tw="sm:col-span-3">
					<div tw="relative flex items-center">
						<div tw="absolute flex items-center h-5">
							{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
								<Formik
									enableReinitialize={true}
									initialValues={{
										userId: userId,
										username: username,
										email: email,
										firstname: firstname,
										lastname: lastname,
										settings: settings,
										permissions: permissions,
										group: group,
										largePageSizeThreshold: largePageSizeThreshold
									}}
									onSubmit={(async () => {
										const body = {
											id: userId,
											username: username,
											email: email,
											first_name: firstname,
											last_name: lastname,
											settings: {
												disableLocalTime: disableLocalTime
											},
											permissions: permissions,
											group: group,
											large_page_size_threshold: largePageSizeThreshold
										};

										const timestampSettingsResponse = await handlePutMethod(UserApiEndpoint, body);
										const timestampSettingsResponseData = timestampSettingsResponse?.data ?? null;
										const timestampSettingsResponseStatus = timestampSettingsResponse?.status ?? null;
										const timestampSettingsResponseMethod = timestampSettingsResponse?.config?.method ?? null;

										if (
											timestampSettingsResponseData !== null &&
											Math.round(timestampSettingsResponseStatus / 200) === 1
										) {
											// Mutate `user` endpoint after successful 200 OK or 201 Created response is issued
											await mutate(UserApiEndpoint);

											// Show alert message after successful 200 OK or 201 Created response is issued
											setConfig({
												isLocalTimeEnabled: true,
												method: timestampSettingsResponseMethod,
												status: timestampSettingsResponseStatus
											});
										} else {
											// Show alert message after unsuccessful 200 OK or 201 Created response is issued
											setConfig({
												isLocalTimeDisabled: true,
												method: timestampSettingsResponseMethod,
												status: timestampSettingsResponseStatus
											});
										}
									})()}
								>
									{() => (
										<Switch
											checked={disableLocalTime}
											onChange={setDisableLocalTime}
											css={[
												disableLocalTime ? tw`bg-indigo-600` : tw`bg-gray-200`,
												tw`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
											]}
										>
											<span tw="sr-only">Disable local time</span>
											<span
												css={[
													disableLocalTime ? tw`translate-x-5` : tw`translate-x-0`,
													tw`pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200`
												]}
											>
												<span
													css={[
														disableLocalTime
															? tw`opacity-0 ease-out duration-100`
															: tw`opacity-100 ease-in duration-200`,
														tw`absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`
													]}
													aria-hidden="true"
												>
													<svg tw="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
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
													css={[
														disableLocalTime
															? tw`opacity-100 ease-in duration-200`
															: tw`opacity-0 ease-out duration-100`,
														tw`absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`
													]}
													aria-hidden="true"
												>
													<svg tw="h-3 w-3 text-indigo-600" fill="currentColor" viewBox="0 0 12 12">
														<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
													</svg>
												</span>
											</span>
										</Switch>
									)}
								</Formik>
							) : (
								<Skeleton duration={2} width={44} height={20} />
							)}
						</div>
						<div tw="ml-2 pl-12 text-sm leading-5">
							<label htmlFor="candidates" tw="font-medium text-gray-700">
								{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
									timestampSettingsHeadline
								) : (
									<Skeleton duration={2} width={125} height={15} />
								)}
							</label>
							<p tw="text-gray-500">
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
