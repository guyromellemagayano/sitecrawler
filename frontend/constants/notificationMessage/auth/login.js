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

export const LoginNotificationMessage = ({ dispatch, config, setConfig, state, isLogin }) => {
	// Translations
	const { t } = useTranslation();

	// Login translations
	const loginPost200OkSuccessResponse = t("alerts:auth.login.post.200OkSuccessResponse");
	const loginPost201CreatedSuccessResponse = t("alerts:auth.login.post.201CreatedSuccessResponse");
	const loginPost400BadRequestErrorResponse = t("alerts:auth.login.post.400BadRequestErrorResponse");
	const loginPost401UnauthorizedErrorResponse = t("alerts:auth.login.post.401UnauthorizedErrorResponse");
	const loginPost403ForbiddenErrorResponse = t("alerts:auth.login.post.403ForbiddenErrorResponse");
	const loginPost404NotFoundErrorResponse = t("alerts:auth.login.post.404NotFoundErrorResponse");
	const loginPost429TooManyRequestsErrorResponse = t("alerts:auth.login.post.429TooManyRequestsErrorResponse");
	const loginPost500InternalServerErrorResponse = t("alerts:auth.login.post.500InternalServerErrorResponse");
	const loginPost502BadGatewayErrorResponse = t("alerts:auth.login.post.502BadGatewayErrorResponse");
	const loginPost503ServiceUnavailableErrorResponse = t("alerts:auth.login.post.503ServiceUnavailableErrorResponse");
	const loginPost504GatewayTimeoutErrorResponse = t("alerts:auth.login.post.504GatewayTimeoutErrorResponse");

	let responsesArray = [];

	const postResponse = {
		method: "POST",
		responses: [
			{
				status: 200,
				title: fallback200OkSuccessResponse,
				message: loginPost200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: loginPost201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: loginPost400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: loginPost401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: loginPost403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: loginPost404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: loginPost429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: loginPost500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: loginPost502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: loginPost503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: loginPost504GatewayTimeoutErrorResponse,
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
		isLogin,
		data,
		fallback
	});
};
