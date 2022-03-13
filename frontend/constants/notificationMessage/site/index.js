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

export const SitesNotificationMessage = ({ dispatch, config, setConfig, state, isSites }) => {
	// Translations
	const { t } = useTranslation();

	// Sites translations
	const sitesGet200OkSuccessResponse = t("alerts:sites.get.200OkSuccessResponse");
	const sitesGet201CreatedSuccessResponse = t("alerts:sites.get.201CreatedSuccessResponse");
	const sitesGet400BadRequestErrorResponse = t("alerts:sites.get.400BadRequestErrorResponse");
	const sitesGet401UnauthorizedErrorResponse = t("alerts:sites.get.401UnauthorizedErrorResponse");
	const sitesGet403ForbiddenErrorResponse = t("alerts:sites.get.403ForbiddenErrorResponse");
	const sitesGet404NotFoundErrorResponse = t("alerts:sites.get.404NotFoundErrorResponse");
	const sitesGet429TooManyRequestsErrorResponse = t("alerts:sites.get.429TooManyRequestsErrorResponse");
	const sitesGet500InternalServerErrorResponse = t("alerts:sites.get.500InternalServerErrorResponse");
	const sitesGet502BadGatewayErrorResponse = t("alerts:sites.get.502BadGatewayErrorResponse");
	const sitesGet503ServiceUnavailableErrorResponse = t("alerts:sites.get.503ServiceUnavailableErrorResponse");
	const sitesGet504GatewayTimeoutErrorResponse = t("alerts:sites.get.504GatewayTimeoutErrorResponse");
	const sitesPost200OkSuccessResponse = t("alerts:sites.post.200OkSuccessResponse");
	const sitesPost201CreatedSuccessResponse = t("alerts:sites.post.201CreatedSuccessResponse");
	const sitesPost400BadRequestErrorResponse = t("alerts:sites.post.400BadRequestErrorResponse");
	const sitesPost401UnauthorizedErrorResponse = t("alerts:sites.post.401UnauthorizedErrorResponse");
	const sitesPost403ForbiddenErrorResponse = t("alerts:sites.post.403ForbiddenErrorResponse");
	const sitesPost404NotFoundErrorResponse = t("alerts:sites.post.404NotFoundErrorResponse");
	const sitesPost429TooManyRequestsErrorResponse = t("alerts:sites.post.429TooManyRequestsErrorResponse");
	const sitesPost500InternalServerErrorResponse = t("alerts:sites.post.500InternalServerErrorResponse");
	const sitesPost502BadGatewayErrorResponse = t("alerts:sites.post.502BadGatewayErrorResponse");
	const sitesPost503ServiceUnavailableErrorResponse = t("alerts:sites.post.503ServiceUnavailableErrorResponse");
	const sitesPost504GatewayTimeoutErrorResponse = t("alerts:sites.post.504GatewayTimeoutErrorResponse");
	const sitesPut200OkSuccessResponse = t("alerts:sites.put.200OkSuccessResponse");
	const sitesPut201CreatedSuccessResponse = t("alerts:sites.put.201CreatedSuccessResponse");
	const sitesPut400BadRequestErrorResponse = t("alerts:sites.put.400BadRequestErrorResponse");
	const sitesPut401UnauthorizedErrorResponse = t("alerts:sites.put.401UnauthorizedErrorResponse");
	const sitesPut403ForbiddenErrorResponse = t("alerts:sites.put.403ForbiddenErrorResponse");
	const sitesPut404NotFoundErrorResponse = t("alerts:sites.put.404NotFoundErrorResponse");
	const sitesPut429TooManyRequestsErrorResponse = t("alerts:sites.put.429TooManyRequestsErrorResponse");
	const sitesPut500InternalServerErrorResponse = t("alerts:sites.put.500InternalServerErrorResponse");
	const sitesPut502BadGatewayErrorResponse = t("alerts:sites.put.502BadGatewayErrorResponse");
	const sitesPut503ServiceUnavailableErrorResponse = t("alerts:sites.put.503ServiceUnavailableErrorResponse");
	const sitesPut504GatewayTimeoutErrorResponse = t("alerts:sites.put.504GatewayTimeoutErrorResponse");
	const sitesDelete200OkSuccessResponse = t("alerts:sites.delete.200OkSuccessResponse");
	const sitesDelete201CreatedSuccessResponse = t("alerts:sites.delete.201CreatedSuccessResponse");
	const sitesDelete204NoContentSuccessResponse = t("alerts:sites.delete.204NoContentSuccessResponse");
	const sitesDelete400BadRequestErrorResponse = t("alerts:sites.delete.400BadRequestErrorResponse");
	const sitesDelete401UnauthorizedErrorResponse = t("alerts:sites.delete.401UnauthorizedErrorResponse");
	const sitesDelete403ForbiddenErrorResponse = t("alerts:sites.delete.403ForbiddenErrorResponse");
	const sitesDelete404NotFoundErrorResponse = t("alerts:sites.delete.404NotFoundErrorResponse");
	const sitesDelete429TooManyRequestsErrorResponse = t("alerts:sites.delete.429TooManyRequestsErrorResponse");
	const sitesDelete500InternalServerErrorResponse = t("alerts:sites.delete.500InternalServerErrorResponse");
	const sitesDelete502BadGatewayErrorResponse = t("alerts:sites.delete.502BadGatewayErrorResponse");
	const sitesDelete503ServiceUnavailableErrorResponse = t("alerts:sites.delete.503ServiceUnavailableErrorResponse");
	const sitesDelete504GatewayTimeoutErrorResponse = t("alerts:sites.delete.504GatewayTimeoutErrorResponse");
	const sitesPatch200OkSuccessResponse = t("alerts:sites.patch.200OkSuccessResponse");
	const sitesPatch201CreatedSuccessResponse = t("alerts:sites.patch.201CreatedSuccessResponse");
	const sitesPatch400BadRequestErrorResponse = t("alerts:sites.patch.400BadRequestErrorResponse");
	const sitesPatch401UnauthorizedErrorResponse = t("alerts:sites.patch.401UnauthorizedErrorResponse");
	const sitesPatch403ForbiddenErrorResponse = t("alerts:sites.patch.403ForbiddenErrorResponse");
	const sitesPatch404NotFoundErrorResponse = t("alerts:sites.patch.404NotFoundErrorResponse");
	const sitesPatch429TooManyRequestsErrorResponse = t("alerts:sites.patch.429TooManyRequestsErrorResponse");
	const sitesPatch500InternalServerErrorResponse = t("alerts:sites.patch.500InternalServerErrorResponse");
	const sitesPatch502BadGatewayErrorResponse = t("alerts:sites.patch.502BadGatewayErrorResponse");
	const sitesPatch503ServiceUnavailableErrorResponse = t("alerts:sites.patch.503ServiceUnavailableErrorResponse");
	const sitesPatch504GatewayTimeoutErrorResponse = t("alerts:sites.patch.504GatewayTimeoutErrorResponse");

	let responsesArray = [];

	const postResponse = {
		method: "POST",
		responses: [
			{
				status: 200,
				title: fallback200OkSuccessResponse,
				message: sitesPost200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: sitesPost201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: sitesPost400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: sitesPost401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: sitesPost403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: sitesPost404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: sitesPost429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: sitesPost500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: sitesPost502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: sitesPost503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: sitesPost504GatewayTimeoutErrorResponse,
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
				message: sitesGet200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: sitesGet201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: sitesGet400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: sitesGet401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: sitesGet403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: sitesGet404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: sitesGet429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: sitesGet500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: sitesGet502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: sitesGet503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: sitesGet504GatewayTimeoutErrorResponse,
				isSuccess: false
			}
		]
	};
	const putResponse = {
		method: "PUT",
		responses: [
			{
				status: 200,
				title: fallback200OkSuccessResponse,
				message: sitesPut200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: sitesPut201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: sitesPut400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: sitesPut401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: sitesPut403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: sitesPut404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: sitesPut429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: sitesPut500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: sitesPut502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: sitesPut503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: sitesPut504GatewayTimeoutErrorResponse,
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
				message: sitesPatch200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: sitesPatch201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: sitesPatch400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: sitesPatch401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: sitesPatch403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: sitesPatch404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: sitesPatch429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: sitesPatch500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: sitesPatch502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: sitesPatch503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: sitesPatch504GatewayTimeoutErrorResponse,
				isSuccess: false
			}
		]
	};
	const deleteResponse = {
		method: "DELETE",
		responses: [
			{
				status: 200,
				title: fallback200OkSuccessResponse,
				message: sitesDelete200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: sitesDelete201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 204,
				title: fallback204NoContentSuccessResponse,
				message: sitesDelete204NoContentSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: sitesDelete400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: sitesDelete401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: sitesDelete403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: sitesDelete404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: sitesDelete429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: sitesDelete500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: sitesDelete502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: sitesDelete503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: sitesDelete504GatewayTimeoutErrorResponse,
				isSuccess: false
			}
		]
	};

	responsesArray.push(postResponse);
	responsesArray.push(getResponse);
	responsesArray.push(putResponse);
	responsesArray.push(patchResponse);
	responsesArray.push(deleteResponse);

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
		isSites,
		data,
		fallback
	});
};

