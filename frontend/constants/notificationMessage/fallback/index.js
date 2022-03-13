import useTranslation from "next-translate/useTranslation";

export const FalllbackNotificationMessage = () => {
	// Translations
	const { t } = useTranslation();

	// Fallback translations
	const fallback200OkSuccessResponse = t("alerts:fallback.200OkSuccessResponse");
	const fallback201CreatedSuccessResponse = t("alerts:fallback.201CreatedSuccessResponse");
	const fallback204NoContentSuccessResponse = t("alerts:fallback.204NoContentSuccessResponse");
	const fallback400BadRequestErrorResponse = t("alerts:fallback.400BadRequestErrorResponse");
	const fallback401UnauthorizedErrorResponse = t("alerts:fallback.401UnauthorizedErrorResponse");
	const fallback403ForbiddenErrorResponse = t("alerts:fallback.403ForbiddenErrorResponse");
	const fallback404NotFoundErrorResponse = t("alerts:fallback.404NotFoundErrorResponse");
	const fallback429TooManyRequestsErrorResponse = t("alerts:fallback.429TooManyRequestsErrorResponse");
	const fallback500InternalServerErrorResponse = t("alerts:fallback.500InternalServerErrorResponse");
	const fallback502BadGatewayErrorResponse = t("alerts:fallback.502BadGatewayErrorResponse");
	const fallback503ServiceUnavailableErrorResponse = t("alerts:fallback.503ServiceUnavailableErrorResponse");
	const fallback504GatewayTimeoutErrorResponse = t("alerts:fallback.504GatewayTimeoutErrorResponse");
	const fallbackUnknownResponseTitle = t("alerts:fallback.unknownResponse.title");
	const fallbackUnknownResponseMessage = t("alerts:fallback.unknownResponse.message");
	const fallbackUnknownClientErrorResponseTitle = t("alerts:fallback.unknownClientErrorResponse.title");
	const fallbackUnknownClientErrorResponseMessage = t("alerts:fallback.unknownClientErrorResponse.message");
	const fallbackUnknownServerErrorResponseTitle = t("alerts:fallback.unknownServerErrorResponse.title");
	const fallbackUnknownServerErrorResponseMessage = t("alerts:fallback.unknownServerErrorResponse.message");

	const fallback = {
		unknownResponse: {
			title: fallbackUnknownResponseTitle,
			message: fallbackUnknownResponseMessage,
			isSuccess: false
		},
		unknownClientErrorResponse: {
			title: fallbackUnknownClientErrorResponseTitle,
			message: fallbackUnknownClientErrorResponseMessage,
			isSuccess: false
		},
		unknownServerErrorResponse: {
			title: fallbackUnknownServerErrorResponseTitle,
			message: fallbackUnknownServerErrorResponseMessage,
			isSuccess: false
		}
	};

	return {
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
		fallback504GatewayTimeoutErrorResponse,
		fallbackUnknownResponseTitle,
		fallbackUnknownResponseMessage,
		fallbackUnknownClientErrorResponseTitle,
		fallbackUnknownClientErrorResponseMessage,
		fallbackUnknownServerErrorResponseTitle,
		fallbackUnknownServerErrorResponseMessage
	};
};
