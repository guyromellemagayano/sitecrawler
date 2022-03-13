import { handleNotificationMessages } from "@helpers/handleNotificationMessages";
import { handleConversionStringToLowercase, handleConversionStringToNumber } from "@utils/convertCase";
import useTranslation from "next-translate/useTranslation";
import { FalllbackNotificationMessage } from "../fallback";

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

export const LogoutNotificationMessage = ({ dispatch, config, setConfig, state, isLogout }) => {
	// Translations
	const { t } = useTranslation();

	// Logout translations
	const logoutPost200OkSuccessResponse = t("alerts:auth.logout.post.200OkSuccessResponse");
	const logoutPost201CreatedSuccessResponse = t("alerts:auth.logout.post.201CreatedSuccessResponse");
	const logoutPost400BadRequestErrorResponse = t("alerts:auth.logout.post.400BadRequestErrorResponse");
	const logoutPost401UnauthorizedErrorResponse = t("alerts:auth.logout.post.401UnauthorizedErrorResponse");
	const logoutPost403ForbiddenErrorResponse = t("alerts:auth.logout.post.403ForbiddenErrorResponse");
	const logoutPost404NotFoundErrorResponse = t("alerts:auth.logout.post.404NotFoundErrorResponse");
	const logoutPost429TooManyRequestsErrorResponse = t("alerts:auth.logout.post.201CreatedSuccessResponse");
	const logoutPost500InternalServerErrorResponse = t("alerts:auth.logout.post.500InternalServerErrorResponse");
	const logoutPost502BadGatewayErrorResponse = t("alerts:auth.logout.post.502BadGatewayErrorResponse");
	const logoutPost503ServiceUnavailableErrorResponse = t("alerts:auth.logout.post.503ServiceUnavailableErrorResponse");
	const logoutPost504GatewayTimeoutErrorResponse = t("alerts:auth.logout.post.504GatewayTimeoutErrorResponse");

	let responsesArray = [];

	const postResponse = {
		method: "POST",
		responses: [
			{
				status: 200,
				title: fallback200OkSuccessResponse,
				message: logoutPost200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: logoutPost201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: logoutPost400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: logoutPost401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: logoutPost403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: logoutPost404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: logoutPost429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: logoutPost500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: logoutPost502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: logoutPost503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: logoutPost504GatewayTimeoutErrorResponse,
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
		isLogout,
		data,
		fallback
	});
};