export const ScanNotificationMessages = ({ dispatch, config, setConfig, state, isScan }) => {
	// Translations
	const { t } = useTranslation();

	// Scan translations
	const scanGet200OkSuccessResponse = t("alerts:scan.get.200OkSuccessResponse");
	const scanGet201CreatedSuccessResponse = t("alerts:scan.get.201CreatedSuccessResponse");
	const scanGet400BadRequestErrorResponse = t("alerts:scan.get.400BadRequestErrorResponse");
	const scanGet401UnauthorizedErrorResponse = t("alerts:scan.get.401UnauthorizedErrorResponse");
	const scanGet403ForbiddenErrorResponse = t("alerts:scan.get.403ForbiddenErrorResponse");
	const scanGet404NotFoundErrorResponse = t("alerts:scan.get.404NotFoundErrorResponse");
	const scanGet429TooManyRequestsErrorResponse = t("alerts:scan.get.429TooManyRequestsErrorResponse");
	const scanGet500InternalServerErrorResponse = t("alerts:scan.get.500InternalServerErrorResponse");
	const scanGet502BadGatewayErrorResponse = t("alerts:scan.get.502BadGatewayErrorResponse");
	const scanGet503ServiceUnavailableErrorResponse = t("alerts:scan.get.503ServiceUnavailableErrorResponse");
	const scanGet504GatewayTimeoutErrorResponse = t("alerts:scan.get.504GatewayTimeoutErrorResponse");
	const scanPost200OkSuccessResponse = t("alerts:scan.post.200OkSuccessResponse");
	const scanPost201CreatedSuccessResponse = t("alerts:scan.post.201CreatedSuccessResponse");
	const scanPost400BadRequestErrorResponse = t("alerts:scan.post.400BadRequestErrorResponse");
	const scanPost401UnauthorizedErrorResponse = t("alerts:scan.post.401UnauthorizedErrorResponse");
	const scanPost403ForbiddenErrorResponse = t("alerts:scan.post.403ForbiddenErrorResponse");
	const scanPost404NotFoundErrorResponse = t("alerts:scan.post.404NotFoundErrorResponse");
	const scanPost429TooManyRequestsErrorResponse = t("alerts:scan.post.429TooManyRequestsErrorResponse");
	const scanPost500InternalServerErrorResponse = t("alerts:scan.post.500InternalServerErrorResponse");
	const scanPost502BadGatewayErrorResponse = t("alerts:scan.post.502BadGatewayErrorResponse");
	const scanPost503ServiceUnavailableErrorResponse = t("alerts:scan.post.503ServiceUnavailableErrorResponse");
	const scanPost504GatewayTimeoutErrorResponse = t("alerts:scan.post.504GatewayTimeoutErrorResponse");

	let responsesArray = [];

	const getResponse = {
		method: "GET",
		responses: [
			{
				status: 200,
				title: fallback200OkSuccessResponse,
				message: scanGet200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: scanGet201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: scanGet400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: scanGet401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: scanGet403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: scanGet404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: scanGet429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: scanGet500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: scanGet502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: scanGet503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: scanGet504GatewayTimeoutErrorResponse,
				isSuccess: false
			}
		]
	};
	const postResponse = {
		method: "POST",
		responses: [
			{
				status: 200,
				title: fallback200OkSuccessResponse,
				message: scanPost200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: scanPost201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: scanPost400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: scanPost401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: scanPost403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: scanPost404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: scanPost429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: scanPost500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: scanPost502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: scanPost503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: scanPost504GatewayTimeoutErrorResponse,
				isSuccess: false
			}
		]
	};

	responsesArray.push(getResponse);
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

	handleNotificationMessages({
		dispatch,
		config,
		setConfig,
		state,
		isScan,
		data,
		fallback
	});
};

