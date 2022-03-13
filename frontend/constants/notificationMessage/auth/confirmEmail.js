import { handleNotificationMessages } from "@helpers/handleNotificationMessages";
import { handleConversionStringToLowercase, handleConversionStringToNumber } from "@utils/convertCase";
import useTranslation from "next-translate/useTranslation";
import { FalllbackNotificationMessage } from "../fallback";

export const ConfirmEmailNotificationMessage = ({ dispatch, config, setConfig, state, isConfirmEmail }) => {
	// Fallback translations
	const {
		fallback,
		fallback200OkSuccessResponse,
		fallback201CreatedSuccessResponse,
		fallback204NoContentSuccessResponse,
		fallback400BadRequestErrorResponse,
		fallback401UnauthorizedErrorResponse,
		fallback403ForbiddenErrorResponse,
		fallback404NotFoundErrorResponse,
		fallback429TooManyRequestsErrorResponse,
		fallback500InternalServerErrorResponse,
		fallback502BadGatewayErrorResponse,
		fallback503ServiceUnavailableErrorResponse,
		fallback504GatewayTimeoutErrorResponse
	} = FalllbackNotificationMessage();

	// Translations
	const { t } = useTranslation();

	// Confirm email translations
	const confirmEmailPost200OkSuccessResponse = t("alerts:auth.confirmEmail.post.200OkSuccessResponse");
	const confirmEmailPost201CreatedSuccessResponse = t("alerts:auth.confirmEmail.post.201CreatedSuccessResponse");
	const confirmEmailPost400BadRequestErrorResponse = t("alerts:auth.confirmEmail.post.400BadRequestErrorResponse");
	const confirmEmailPost401UnauthorizedErrorResponse = t("alerts:auth.confirmEmail.post.401UnauthorizedErrorResponse");
	const confirmEmailPost403ForbiddenErrorResponse = t("alerts:auth.confirmEmail.post.403ForbiddenErrorResponse");
	const confirmEmailPost404NotFoundErrorResponse = t("alerts:auth.confirmEmail.post.404NotFoundErrorResponse");
	const confirmEmailPost429TooManyRequestsErrorResponse = t("alerts:auth.confirmEmail.post.201CreatedSuccessResponse");
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

	let responsesArray = [];

	const postResponse = {
		method: "POST",
		responses: [
			{
				status: 200,
				title: fallback200OkSuccessResponse,
				message: confirmEmailPost200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: confirmEmailPost201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: confirmEmailPost400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: confirmEmailPost401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: confirmEmailPost403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: confirmEmailPost404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: confirmEmailPost429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: confirmEmailPost500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: confirmEmailPost502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: confirmEmailPost503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: confirmEmailPost504GatewayTimeoutErrorResponse,
				isSuccess: false
			}
		]
	};

	responsesArray.push(postResponse);

	const dataMethod =
		responsesArray?.find(
			(datum) => handleConversionStringToLowercase(datum.method) === handleConversionStringToLowercase(config.method)
		) ?? null;
	const dataResponse =
		dataMethod?.responses?.find(
			(response) => handleConversionStringToNumber(response.status) === handleConversionStringToNumber(config.status)
		) ?? null;

	let data = {};

	data = {
		method: dataMethod.method,
		...dataResponse
	};

	return handleNotificationMessages({
		dispatch,
		config,
		setConfig,
		state,
		isConfirmEmail,
		data,
		fallback
	});
};
