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

export const RegistrationNotificationMessage = ({ dispatch, config, setConfig, state, isRegistration }) => {
	// Translations
	const { t } = useTranslation();

	// Registration translations
	const registrationPost200OkSuccessResponse = t("alerts:auth.registration.post.200OkSuccessResponse");
	const registrationPost201CreatedSuccessResponse = t("alerts:auth.registration.post.201CreatedSuccessResponse");
	const registrationPost400BadRequestErrorResponse = t("alerts:auth.registration.post.400BadRequestErrorResponse");
	const registrationPost401UnauthorizedErrorResponse = t("alerts:auth.registration.post.401UnauthorizedErrorResponse");
	const registrationPost403ForbiddenErrorResponse = t("alerts:auth.registration.post.403ForbiddenErrorResponse");
	const registrationPost404NotFoundErrorResponse = t("alerts:auth.registration.post.404NotFoundErrorResponse");
	const registrationPost429TooManyRequestsErrorResponse = t("alerts:auth.registration.post.201CreatedSuccessResponse");
	const registrationPost500InternalServerErrorResponse = t(
		"alerts:auth.registration.post.500InternalServerErrorResponse"
	);
	const registrationPost502BadGatewayErrorResponse = t("alerts:auth.registration.post.502BadGatewayErrorResponse");
	const registrationPost503ServiceUnavailableErrorResponse = t(
		"alerts:auth.registration.post.503ServiceUnavailableErrorResponse"
	);
	const registrationPost504GatewayTimeoutErrorResponse = t(
		"alerts:auth.registration.post.504GatewayTimeoutErrorResponse"
	);

	let responsesArray = [];

	const postResponse = {
		method: "POST",
		responses: [
			{
				status: 200,
				title: fallback200OkSuccessResponse,
				message: registrationPost200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: registrationPost201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: registrationPost400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: registrationPost401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: registrationPost403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: registrationPost404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: registrationPost429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: registrationPost500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: registrationPost502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: registrationPost503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: registrationPost504GatewayTimeoutErrorResponse,
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
		isRegistration,
		data,
		fallback
	});
};