export const StatsNotificationMessage = ({ dispatch, config, setConfig, state, isStats }) => {
	// Translations
	const { t } = useTranslation();

	// Stats translations
	const statsGet200OkSuccessResponse = t("alerts:stats.get.200OkSuccessResponse");
	const statsGet201CreatedSuccessResponse = t("alerts:stats.get.201CreatedSuccessResponse");
	const statsGet400BadRequestErrorResponse = t("alerts:stats.get.400BadRequestErrorResponse");
	const statsGet401UnauthorizedErrorResponse = t("alerts:stats.get.401UnauthorizedErrorResponse");
	const statsGet403ForbiddenErrorResponse = t("alerts:stats.get.403ForbiddenErrorResponse");
	const statsGet404NotFoundErrorResponse = t("alerts:stats.get.404NotFoundErrorResponse");
	const statsGet429TooManyRequestsErrorResponse = t("alerts:stats.get.429TooManyRequestsErrorResponse");
	const statsGet500InternalServerErrorResponse = t("alerts:stats.get.500InternalServerErrorResponse");
	const statsGet502BadGatewayErrorResponse = t("alerts:stats.get.502BadGatewayErrorResponse");
	const statsGet503ServiceUnavailableErrorResponse = t("alerts:stats.get.503ServiceUnavailableErrorResponse");
	const statsGet504GatewayTimeoutErrorResponse = t("alerts:stats.get.504GatewayTimeoutErrorResponse");
	const statsDelete200OkSuccessResponse = t("alerts:stats.delete.200OkSuccessResponse");
	const statsDelete201CreatedSuccessResponse = t("alerts:stats.delete.201CreatedSuccessResponse");
	const statsDelete400BadRequestErrorResponse = t("alerts:stats.delete.400BadRequestErrorResponse");
	const statsDelete401UnauthorizedErrorResponse = t("alerts:stats.delete.401UnauthorizedErrorResponse");
	const statsDelete403ForbiddenErrorResponse = t("alerts:stats.delete.403ForbiddenErrorResponse");
	const statsDelete404NotFoundErrorResponse = t("alerts:stats.delete.404NotFoundErrorResponse");
	const statsDelete429TooManyRequestsErrorResponse = t("alerts:stats.delete.429TooManyRequestsErrorResponse");
	const statsDelete500InternalServerErrorResponse = t("alerts:stats.delete.500InternalServerErrorResponse");
	const statsDelete502BadGatewayErrorResponse = t("alerts:stats.delete.502BadGatewayErrorResponse");
	const statsDelete503ServiceUnavailableErrorResponse = t("alerts:stats.delete.503ServiceUnavailableErrorResponse");
	const statsDelete504GatewayTimeoutErrorResponse = t("alerts:stats.delete.504GatewayTimeoutErrorResponse");

	let responsesArray = [];

	const getResponse = {
		method: "GET",
		responses: [
			{
				status: 200,
				title: fallback200OkSuccessResponse,
				message: statsGet200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: statsGet201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: statsGet400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: statsGet401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: statsGet403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: statsGet404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: statsGet429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: statsGet500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: statsGet502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: statsGet503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: statsGet504GatewayTimeoutErrorResponse,
				isSuccess: false
			}
		]
	};
	const deleteResponse = {
		method: "DELETE",
		responses: [
			{
				status: 200,
				title: fallback200OkSuccessResponse,
				message: statsDelete200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: statsDelete201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: statsDelete400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: statsDelete401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: statsDelete403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: statsDelete404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: statsDelete429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: statsDelete500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: statsDelete502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: statsDelete503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: statsDelete504GatewayTimeoutErrorResponse,
				isSuccess: false
			}
		]
	};

	responsesArray.push(getResponse);
	responsesArray.push(deleteResponse);

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
		isStats,
		data,
		fallback
	});
};

