import { handleNotificationMessages } from "@helpers/handleNotificationMessages";
import { handleConversionStringToLowercase, handleConversionStringToNumber } from "@utils/convertCase";
import useTranslation from "next-translate/useTranslation";
import { FalllbackNotificationMessage } from "../fallback";

export const PasswordResetNotificationMessage = ({ dispatch, config, setConfig, state, isPasswordReset }) => {
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

	// Password reset translations
	const passwordResetPost200OkSuccessResponse = t("alerts:auth.password.reset.post.200OkSuccessResponse");
	const passwordResetPost201CreatedSuccessResponse = t("alerts:auth.password.reset.post.201CreatedSuccessResponse");
	const passwordResetPost400BadRequestErrorResponse = t("alerts:auth.password.reset.post.400BadRequestErrorResponse");
	const passwordResetPost401UnauthorizedErrorResponse = t(
		"alerts:auth.password.reset.post.401UnauthorizedErrorResponse"
	);
	const passwordResetPost403ForbiddenErrorResponse = t("alerts:auth.password.reset.post.403ForbiddenErrorResponse");
	const passwordResetPost404NotFoundErrorResponse = t("alerts:auth.password.reset.post.404NotFoundErrorResponse");
	const passwordResetPost429TooManyRequestsErrorResponse = t(
		"alerts:auth.password.reset.post.201CreatedSuccessResponse"
	);
	const passwordResetPost500InternalServerErrorResponse = t(
		"alerts:auth.password.reset.post.500InternalServerErrorResponse"
	);
	const passwordResetPost502BadGatewayErrorResponse = t("alerts:auth.password.reset.post.502BadGatewayErrorResponse");
	const passwordResetPost503ServiceUnavailableErrorResponse = t(
		"alerts:auth.password.reset.post.503ServiceUnavailableErrorResponse"
	);
	const passwordResetPost504GatewayTimeoutErrorResponse = t(
		"alerts:auth.password.reset.post.504GatewayTimeoutErrorResponse"
	);

	let responsesArray = [];

	const postResponse = {
		method: "POST",
		responses: [
			{
				status: 200,
				title: fallback200OkSuccessResponse,
				message: passwordResetPost200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: passwordResetPost201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: passwordResetPost400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: passwordResetPost401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: passwordResetPost403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: passwordResetPost404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: passwordResetPost429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: passwordResetPost500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: passwordResetPost502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: passwordResetPost503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: passwordResetPost504GatewayTimeoutErrorResponse,
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
		isPasswordReset,
		data,
		fallback
	});
};

export const PasswordResetConfirmNotificationMessage = ({
	dispatch,
	config,
	setConfig,
	state,
	isPasswordResetConfirm
}) => {
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

	// Password reset confirm translations
	const passwordResetConfirmPost200OkSuccessResponse = t(
		"alerts:auth.password.reset.confirm.post.200OkSuccessResponse"
	);
	const passwordResetConfirmPost201CreatedSuccessResponse = t(
		"alerts:auth.password.reset.confirm.post.201CreatedSuccessResponse"
	);
	const passwordResetConfirmPost400BadRequestErrorResponse = t(
		"alerts:auth.password.reset.confirm.post.400BadRequestErrorResponse"
	);
	const passwordResetConfirmPost401UnauthorizedErrorResponse = t(
		"alerts:auth.password.reset.confirm.post.401UnauthorizedErrorResponse"
	);
	const passwordResetConfirmPost403ForbiddenErrorResponse = t(
		"alerts:auth.password.reset.confirm.post.403ForbiddenErrorResponse"
	);
	const passwordResetConfirmPost404NotFoundErrorResponse = t(
		"alerts:auth.password.reset.confirm.post.404NotFoundErrorResponse"
	);
	const passwordResetConfirmPost429TooManyRequestsErrorResponse = t(
		"alerts:auth.password.reset.confirm.post.201CreatedSuccessResponse"
	);
	const passwordResetConfirmPost500InternalServerErrorResponse = t(
		"alerts:auth.password.reset.confirm.post.500InternalServerErrorResponse"
	);
	const passwordResetConfirmPost502BadGatewayErrorResponse = t(
		"alerts:auth.password.reset.confirm.post.502BadGatewayErrorResponse"
	);
	const passwordResetConfirmPost503ServiceUnavailableErrorResponse = t(
		"alerts:auth.password.reset.confirm.post.503ServiceUnavailableErrorResponse"
	);
	const passwordResetConfirmPost504GatewayTimeoutErrorResponse = t(
		"alerts:auth.password.reset.confirm.post.504GatewayTimeoutErrorResponse"
	);

	let responsesArray = [];

	const postResponse = {
		method: "POST",
		responses: [
			{
				status: 200,
				title: fallback200OkSuccessResponse,
				message: passwordResetConfirmPost200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: passwordResetConfirmPost201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: passwordResetConfirmPost400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: passwordResetConfirmPost401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: passwordResetConfirmPost403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: passwordResetConfirmPost404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: passwordResetConfirmPost429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: passwordResetConfirmPost500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: passwordResetConfirmPost502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: passwordResetConfirmPost503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: passwordResetConfirmPost504GatewayTimeoutErrorResponse,
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
		isPasswordResetConfirm,
		data,
		fallback
	});
};

export const PasswordChangeNotificationMessage = ({ dispatch, config, setConfig, state, isPasswordChange }) => {
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

	// Password change translations
	const passwordChangePost200OkSuccessResponse = t("alerts:auth.password.change.post.200OkSuccessResponse");
	const passwordChangePost201CreatedSuccessResponse = t("alerts:auth.password.change.post.201CreatedSuccessResponse");
	const passwordChangePost400BadRequestErrorResponse = t("alerts:auth.password.change.post.400BadRequestErrorResponse");
	const passwordChangePost401UnauthorizedErrorResponse = t(
		"alerts:auth.password.change.post.401UnauthorizedErrorResponse"
	);
	const passwordChangePost403ForbiddenErrorResponse = t("alerts:auth.password.change.post.403ForbiddenErrorResponse");
	const passwordChangePost404NotFoundErrorResponse = t("alerts:auth.password.change.post.404NotFoundErrorResponse");
	const passwordChangePost429TooManyRequestsErrorResponse = t(
		"alerts:auth.password.change.post.201CreatedSuccessResponse"
	);
	const passwordChangePost500InternalServerErrorResponse = t(
		"alerts:auth.password.change.post.500InternalServerErrorResponse"
	);
	const passwordChangePost502BadGatewayErrorResponse = t("alerts:auth.password.change.post.502BadGatewayErrorResponse");
	const passwordChangePost503ServiceUnavailableErrorResponse = t(
		"alerts:auth.password.change.post.503ServiceUnavailableErrorResponse"
	);
	const passwordChangePost504GatewayTimeoutErrorResponse = t(
		"alerts:auth.password.change.post.504GatewayTimeoutErrorResponse"
	);

	let responsesArray = [];

	const postResponse = {
		method: "POST",
		responses: [
			{
				status: 200,
				title: fallback200OkSuccessResponse,
				message: passwordChangePost200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: passwordChangePost201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: passwordChangePost400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: passwordChangePost401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: passwordChangePost403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: passwordChangePost404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: passwordChangePost429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: passwordChangePost500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: passwordChangePost502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: passwordChangePost503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: passwordChangePost504GatewayTimeoutErrorResponse,
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
		isPasswordChange,
		data,
		fallback
	});
};
