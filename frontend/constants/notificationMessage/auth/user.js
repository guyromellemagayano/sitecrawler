import { handleNotificationMessages } from "@helpers/handleNotificationMessages";
import { handleConversionStringToLowercase, handleConversionStringToNumber } from "@utils/convertCase";
import useTranslation from "next-translate/useTranslation";
import { FalllbackNotificationMessage } from "../fallback";

export const UserNotificationMessage = ({ dispatch, config, setConfig, state, isUser }) => {
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

	// User translations
	const userDelete200OkSuccessResponse = t("alerts:auth.user.delete.200OkSuccessResponse");
	const userDelete201CreatedSuccessResponse = t("alerts:auth.user.delete.201CreatedSuccessResponse");
	const userDelete204CreatedSuccessResponse = t("alerts:auth.user.delete.201CreatedSuccessResponse");
	const userDelete400BadRequestErrorResponse = t("alerts:auth.user.delete.400BadRequestErrorResponse");
	const userDelete401UnauthorizedErrorResponse = t("alerts:auth.user.delete.401UnauthorizedErrorResponse");
	const userDelete403ForbiddenErrorResponse = t("alerts:auth.user.delete.403ForbiddenErrorResponse");
	const userDelete404NotFoundErrorResponse = t("alerts:auth.user.delete.404NotFoundErrorResponse");
	const userDelete429TooManyRequestsErrorResponse = t("alerts:auth.user.delete.429TooManyRequestsErrorResponse");
	const userDelete500InternalServerErrorResponse = t("alerts:auth.user.delete.500InternalServerErrorResponse");
	const userDelete502BadGatewayErrorResponse = t("alerts:auth.user.delete.502BadGatewayErrorResponse");
	const userDelete503ServiceUnavailableErrorResponse = t("alerts:auth.user.delete.503ServiceUnavailableErrorResponse");
	const userDelete504GatewayTimeoutErrorResponse = t("alerts:auth.user.delete.504GatewayTimeoutErrorResponse");
	const userGet200OkSuccessResponse = t("alerts:auth.user.get.200OkSuccessResponse");
	const userGet201CreatedSuccessResponse = t("alerts:auth.user.get.201CreatedSuccessResponse");
	const userGet400BadRequestErrorResponse = t("alerts:auth.user.get.400BadRequestErrorResponse");
	const userGet401UnauthorizedErrorResponse = t("alerts:auth.user.get.401UnauthorizedErrorResponse");
	const userGet403ForbiddenErrorResponse = t("alerts:auth.user.get.403ForbiddenErrorResponse");
	const userGet404NotFoundErrorResponse = t("alerts:auth.user.get.404NotFoundErrorResponse");
	const userGet429TooManyRequestsErrorResponse = t("alerts:auth.user.get.429TooManyRequestsErrorResponse");
	const userGet500InternalServerErrorResponse = t("alerts:auth.user.get.500InternalServerErrorResponse");
	const userGet502BadGatewayErrorResponse = t("alerts:auth.user.get.502BadGatewayErrorResponse");
	const userGet503ServiceUnavailableErrorResponse = t("alerts:auth.user.get.503ServiceUnavailableErrorResponse");
	const userGet504GatewayTimeoutErrorResponse = t("alerts:auth.user.get.504GatewayTimeoutErrorResponse");
	const userPatch200OkSuccessResponse = t("alerts:auth.user.patch.200OkSuccessResponse");
	const userPatch201CreatedSuccessResponse = t("alerts:auth.user.patch.201CreatedSuccessResponse");
	const userPatch400BadRequestErrorResponse = t("alerts:auth.user.patch.400BadRequestErrorResponse");
	const userPatch401UnauthorizedErrorResponse = t("alerts:auth.user.patch.401UnauthorizedErrorResponse");
	const userPatch403ForbiddenErrorResponse = t("alerts:auth.user.patch.403ForbiddenErrorResponse");
	const userPatch404NotFoundErrorResponse = t("alerts:auth.user.patch.404NotFoundErrorResponse");
	const userPatch429TooManyRequestsErrorResponse = t("alerts:auth.user.patch.429TooManyRequestsErrorResponse");
	const userPatch500InternalServerErrorResponse = t("alerts:auth.user.patch.500InternalServerErrorResponse");
	const userPatch502BadGatewayErrorResponse = t("alerts:auth.user.patch.502BadGatewayErrorResponse");
	const userPatch503ServiceUnavailableErrorResponse = t("alerts:auth.user.patch.503ServiceUnavailableErrorResponse");
	const userPatch504GatewayTimeoutErrorResponse = t("alerts:auth.user.patch.504GatewayTimeoutErrorResponse");
	const userPut200OkSuccessResponse = t("alerts:auth.user.put.200OkSuccessResponse");
	const userPut201CreatedSuccessResponse = t("alerts:auth.user.put.201CreatedSuccessResponse");
	const userPut400BadRequestErrorResponse = t("alerts:auth.user.put.400BadRequestErrorResponse");
	const userPut401UnauthorizedErrorResponse = t("alerts:auth.user.put.401UnauthorizedErrorResponse");
	const userPut403ForbiddenErrorResponse = t("alerts:auth.user.put.403ForbiddenErrorResponse");
	const userPut404NotFoundErrorResponse = t("alerts:auth.user.put.404NotFoundErrorResponse");
	const userPut429TooManyRequestsErrorResponse = t("alerts:auth.user.put.429TooManyRequestsErrorResponse");
	const userPut500InternalServerErrorResponse = t("alerts:auth.user.put.500InternalServerErrorResponse");
	const userPut502BadGatewayErrorResponse = t("alerts:auth.user.put.502BadGatewayErrorResponse");
	const userPut503ServiceUnavailableErrorResponse = t("alerts:auth.user.put.503ServiceUnavailableErrorResponse");
	const userPut504GatewayTimeoutErrorResponse = t("alerts:auth.user.put.504GatewayTimeoutErrorResponse");

	let responsesArray = [];

	const deleteResponse = {
		method: "DELETE",
		responses: [
			{
				status: 200,
				title: fallback200OkSuccessResponse,
				message: userDelete200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: userDelete201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 204,
				title: fallback201CreatedSuccessResponse,
				message: userDelete204CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: userDelete400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: userDelete401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: userDelete403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: userDelete404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: userDelete429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: userDelete500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: userDelete502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: userDelete503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: userDelete504GatewayTimeoutErrorResponse,
				isSuccess: false
			}
		]
	};
	const getResponse = {
		method: "GET",
		responses: [
			{
				status: 200,
				title: fallback200OkSuccessResponse,
				message: userGet200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: userGet201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: userGet400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: userGet401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: userGet403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: userGet404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: userGet429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: userGet500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: userGet502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: userGet503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: userGet504GatewayTimeoutErrorResponse,
				isSuccess: false
			}
		]
	};
	const patchResponse = {
		method: "PATCH",
		responses: [
			{
				status: 200,
				title: fallback200OkSuccessResponse,
				message: userPatch200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: userPatch201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: userPatch400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: userPatch401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: userPatch403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: userPatch404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: userPatch429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: userPatch500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: userPatch502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: userPatch503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: userPatch504GatewayTimeoutErrorResponse,
				isSuccess: false
			}
		]
	};
	const putResponse = {
		method: "PUT",
		response: [
			{
				status: 200,
				title: fallback200OkSuccessResponse,
				message: userPut200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: userPut201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: userPut400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: userPut401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: userPut403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: userPut404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: userPut429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: userPut500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: userPut502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: userPut503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: userPut504GatewayTimeoutErrorResponse,
				isSuccess: false
			}
		]
	};

	responsesArray.push(deleteResponse);
	responsesArray.push(getResponse);
	responsesArray.push(patchResponse);
	responsesArray.push(putResponse);

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
		isUser,
		data,
		fallback
	});
};