export const LinksNotificationMessage = ({ dispatch, config, setConfig, state, isLinks }) => {
	// Translations
	const { t } = useTranslation();

	// Links translations
	const linksGet200OkSuccessResponse = t("alerts:links.get.200OkSuccessResponse");
	const linksGet201CreatedSuccessResponse = t("alerts:links.get.201CreatedSuccessResponse");
	const linksGet400BadRequestErrorResponse = t("alerts:links.get.400BadRequestErrorResponse");
	const linksGet401UnauthorizedErrorResponse = t("alerts:links.get.401UnauthorizedErrorResponse");
	const linksGet403ForbiddenErrorResponse = t("alerts:links.get.403ForbiddenErrorResponse");
	const linksGet404NotFoundErrorResponse = t("alerts:links.get.404NotFoundErrorResponse");
	const linksGet429TooManyRequestsErrorResponse = t("alerts:links.get.429TooManyRequestsErrorResponse");
	const linksGet500InternalServerErrorResponse = t("alerts:links.get.500InternalServerErrorResponse");
	const linksGet502BadGatewayErrorResponse = t("alerts:links.get.502BadGatewayErrorResponse");
	const linksGet503ServiceUnavailableErrorResponse = t("alerts:links.get.503ServiceUnavailableErrorResponse");
	const linksGet504GatewayTimeoutErrorResponse = t("alerts:links.get.504GatewayTimeoutErrorResponse");
	const linksPut200OkSuccessResponse = t("alerts:links.put.200OkSuccessResponse");
	const linksPut201CreatedSuccessResponse = t("alerts:links.put.201CreatedSuccessResponse");
	const linksPut400BadRequestErrorResponse = t("alerts:links.put.400BadRequestErrorResponse");
	const linksPut401UnauthorizedErrorResponse = t("alerts:links.put.401UnauthorizedErrorResponse");
	const linksPut403ForbiddenErrorResponse = t("alerts:links.put.403ForbiddenErrorResponse");
	const linksPut404NotFoundErrorResponse = t("alerts:links.put.404NotFoundErrorResponse");
	const linksPut429TooManyRequestsErrorResponse = t("alerts:links.put.429TooManyRequestsErrorResponse");
	const linksPut500InternalServerErrorResponse = t("alerts:links.put.500InternalServerErrorResponse");
	const linksPut502BadGatewayErrorResponse = t("alerts:links.put.502BadGatewayErrorResponse");
	const linksPut503ServiceUnavailableErrorResponse = t("alerts:links.put.503ServiceUnavailableErrorResponse");
	const linksPut504GatewayTimeoutErrorResponse = t("alerts:links.put.504GatewayTimeoutErrorResponse");
	const linksPatch200OkSuccessResponse = t("alerts:links.patch.200OkSuccessResponse");
	const linksPatch201CreatedSuccessResponse = t("alerts:links.patch.201CreatedSuccessResponse");
	const linksPatch400BadRequestErrorResponse = t("alerts:links.patch.400BadRequestErrorResponse");
	const linksPatch401UnauthorizedErrorResponse = t("alerts:links.patch.401UnauthorizedErrorResponse");
	const linksPatch403ForbiddenErrorResponse = t("alerts:links.patch.403ForbiddenErrorResponse");
	const linksPatch404NotFoundErrorResponse = t("alerts:links.patch.404NotFoundErrorResponse");
	const linksPatch429TooManyRequestsErrorResponse = t("alerts:links.patch.429TooManyRequestsErrorResponse");
	const linksPatch500InternalServerErrorResponse = t("alerts:links.patch.500InternalServerErrorResponse");
	const linksPatch502BadGatewayErrorResponse = t("alerts:links.patch.502BadGatewayErrorResponse");
	const linksPatch503ServiceUnavailableErrorResponse = t("alerts:links.patch.503ServiceUnavailableErrorResponse");
	const linksPatch504GatewayTimeoutErrorResponse = t("alerts:links.patch.504GatewayTimeoutErrorResponse");

	let responsesArray = [];

	const getResponse = {
		method: "GET",
		responses: [
			{
				status: 200,
				title: fallback200OkSuccessResponse,
				message: linksGet200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: linksGet201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: linksGet400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: linksGet401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: linksGet403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: linksGet404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: linksGet429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: linksGet500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: linksGet502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: linksGet503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: linksGet504GatewayTimeoutErrorResponse,
				isSuccess: false
			}
		]
	};
	const putResponse = {
		method: "PUT",
		responses: [
			{
				status: 200,
				title: fallback200OkSuccessResponse,
				message: linksPut200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: linksPut201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: linksPut400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: linksPut401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: linksPut403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: linksPut404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: linksPut429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: linksPut500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: linksPut502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: linksPut503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: linksPut504GatewayTimeoutErrorResponse,
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
				message: linksPatch200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: linksPatch201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: linksPatch400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: linksPatch401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: linksPatch403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: linksPatch404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: linksPatch429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: linksPatch500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: linksPatch502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: linksPatch503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: linksPatch504GatewayTimeoutErrorResponse,
				isSuccess: false
			}
		]
	};

	responsesArray.push(getResponse);
	responsesArray.push(putResponse);
	responsesArray.push(patchResponse);

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
		isLinks,
		data,
		fallback
	});
};

