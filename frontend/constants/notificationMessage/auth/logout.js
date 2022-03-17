import { handleNotificationMessages } from "@helpers/handleNotificationMessages";
import { handleConversionStringToLowercase, handleConversionStringToNumber } from "@utils/convertCase";

export const LogoutNotificationMessage = ({
	locales,
	fallback,
	dispatch,
	config,
	setConfig,
	state,
	isLogout,
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
				message: locales.logoutPost200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback.createdSuccessResponse,
				message: locales.logoutPost201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback.badRequestErrorResponse,
				message: locales.logoutPost400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback.unauthorizedErrorResponse,
				message: locales.logoutPost401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback.forbiddenErrorResponse,
				message: locales.logoutPost403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback.notFoundErrorResponse,
				message: locales.logoutPost404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback.tooManyRequestsErrorResponse,
				message: locales.logoutPost429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback.internalServerErrorResponse,
				message: locales.logoutPost500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback.badGatewayErrorResponse,
				message: locales.logoutPost502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback.serviceUnavailableErrorResponse,
				message: locales.logoutPost503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback.gatewayTimeoutErrorResponse,
				message: locales.logoutPost504GatewayTimeoutErrorResponse,
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
		isLogout,
		data,
		fallback
	});
};