export const LocalTimeEnabledNotificationMessage = ({ dispatch, config, setConfig, state, isLocalTimeEnabled }) => {
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

	// Local time translations
	const localTimeEnabled200OkSuccessResponse = t("alerts:auth.user.patch.misc.localTime.enable.200OkSuccessResponse");
	const localTimeEnabled201CreatedSuccessResponse = t(
		"alerts:auth.user.patch.misc.localTime.enable.201CreatedSuccessResponse"
	);
	const localTimeEnabled400BadRequestErrorResponse = t(
		"alerts:auth.user.patch.misc.localTime.enable.400BadRequestErrorResponse"
	);
	const localTimeEnabled401UnauthorizedErrorResponse = t(
		"alerts:auth.user.patch.misc.localTime.enable.401UnauthorizedErrorResponse"
	);
	const localTimeEnabled403ForbiddenErrorResponse = t(
		"alerts:auth.user.patch.misc.localTime.enable.403ForbiddenErrorResponse"
	);
	const localTimeEnabled404NotFoundErrorResponse = t(
		"alerts:auth.user.patch.misc.localTime.enable.404NotFoundErrorResponse"
	);
	const localTimeEnabled429TooManyRequestsErrorResponse = t(
		"alerts:auth.user.patch.misc.localTime.enable.429TooManyRequestsErrorResponse"
	);
	const localTimeEnabled500InternalServerErrorResponse = t(
		"alerts:auth.user.patch.misc.localTime.enable.500InternalServerErrorResponse"
	);
	const localTimeEnabled502BadGatewayErrorResponse = t(
		"alerts:auth.user.patch.misc.localTime.enable.502BadGatewayErrorResponse"
	);
	const localTimeEnabled503ServiceUnavailableErrorResponse = t(
		"alerts:auth.user.patch.misc.localTime.enable.503ServiceUnavailableErrorResponse"
	);
	const localTimeEnabled504GatewayTimeoutErrorResponse = t(
		"alerts:auth.user.patch.misc.localTime.enable.504GatewayTimeoutErrorResponse"
	);

	let responsesArray = [];

	const putResponse = {
		method: "PUT",
		responses: [
			{
				status: 200,
				title: fallback200OkSuccessResponse,
				message: localTimeEnabled200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: localTimeEnabled201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: localTimeEnabled400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: localTimeEnabled401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: localTimeEnabled403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: localTimeEnabled404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: localTimeEnabled429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: localTimeEnabled500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: localTimeEnabled502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: localTimeEnabled503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: localTimeEnabled504GatewayTimeoutErrorResponse,
				isSuccess: false
			}
		]
	};

	responsesArray.push(putResponse);

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
		isLocalTimeEnabled,
		data,
		fallback
	});
};

