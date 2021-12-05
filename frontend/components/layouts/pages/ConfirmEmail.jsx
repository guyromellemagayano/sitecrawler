/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { MemoizedLogoLabel } from "@components/labels/LogoLabel";
import { ConfirmEmailApiEndpoint, UserApiEndpoint } from "@constants/ApiEndpoints";
import { LoginLink } from "@constants/PageLinks";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import * as Sentry from "@sentry/nextjs";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { useSWRConfig } from "swr";
import tw from "twin.macro";

/**
 * Custom function to render the `ConfirmEmailPageLayout` component
 */
export function ConfirmEmailPageLayout() {
	const [success, setSuccess] = useState(false);
	const [failure, setFailure] = useState(false);
	const [errorMessage, setErrorMessage] = useState([]);
	const [successMessage, setSuccessMessage] = useState([]);

	// Router
	const { asPath } = useRouter();
	const router = useRouter();
	const { query } = useRouter();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Translations
	const { t } = useTranslation();
	const confirmEmailOkSuccess = t("alerts:confirmEmailOkSuccess");
	const confirmEmailUnknownError = t("alerts:confirmEmailUnknownError");
	const loaderMessage = t("common:loaderMessage");
	const confirmEmailSuccess = t("confirmEmail:confirmEmailSuccess");
	const confirmEmailFailed = t("confirmEmail:confirmEmailFailed");
	const goBackLogin = t("common:goBackLogin");
	const reloadPage = t("common:reloadPage");

	const handleConfirmEmail = useCallback(async () => {
		const body = {
			key: query.id[0]
		};

		const confirmEmailResponse = await handlePostMethod(ConfirmEmailApiEndpoint, body);
		const confirmEmailResponseData = confirmEmailResponse.data ?? null;
		const confirmEmailResponseStatus = confirmEmailResponse.status ?? null;

		if (confirmEmailResponseData !== null && Math.round(confirmEmailResponseStatus / 200) === 1) {
			// Mutate `user` endpoint after successful 200 OK or 201 Created response is issued
			mutate(UserApiEndpoint, false);

			// Update `successMessage` and `success` states with an actual success message as soon as 200 OK or 201 Created response is issued
			setSuccessMessage((prevState) => [
				...prevState,
				prevState.indexOf(confirmEmailOkSuccess) !== -1
					? prevState.find((prevState) => prevState === confirmEmailOkSuccess)
					: confirmEmailOkSuccess
			]);
			setSuccess(true);
		} else {
			// Update `errorMessage` and `error` states with an actual success message as soon as an error response is issued
			setErrorMessage((prevState) => [
				...prevState,
				prevState.indexOf(confirmEmailUnknownError) !== -1
					? prevState.find((prevState) => prevState === confirmEmailUnknownError)
					: confirmEmailUnknownError
			]);
			setFailure(true);

			// Capture unknown errors and send to Sentry
			Sentry.configureScope((scope) => {
				scope.setTag("route", asPath);
				scope.setTag("status", confirmEmailResponseStatus);
				scope.setTag(
					"message",
					errorMessage.find((message) => message === confirmEmailUnknownError)
				);
				Sentry.captureException(new Error(confirmEmailResponse));
			});
		}
	}, [asPath, query]);

	useEffect(() => {
		handleConfirmEmail();
	}, [handleConfirmEmail]);

	return (
		<div tw="bg-gray-50 overflow-auto h-screen">
			<Scrollbars universal>
				<div tw="flex flex-col justify-center h-full">
					<div tw="relative py-12 sm:px-6 lg:px-8">
						<MemoizedLogoLabel isConfirmEmail />

						<div tw="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
							<div tw="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
								<h3
									css={[
										tw`text-lg leading-6 font-medium`,
										success ? tw`text-green-900` : failure ? tw`text-red-900` : tw`text-gray-500`
									]}
								>
									{success ? confirmEmailSuccess : failure ? confirmEmailFailed : loaderMessage}
								</h3>
								{success &&
								typeof successMessage !== "undefined" &&
								successMessage !== null &&
								successMessage !== [] &&
								successMessage.length > 0 ? (
									<div tw="mt-3 text-sm leading-5 text-gray-500">
										{successMessage.map((value, key) => (
											<p key={key}>{value}</p>
										))}
										<div tw="mt-5">
											<Link href={LoginLink} passHref replace>
												<a
													css={[
														success &&
														typeof successMessage !== "undefined" &&
														successMessage !== null &&
														successMessage !== [] &&
														successMessage.length > 0
															? tw`inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm`
															: tw`hidden`
													]}
												>
													{goBackLogin}
												</a>
											</Link>
										</div>
									</div>
								) : failure &&
								  typeof errorMessage !== "undefined" &&
								  errorMessage !== null &&
								  errorMessage !== [] &&
								  errorMessage.length > 0 ? (
									<div tw="mt-3 text-sm leading-5 text-gray-500">
										{errorMessage.map((value, key) => (
											<p key={key}>{value}</p>
										))}
										<div tw="mt-5">
											<button
												type="button"
												css={[
													failure &&
													typeof errorMessage !== "undefined" &&
													errorMessage !== null &&
													errorMessage !== [] &&
													errorMessage.length > 0
														? tw`inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm`
														: tw`hidden`
												]}
												onClick={() => router.reload()}
											>
												{reloadPage}
											</button>
										</div>
									</div>
								) : null}
							</div>
						</div>
					</div>
				</div>
			</Scrollbars>
		</div>
	);
}

/**
 * Memoized custom `ConfirmEmailPageLayout` component
 */
export const MemoizedConfirmEmailPageLayout = memo(ConfirmEmailPageLayout);
