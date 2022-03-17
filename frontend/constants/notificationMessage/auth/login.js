import { handleNotificationMessages } from "@helpers/handleNotificationMessages";
import { handleConversionStringToLowercase, handleConversionStringToNumber } from "@utils/convertCase";

export const LoginNotificationMessage = ({
	locales,
	fallback,
	dispatch,
	config,
	setConfig,
	state,
	isLogin,
	isAlert,
	isNotification
}) => {
	let responsesArray = [];

	const postResponse = {
		method: "POST",
		responses: [
			{
				status: 200,
				title: fallback.okSuccessResponse,
				message: locales.loginPost200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback.createdSuccessResponse,
				message: locales.loginPost201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback.badRequestErrorResponse,
				message: locales.loginPost400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback.unauthorizedErrorResponse,
				message: locales.loginPost401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback.forbiddenErrorResponse,
				message: locales.loginPost403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback.notFoundErrorResponse,
				message: locales.loginPost404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback.tooManyRequestsErrorResponse,
				message: locales.loginPost429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback.internalServerErrorResponse,
				message: locales.loginPost500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback.badGatewayErrorResponse,
				message: locales.loginPost502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback.serviceUnavailableErrorResponse,
				message: locales.loginPost503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback.gatewayTimeoutErrorResponse,
				message: locales.loginPost504GatewayTimeoutErrorResponse,
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
		isAlert: isAlert,
		isNotification: isNotification,
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