export const PagesNotificationMessage = ({ dispatch, config, setConfig, state, isPages }) => {
	// Translations
	const { t } = useTranslation();

	// Pages translations
	const pagesGet200OkSuccessResponse = t("alerts:sites.pages.get.200OkSuccessResponse");
	const pagesGet201CreatedSuccessResponse = t("alerts:sites.pages.get.201CreatedSuccessResponse");
	const pagesGet400BadRequestErrorResponse = t("alerts:sites.pages.get.400BadRequestErrorResponse");
	const pagesGet401UnauthorizedErrorResponse = t("alerts:sites.pages.get.401UnauthorizedErrorResponse");
	const pagesGet403ForbiddenErrorResponse = t("alerts:sites.pages.get.403ForbiddenErrorResponse");
	const pagesGet404NotFoundErrorResponse = t("alerts:sites.pages.get.404NotFoundErrorResponse");
	const pagesGet429TooManyRequestsErrorResponse = t("alerts:sites.pages.get.429TooManyRequestsErrorResponse");
	const pagesGet500InternalServerErrorResponse = t("alerts:sites.pages.get.500InternalServerErrorResponse");
	const pagesGet502BadGatewayErrorResponse = t("alerts:sites.pages.get.502BadGatewayErrorResponse");
	const pagesGet503ServiceUnavailableErrorResponse = t("alerts:sites.pages.get.503ServiceUnavailableErrorResponse");
	const pagesGet504GatewayTimeoutErrorResponse = t("alerts:sites.pages.get.504GatewayTimeoutErrorResponse");
	const pagesPost200OkSuccessResponse = t("alerts:sites.pages.post.200OkSuccessResponse");
	const pagesPost201CreatedSuccessResponse = t("alerts:sites.pages.post.201CreatedSuccessResponse");
	const pagesPost400BadRequestErrorResponse = t("alerts:sites.pages.post.400BadRequestErrorResponse");
	const pagesPost401UnauthorizedErrorResponse = t("alerts:sites.pages.post.401UnauthorizedErrorResponse");
	const pagesPost403ForbiddenErrorResponse = t("alerts:sites.pages.post.403ForbiddenErrorResponse");
	const pagesPost404NotFoundErrorResponse = t("alerts:sites.pages.post.404NotFoundErrorResponse");
	const pagesPost429TooManyRequestsErrorResponse = t("alerts:sites.pages.post.429TooManyRequestsErrorResponse");
	const pagesPost500InternalServerErrorResponse = t("alerts:sites.pages.post.500InternalServerErrorResponse");
	const pagesPost502BadGatewayErrorResponse = t("alerts:sites.pages.post.502BadGatewayErrorResponse");
	const pagesPost503ServiceUnavailableErrorResponse = t("alerts:sites.pages.post.503ServiceUnavailableErrorResponse");
	const pagesPost504GatewayTimeoutErrorResponse = t("alerts:sites.pages.post.504GatewayTimeoutErrorResponse");

	let responsesArray = [];

	const postResponse = {
		method: "POST",
		responses: [
			{
				status: 200,
				title: fallback200OkSuccessResponse,
				message: pagesPost200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: pagesPost201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: pagesPost400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: pagesPost401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: pagesPost403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: pagesPost404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: pagesPost429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: pagesPost500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: pagesPost502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: pagesPost503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: pagesPost504GatewayTimeoutErrorResponse,
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
				message: pagesGet200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: pagesGet201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: pagesGet400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: pagesGet401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: pagesGet403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: pagesGet404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: pagesGet429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: pagesGet500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: pagesGet502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: pagesGet503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: pagesGet504GatewayTimeoutErrorResponse,
				isSuccess: false
			}
		]
	};

	responsesArray.push(postResponse);
	responsesArray.push(getResponse);

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
		isPages,
		data,
		fallback
	});
};

