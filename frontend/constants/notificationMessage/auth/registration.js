import { handleNotificationMessages } from "@helpers/handleNotificationMessages";
import { handleConversionStringToLowercase, handleConversionStringToNumber } from "@utils/convertCase";
import useTranslation from "next-translate/useTranslation";

export const RegistrationNotificationMessage = ({
	locales,
	fallback,
	dispatch,
	config,
	setConfig,
	state,
	isRegistration,
	isAlert,
	isNotification
}) => {
	// Translations
	const { t } = useTranslation();

	let responsesArray = [];

	const postResponse = {
		method: "POST",
		responses: [
			{
				status: 200,
				title: fallback.okSuccessResponse,
				message: locales.registrationPost200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback.createdSuccessResponse,
				message: locales.registrationPost201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback.badRequestErrorResponse,
				message: locales.registrationPost400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback.unauthorizedErrorResponse,
				message: locales.registrationPost401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback.forbiddenErrorResponse,
				message: locales.registrationPost403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback.notFoundErrorResponse,
				message: locales.registrationPost404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback.tooManyRequestsErrorResponse,
				message: locales.registrationPost429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback.internalServerErrorResponse,
				message: locales.registrationPost500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback.badGatewayErrorResponse,
				message: locales.registrationPost502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback.serviceUnavailableErrorResponse,
				message: locales.registrationPost503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback.gatewayTimeoutErrorResponse,
				message: locales.registrationPost504GatewayTimeoutErrorResponse,
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
		isRegistration,
		data,
		fallback
	});
};