export const LocalTimeDisabledNotificationMessage = ({ dispatch, config, setConfig, state, isLocalTimeDisabled }) => {
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

	const localTimeDisabled200OkSuccessResponse = t("alerts:auth.user.patch.misc.localTime.disable.200OkSuccessResponse");
	const localTimeDisabled201CreatedSuccessResponse = t(
		"alerts:auth.user.patch.misc.localTime.disable.201CreatedSuccessResponse"
	);
	const localTimeDisabled400BadRequestErrorResponse = t(
		"alerts:auth.user.patch.misc.localTime.disable.400BadRequestErrorResponse"
	);
	const localTimeDisabled401UnauthorizedErrorResponse = t(
		"alerts:auth.user.patch.misc.localTime.disable.401UnauthorizedErrorResponse"
	);
	const localTimeDisabled403ForbiddenErrorResponse = t(
		"alerts:auth.user.patch.misc.localTime.disable.403ForbiddenErrorResponse"
	);
	const localTimeDisabled404NotFoundErrorResponse = t(
		"alerts:auth.user.patch.misc.localTime.disable.404NotFoundErrorResponse"
	);
	const localTimeDisabled429TooManyRequestsErrorResponse = t(
		"alerts:auth.user.patch.misc.localTime.disable.429TooManyRequestsErrorResponse"
	);
	const localTimeDisabled500InternalServerErrorResponse = t(
		"alerts:auth.user.patch.misc.localTime.disable.500InternalServerErrorResponse"
	);
	const localTimeDisabled502BadGatewayErrorResponse = t(
		"alerts:auth.user.patch.misc.localTime.disable.502BadGatewayErrorResponse"
	);
	const localTimeDisabled503ServiceUnavailableErrorResponse = t(
		"alerts:auth.user.patch.misc.localTime.disable.503ServiceUnavailableErrorResponse"
	);
	const localTimeDisabled504GatewayTimeoutErrorResponse = t(
		"alerts:auth.user.patch.misc.localTime.disable.504GatewayTimeoutErrorResponse"
	);

	let responsesArray = [];

	const putResponse = {
		method: "PUT",
		responses: [
			{
				status: 200,
				title: fallback200OkSuccessResponse,
				message: localTimeDisabled200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: localTimeDisabled201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: localTimeDisabled400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: localTimeDisabled401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: localTimeDisabled403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: localTimeDisabled404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: localTimeDisabled429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: localTimeDisabled500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: localTimeDisabled502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: localTimeDisabled503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: localTimeDisabled504GatewayTimeoutErrorResponse,
				isSuccess: false
			}
		]
	};

	responsesArray.push(putResponse);

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

	handleNotificationMessages({
		dispatch,
		config,
		setConfig,
		state,
		isLocalTimeDisabled,
		data,
		fallback
	});
};