export const ImagesNotificationMessage = ({ dispatch, config, setConfig, state, isImages }) => {
	// Translations
	const { t } = useTranslation();

	// Pages translations
	const imagesGet200OkSuccessResponse = t("alerts:sites.images.get.200OkSuccessResponse");
	const imagesGet201CreatedSuccessResponse = t("alerts:sites.images.get.201CreatedSuccessResponse");
	const imagesGet400BadRequestErrorResponse = t("alerts:sites.images.get.400BadRequestErrorResponse");
	const imagesGet401UnauthorizedErrorResponse = t("alerts:sites.images.get.401UnauthorizedErrorResponse");
	const imagesGet403ForbiddenErrorResponse = t("alerts:sites.images.get.403ForbiddenErrorResponse");
	const imagesGet404NotFoundErrorResponse = t("alerts:sites.images.get.404NotFoundErrorResponse");
	const imagesGet429TooManyRequestsErrorResponse = t("alerts:sites.images.get.429TooManyRequestsErrorResponse");
	const imagesGet500InternalServerErrorResponse = t("alerts:sites.images.get.500InternalServerErrorResponse");
	const imagesGet502BadGatewayErrorResponse = t("alerts:sites.images.get.502BadGatewayErrorResponse");
	const imagesGet503ServiceUnavailableErrorResponse = t("alerts:sites.images.get.503ServiceUnavailableErrorResponse");
	const imagesGet504GatewayTimeoutErrorResponse = t("alerts:sites.images.get.504GatewayTimeoutErrorResponse");
	const imagesPost200OkSuccessResponse = t("alerts:sites.images.post.200OkSuccessResponse");
	const imagesPost201CreatedSuccessResponse = t("alerts:sites.images.post.201CreatedSuccessResponse");
	const imagesPost400BadRequestErrorResponse = t("alerts:sites.images.post.400BadRequestErrorResponse");
	const imagesPost401UnauthorizedErrorResponse = t("alerts:sites.images.post.401UnauthorizedErrorResponse");
	const imagesPost403ForbiddenErrorResponse = t("alerts:sites.images.post.403ForbiddenErrorResponse");
	const imagesPost404NotFoundErrorResponse = t("alerts:sites.images.post.404NotFoundErrorResponse");
	const imagesPost429TooManyRequestsErrorResponse = t("alerts:sites.images.post.429TooManyRequestsErrorResponse");
	const imagesPost500InternalServerErrorResponse = t("alerts:sites.images.post.500InternalServerErrorResponse");
	const imagesPost502BadGatewayErrorResponse = t("alerts:sites.images.post.502BadGatewayErrorResponse");
	const imagesPost503ServiceUnavailableErrorResponse = t("alerts:sites.images.post.503ServiceUnavailableErrorResponse");
	const imagesPost504GatewayTimeoutErrorResponse = t("alerts:sites.images.post.504GatewayTimeoutErrorResponse");

	let responsesArray = [];

	const postResponse = {
		method: "POST",
		responses: [
			{
				status: 200,
				title: fallback200OkSuccessResponse,
				message: imagesPost200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: imagesPost201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: imagesPost400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: imagesPost401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: imagesPost403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: imagesPost404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: imagesPost429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: imagesPost500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: imagesPost502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: imagesPost503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: imagesPost504GatewayTimeoutErrorResponse,
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
				message: imagesGet200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: imagesGet201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: imagesGet400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: imagesGet401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: imagesGet403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: imagesGet404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: imagesGet429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: imagesGet500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: imagesGet502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: imagesGet503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: imagesGet504GatewayTimeoutErrorResponse,
				isSuccess: false
			}
		]
	};

	responsesArray.push(postResponse);
	responsesArray.push(getResponse);

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
		isImages,
		data,
		fallback
	});
};

