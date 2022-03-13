import { handleNotificationMessages } from "@helpers/handleNotificationMessages";
import { handleConversionStringToLowercase, handleConversionStringToNumber } from "@utils/convertCase";
import useTranslation from "next-translate/useTranslation";
import { FalllbackNotificationMessage } from "../fallback";

export const SupportNotificationMessage = ({ dispatch, config, setConfig, state, isSupport }) => {
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

	// Support translations
	const supportPost200OkSuccessResponse = t("alerts:support.post.200OkSuccessResponse");
	const supportPost201CreatedSuccessResponse = t("alerts:support.post.201CreatedSuccessResponse");
	const supportPost400BadRequestErrorResponse = t("alerts:support.post.400BadRequestErrorResponse");
	const supportPost401UnauthorizedErrorResponse = t("alerts:support.post.401UnauthorizedErrorResponse");
	const supportPost403ForbiddenErrorResponse = t("alerts:support.post.403ForbiddenErrorResponse");
	const supportPost404NotFoundErrorResponse = t("alerts:support.post.404NotFoundErrorResponse");
	const supportPost429TooManyRequestsErrorResponse = t("alerts:support.post.201CreatedSuccessResponse");
	const supportPost500InternalServerErrorResponse = t("alerts:support.post.500InternalServerErrorResponse");
	const supportPost502BadGatewayErrorResponse = t("alerts:support.post.502BadGatewayErrorResponse");
	const supportPost503ServiceUnavailableErrorResponse = t("alerts:support.post.503ServiceUnavailableErrorResponse");
	const supportPost504GatewayTimeoutErrorResponse = t("alerts:support.post.504GatewayTimeoutErrorResponse");

	let responsesArray = [];

	const postResponse = {
		method: "POST",
		responses: [
			{
				status: 200,
				title: fallback200OkSuccessResponse,
				message: supportPost200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: supportPost201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: supportPost400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: supportPost401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: supportPost403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: supportPost404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: supportPost429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: supportPost500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: supportPost502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: supportPost503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: supportPost504GatewayTimeoutErrorResponse,
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
		isSupport,
		data,
		fallback
	});
};
