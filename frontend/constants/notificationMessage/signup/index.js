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

export const SignupNotificationMessage = ({ dispatch, config, setConfig, state, isSignup }) => {
	// Translations
	const { t } = useTranslation();

	// Signup translations
	const signupPost200OkSuccessResponse = t("alerts:signup.post.200OkSuccessResponse");
	const signupPost201CreatedSuccessResponse = t("alerts:signup.post.201CreatedSuccessResponse");
	const signupPost400BadRequestErrorResponse = t("alerts:signup.post.400BadRequestErrorResponse");
	const signupPost401UnauthorizedErrorResponse = t("alerts:signup.post.401UnauthorizedErrorResponse");
	const signupPost403ForbiddenErrorResponse = t("alerts:signup.post.403ForbiddenErrorResponse");
	const signupPost404NotFoundErrorResponse = t("alerts:signup.post.404NotFoundErrorResponse");
	const signupPost429TooManyRequestsErrorResponse = t("alerts:signup.post.201CreatedSuccessResponse");
	const signupPost500InternalServerErrorResponse = t("alerts:signup.post.500InternalServerErrorResponse");
	const signupPost502BadGatewayErrorResponse = t("alerts:signup.post.502BadGatewayErrorResponse");
	const signupPost503ServiceUnavailableErrorResponse = t("alerts:signup.post.503ServiceUnavailableErrorResponse");
	const signupPost504GatewayTimeoutErrorResponse = t("alerts:signup.post.504GatewayTimeoutErrorResponse");

	let responsesArray = [];

	const postResponse = {
		method: "POST",
		responses: [
			{
				status: 200,
				title: fallback200OkSuccessResponse,
				message: signupPost200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: signupPost201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: signupPost400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: signupPost401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: signupPost403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: signupPost404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: signupPost429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: signupPost500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: signupPost502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: signupPost503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: signupPost504GatewayTimeoutErrorResponse,
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
		isSignup,
		data,
		fallback
	});
};