export const UrlInformationStepNotificationMessage = ({ dispatch, config, setConfig, state, isUrlInformationStep }) => {
	// Translations
	const { t } = useTranslation();

	// URL information step process translations
	const urlInformationStepPatch200OkSuccessResponse = t("alerts:sites.urlInformation.patch.200OkSuccessResponse");
	const urlInformationStepPatch201CreatedSuccessResponse = t(
		"alerts:sites.urlInformation.patch.201CreatedSuccessResponse"
	);
	const urlInformationStepPatch400BadRequestErrorResponse = t(
		"alerts:sites.urlInformation.patch.400BadRequestErrorResponse"
	);
	const urlInformationStepPatch401UnauthorizedErrorResponse = t(
		"alerts:sites.urlInformation.patch.401UnauthorizedErrorResponse"
	);
	const urlInformationStepPatch403ForbiddenErrorResponse = t(
		"alerts:sites.urlInformation.patch.403ForbiddenErrorResponse"
	);
	const urlInformationStepPatch404NotFoundErrorResponse = t(
		"alerts:sites.urlInformation.patch.404NotFoundErrorResponse"
	);
	const urlInformationStepPatch429TooManyRequestsErrorResponse = t(
		"alerts:sites.urlInformation.patch.429TooManyRequestsErrorResponse"
	);
	const urlInformationStepPatch500InternalServerErrorResponse = t(
		"alerts:sites.urlInformation.patch.500InternalServerErrorResponse"
	);
	const urlInformationStepPatch502BadGatewayErrorResponse = t(
		"alerts:sites.urlInformation.patch.502BadGatewayErrorResponse"
	);
	const urlInformationStepPatch503ServiceUnavailableErrorResponse = t(
		"alerts:sites.urlInformation.patch.503ServiceUnavailableErrorResponse"
	);
	const urlInformationStepPatch504GatewayTimeoutErrorResponse = t(
		"alerts:sites.urlInformation.patch.504GatewayTimeoutErrorResponse"
	);
	const urlInformationStepPost200OkSuccessResponse = t("alerts:sites.urlInformation.post.200OkSuccessResponse");
	const urlInformationStepPost201CreatedSuccessResponse = t(
		"alerts:sites.urlInformation.post.201CreatedSuccessResponse"
	);
	const urlInformationStepPost400BadRequestErrorResponse = t(
		"alerts:sites.urlInformation.post.400BadRequestErrorResponse"
	);
	const urlInformationStepPost401UnauthorizedErrorResponse = t(
		"alerts:sites.urlInformation.post.401UnauthorizedErrorResponse"
	);
	const urlInformationStepPost403ForbiddenErrorResponse = t(
		"alerts:sites.urlInformation.post.403ForbiddenErrorResponse"
	);
	const urlInformationStepPost404NotFoundErrorResponse = t("alerts:sites.urlInformation.post.404NotFoundErrorResponse");
	const urlInformationStepPost429TooManyRequestsErrorResponse = t(
		"alerts:sites.urlInformation.post.201CreatedSuccessResponse"
	);
	const urlInformationStepPost500InternalServerErrorResponse = t(
		"alerts:sites.urlInformation.post.500InternalServerErrorResponse"
	);
	const urlInformationStepPost502BadGatewayErrorResponse = t(
		"alerts:sites.urlInformation.post.502BadGatewayErrorResponse"
	);
	const urlInformationStepPost503ServiceUnavailableErrorResponse = t(
		"alerts:sites.urlInformation.post.503ServiceUnavailableErrorResponse"
	);
	const urlInformationStepPost504GatewayTimeoutErrorResponse = t(
		"alerts:sites.urlInformation.post.504GatewayTimeoutErrorResponse"
	);
	const urlInformationStepPut200OkSuccessResponse = t("alerts:sites.urlInformation.put.200OkSuccessResponse");
	const urlInformationStepPut201CreatedSuccessResponse = t("alerts:sites.urlInformation.put.201CreatedSuccessResponse");
	const urlInformationStepPut400BadRequestErrorResponse = t(
		"alerts:sites.urlInformation.put.400BadRequestErrorResponse"
	);
	const urlInformationStepPut401UnauthorizedErrorResponse = t(
		"alerts:sites.urlInformation.put.401UnauthorizedErrorResponse"
	);
	const urlInformationStepPut403ForbiddenErrorResponse = t("alerts:sites.urlInformation.put.403ForbiddenErrorResponse");
	const urlInformationStepPut404NotFoundErrorResponse = t("alerts:sites.urlInformation.put.404NotFoundErrorResponse");
	const urlInformationStepPut429TooManyRequestsErrorResponse = t(
		"alerts:sites.urlInformation.put.201CreatedSuccessResponse"
	);
	const urlInformationStepPut500InternalServerErrorResponse = t(
		"alerts:sites.urlInformation.put.500InternalServerErrorResponse"
	);
	const urlInformationStepPut502BadGatewayErrorResponse = t(
		"alerts:sites.urlInformation.put.502BadGatewayErrorResponse"
	);
	const urlInformationStepPut503ServiceUnavailableErrorResponse = t(
		"alerts:sites.urlInformation.put.503ServiceUnavailableErrorResponse"
	);
	const urlInformationStepPut504GatewayTimeoutErrorResponse = t(
		"alerts:sites.urlInformation.put.504GatewayTimeoutErrorResponse"
	);

	let responsesArray = [];

	const patchResponse = {
		method: "PATCH",
		responses: [
			{
				status: 200,
				title: fallback200OkSuccessResponse,
				message: urlInformationStepPatch200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: urlInformationStepPatch201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: urlInformationStepPatch400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: urlInformationStepPatch401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: urlInformationStepPatch403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: urlInformationStepPatch404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: urlInformationStepPatch429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: urlInformationStepPatch500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: urlInformationStepPatch502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: urlInformationStepPatch503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: urlInformationStepPatch504GatewayTimeoutErrorResponse,
				isSuccess: false
			}
		]
	};
	const putResponse = {
		method: "PUT",
		responses: [
			{
				status: 200,
				title: fallback200OkSuccessResponse,
				message: urlInformationStepPut200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: urlInformationStepPut201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: urlInformationStepPut400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: urlInformationStepPut401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: urlInformationStepPut403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: urlInformationStepPut404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: urlInformationStepPut429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: urlInformationStepPut500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: urlInformationStepPut502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: urlInformationStepPut503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: urlInformationStepPut504GatewayTimeoutErrorResponse,
				isSuccess: false
			}
		]
	};
	const postResponse = {
		method: "POST",
		responses: [
			{
				status: 200,
				title: fallback200OkSuccessResponse,
				message: urlInformationStepPost200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: urlInformationStepPost201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: urlInformationStepPost400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: urlInformationStepPost401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: urlInformationStepPost403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: urlInformationStepPost404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: urlInformationStepPost429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: urlInformationStepPost500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: urlInformationStepPost502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: urlInformationStepPost503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: urlInformationStepPost504GatewayTimeoutErrorResponse,
				isSuccess: false
			}
		]
	};

	responsesArray.push(patchResponse);
	responsesArray.push(putResponse);
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
		isUrlInformationStep,
		data,
		fallback
	});
};

