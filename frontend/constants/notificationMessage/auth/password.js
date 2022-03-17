import { handleNotificationMessages } from "@helpers/handleNotificationMessages";
import { handleConversionStringToLowercase, handleConversionStringToNumber } from "@utils/convertCase";

export const PasswordResetNotificationMessage = ({
	locales,
	fallback,
	dispatch,
	config,
	setConfig,
	state,
	isPasswordReset,
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
				message: locales.passwordResetPost200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback.createdSuccessResponse,
				message: locales.passwordResetPost201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback.badRequestErrorResponse,
				message: locales.passwordResetPost400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback.unauthorizedErrorResponse,
				message: locales.passwordResetPost401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback.forbiddenErrorResponse,
				message: locales.passwordResetPost403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback.notFoundErrorResponse,
				message: locales.passwordResetPost404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback.tooManyRequestsErrorResponse,
				message: locales.passwordResetPost429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback.internalServerErrorResponse,
				message: locales.passwordResetPost500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback.badGatewayErrorResponse,
				message: locales.passwordResetPost502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback.serviceUnavailableErrorResponse,
				message: locales.passwordResetPost503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback.gatewayTimeoutErrorResponse,
				message: locales.passwordResetPost504GatewayTimeoutErrorResponse,
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
		isPasswordReset,
		data,
		fallback
	});
};

export const PasswordResetConfirmNotificationMessage = ({
	locales,
	fallback,
	dispatch,
	config,
	setConfig,
	state,
	isPasswordResetConfirm,
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
				message: locales.passwordResetConfirmPost200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback.createdSuccessResponse,
				message: locales.passwordResetConfirmPost201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback.badRequestErrorResponse,
				message: locales.passwordResetConfirmPost400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback.unauthorizedErrorResponse,
				message: locales.passwordResetConfirmPost401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback.forbiddenErrorResponse,
				message: locales.passwordResetConfirmPost403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback.notFoundErrorResponse,
				message: locales.passwordResetConfirmPost404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback.tooManyRequestsErrorResponse,
				message: locales.passwordResetConfirmPost429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback.internalServerErrorResponse,
				message: locales.passwordResetConfirmPost500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback.badGatewayErrorResponse,
				message: locales.passwordResetConfirmPost502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback.serviceUnavailableErrorResponse,
				message: locales.passwordResetConfirmPost503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback.gatewayTimeoutErrorResponse,
				message: locales.passwordResetConfirmPost504GatewayTimeoutErrorResponse,
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
		isPasswordResetConfirm,
		data,
		fallback
	});
};

export const PasswordChangeNotificationMessage = ({
	locales,
	fallback,
	dispatch,
	config,
	setConfig,
	state,
	isPasswordChange,
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
				message: locales.passwordChangePost200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback.createdSuccessResponse,
				message: locales.passwordChangePost201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback.badRequestErrorResponse,
				message: locales.passwordChangePost400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback.unauthorizedErrorResponse,
				message: locales.passwordChangePost401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback.forbiddenErrorResponse,
				message: locales.passwordChangePost403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback.notFoundErrorResponse,
				message: locales.passwordChangePost404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback.tooManyRequestsErrorResponse,
				message: locales.passwordChangePost429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback.internalServerErrorResponse,
				message: locales.passwordChangePost500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback.badGatewayErrorResponse,
				message: locales.passwordChangePost502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback.serviceUnavailableErrorResponse,
				message: locales.passwordChangePost503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback.gatewayTimeoutErrorResponse,
				message: locales.passwordChangePost504GatewayTimeoutErrorResponse,
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
		isPasswordChange,
		data,
		fallback
	});
};
