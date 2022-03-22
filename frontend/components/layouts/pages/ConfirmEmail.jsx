import { MemoizedLogoLabel } from "@components/labels/LogoLabel";
import { ConfirmEmailApiEndpoint, UserApiEndpoint } from "@constants/ApiEndpoints";
import { LoginLink } from "@constants/PageLinks";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import { classnames } from "@utils/classnames";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useEffect, useMemo, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { useSWRConfig } from "swr";

/**
 * Custom function to render the "ConfirmEmailPageLayout" component
 */
const ConfirmEmailPageLayout = () => {
	const [success, setSuccess] = useState(false);
	const [failure, setFailure] = useState(false);
	const [errorMessage, setErrorMessage] = useState([]);
	const [successMessage, setSuccessMessage] = useState([]);

	// Router
	const { asPath, query } = useRouter();
	const router = useRouter();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Translations
	const { t } = useTranslation();
	const confirmEmailFailed = t("confirmEmail:confirmEmailFailed");
	const confirmEmailSuccess = t("confirmEmail:confirmEmailSuccess");
	const fallbackUnknownResponse = t("alerts:fallback.unknownResponse.message");
	const confirmEmailPost201CreatedSuccessResponse = t("alerts:auth.confirmEmail.post.201CreatedSuccessResponse");
	const confirmEmailPost400BadRequestErrorResponse = t("alerts:auth.confirmEmail.post.400BadRequestErrorResponse");
	const confirmEmailPost401UnauthorizedErrorResponse = t("alerts:auth.confirmEmail.post.401UnauthorizedErrorResponse");
	const confirmEmailPost403ForbiddenErrorResponse = t("alerts:auth.confirmEmail.post.403ForbiddenErrorResponse");
	const confirmEmailPost404NotFoundErrorResponse = t("alerts:auth.confirmEmail.post.404NotFoundErrorResponse");
	const confirmEmailPost429TooManyRequestsErrorResponse = t(
		"alerts:auth.confirmEmail.post.429TooManyRequestsErrorResponse"
	);
	const confirmEmailPost500InternalServerErrorResponse = t(
		"alerts:auth.confirmEmail.post.500InternalServerErrorResponse"
	);
	const confirmEmailPost502BadGatewayErrorResponse = t("alerts:auth.confirmEmail.post.502BadGatewayErrorResponse");
	const confirmEmailPost503ServiceUnavailableErrorResponse = t(
		"alerts:auth.confirmEmail.post.503ServiceUnavailableErrorResponse"
	);
	const confirmEmailPost504GatewayTimeoutErrorResponse = t(
		"alerts:auth.confirmEmail.post.504GatewayTimeoutErrorResponse"
	);
	const goBackLogin = t("common:goBackLogin");
	const loaderMessage = t("common:loaderMessage");
	const reloadPage = t("common:reloadPage");

	const handleConfirmEmail = useMemo(async () => {
		const body = {
			key: query?.id[0] ?? null
		};

		const confirmEmailResponse = await handlePostMethod(ConfirmEmailApiEndpoint, body);
		const confirmEmailResponseData = confirmEmailResponse.data ?? null;
		const confirmEmailResponseStatus = confirmEmailResponse.status ?? null;

		if (confirmEmailResponseData !== null && Math.round(confirmEmailResponseStatus / 200) === 1) {
			// Mutate "user" endpoint after successful 200 OK or 201 Created response is issued
			mutate(UserApiEndpoint);

			// Update "successMessage" and "success" states with an actual success message as soon as 200 OK or 201 Created response is issued
			setSuccessMessage((prevState) => [
				...prevState,
				prevState.indexOf(confirmEmailPost201CreatedSuccessResponse) !== -1
					? prevState.find((prevState) => prevState === confirmEmailPost201CreatedSuccessResponse)
					: confirmEmailPost201CreatedSuccessResponse
			]);
			setSuccess(true);
		} else {
			// Update "errorMessage" and "error" states with an actual success message as soon as an error response is issued
			let errorStatusCodeMessage = "";

			switch (confirmEmailResponseStatus) {
				case 400:
					errorStatusCodeMessage = confirmEmailPost400BadRequestErrorResponse;
					break;
				case 401:
					errorStatusCodeMessage = confirmEmailPost401UnauthorizedErrorResponse;
					break;
				case 403:
					errorStatusCodeMessage = confirmEmailPost403ForbiddenErrorResponse;
					break;
				case 404:
					errorStatusCodeMessage = confirmEmailPost404NotFoundErrorResponse;
					break;
				case 429:
					errorStatusCodeMessage = confirmEmailPost429TooManyRequestsErrorResponse;
					break;
				case 500:
					errorStatusCodeMessage = confirmEmailPost500InternalServerErrorResponse;
					break;
				case 502:
					errorStatusCodeMessage = confirmEmailPost502BadGatewayErrorResponse;
					break;
				case 503:
					errorStatusCodeMessage = confirmEmailPost503ServiceUnavailableErrorResponse;
					break;
				case 504:
					errorStatusCodeMessage = confirmEmailPost504GatewayTimeoutErrorResponse;
					break;
				default:
					errorStatusCodeMessage = fallbackUnknownResponse;
					break;
			}

			setErrorMessage((prevState) => [
				...prevState,
				prevState.indexOf(errorStatusCodeMessage) !== -1
					? prevState.find((prevState) => prevState === errorStatusCodeMessage)
					: errorStatusCodeMessage
			]);
			setFailure(true);
		}
	}, [asPath, query]);

	useEffect(() => {
		let isMounted = true;

		if (isMounted) {
			handleConfirmEmail;
		}

		return () => {
			isMounted = false;
		};
	}, [handleConfirmEmail]);

	return (
		<div className="h-screen overflow-auto bg-gray-50">
			<Scrollbars autoHide universal>
				<div className="flex h-full flex-col justify-center">
					<div className="relative py-12 sm:px-6 lg:px-8">
						<MemoizedLogoLabel isConfirmEmail />

						<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
							<div className="rounded-lg bg-white py-8 px-4 shadow-xl sm:px-10">
								<h3
									className={classnames(
										"text-lg font-medium leading-6",
										success ? "text-green-900" : failure ? "text-red-900" : "text-gray-500"
									)}
								>
									{success ? (
										confirmEmailSuccess
									) : failure ? (
										confirmEmailFailed
									) : (
										<span className="block text-center">{loaderMessage}</span>
									)}
								</h3>
								{success &&
								typeof successMessage !== "undefined" &&
								successMessage !== null &&
								successMessage !== [] &&
								successMessage.length > 0 ? (
									<div className="mt-3 text-sm leading-5 text-gray-500">
										{successMessage.map((value, key) => (
											<p key={key}>{value}</p>
										))}
										<div className="mt-5">
											<Link href={LoginLink} passHref replace>
												<a
													className={classnames(
														success &&
															typeof successMessage !== "undefined" &&
															successMessage !== null &&
															successMessage !== [] &&
															successMessage.length > 0
															? "inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
															: "hidden"
													)}
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
									<div className="mt-3 text-sm leading-5 text-gray-500">
										{errorMessage.map((value, key) => (
											<p key={key}>{value}</p>
										))}
										<div className="mt-5">
											<button
												type="button"
												className={classnames(
													failure &&
														typeof errorMessage !== "undefined" &&
														errorMessage !== null &&
														errorMessage !== [] &&
														errorMessage.length > 0
														? "inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-sm"
														: "hidden"
												)}
												onClick={(e) => router.reload()}
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
};

/**
 * Memoized custom "ConfirmEmailPageLayout" component
 */
export const MemoizedConfirmEmailPageLayout = memo(ConfirmEmailPageLayout);