export const VerifyUrlStepNotificationMessage = ({ dispatch, isError, config, setConfig, state, isVerifyUrlStep }) => {
	// Translations
	const { t } = useTranslation();

	// Verify URL step process translations
	const verifyUrlStepPost200OkSuccessResponse = t("alerts:sites.verifyUrl.post.200OkSuccessResponse");
	const verifyUrlStepPost201CreatedSuccessResponse = t("alerts:sites.verifyUrl.post.201CreatedSuccessResponse");
	const verifyUrlStepPost400BadRequestErrorResponse = t("alerts:sites.verifyUrl.post.400BadRequestErrorResponse");
	const verifyUrlStepPost401UnauthorizedErrorResponse = t("alerts:sites.verifyUrl.post.401UnauthorizedErrorResponse");
	const verifyUrlStepPost403ForbiddenErrorResponse = t("alerts:sites.verifyUrl.post.403ForbiddenErrorResponse");
	const verifyUrlStepPost404NotFoundErrorResponse = t("alerts:sites.verifyUrl.post.404NotFoundErrorResponse");
	const verifyUrlStepPost429TooManyRequestsErrorResponse = t("alerts:sites.verifyUrl.post.201CreatedSuccessResponse");
	const verifyUrlStepPost500InternalServerErrorResponse = t(
		"alerts:sites.verifyUrl.post.500InternalServerErrorResponse"
	);
	const verifyUrlStepPost502BadGatewayErrorResponse = t("alerts:sites.verifyUrl.post.502BadGatewayErrorResponse");
	const verifyUrlStepPost503ServiceUnavailableErrorResponse = t(
		"alerts:sites.verifyUrl.post.503ServiceUnavailableErrorResponse"
	);
	const verifyUrlStepPost504GatewayTimeoutErrorResponse = t(
		"alerts:sites.verifyUrl.post.504GatewayTimeoutErrorResponse"
	);
	const verifyUrlStepPostMiscSiteVerificationFailedErrorResponse = t(
		"alerts:sites.verifyUrl.post.misc.siteVerificationFailedErrorResponse"
	);

	let responsesArray = [];

	const postResponse = {
		method: "POST",
		responses: [
			{
				status: 200,
				title: isError ? fallback400BadRequestErrorResponse : fallback200OkSuccessResponse,
				message: isError
					? verifyUrlStepPostMiscSiteVerificationFailedErrorResponse
					: verifyUrlStepPost200OkSuccessResponse,
				isSuccess: isError ? false : true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: verifyUrlStepPost201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: verifyUrlStepPost400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: verifyUrlStepPost401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: verifyUrlStepPost403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: verifyUrlStepPost404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: verifyUrlStepPost429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: verifyUrlStepPost500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: verifyUrlStepPost502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: verifyUrlStepPost503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: verifyUrlStepPost504GatewayTimeoutErrorResponse,
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
		isVerifyUrlStep,
		data,
		fallback
	});
};
