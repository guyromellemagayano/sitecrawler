import { handleNotificationMessages } from "@helpers/handleNotificationMessages";
import { handleConversionStringToLowercase, handleConversionStringToNumber } from "@utils/convertCase";
import useTranslation from "next-translate/useTranslation";
import { FalllbackNotificationMessage } from "../fallback";

export const StripePaymentMethodNotificationMessage = ({
	dispatch,
	config,
	setConfig,
	state,
	isStripePaymentMethod
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

	// Stripe payment method translations
	const stripePaymentMethodGet200OkSuccessResponse = t("alerts:stripe.paymentMethod.get.200OkSuccessResponse");
	const stripePaymentMethodGet201CreatedSuccessResponse = t(
		"alerts:stripe.paymentMethod.get.201CreatedSuccessResponse"
	);
	const stripePaymentMethodGet400BadRequestErrorResponse = t(
		"alerts:stripe.paymentMethod.get.400BadRequestErrorResponse"
	);
	const stripePaymentMethodGet401UnauthorizedErrorResponse = t(
		"alerts:stripe.paymentMethod.get.401UnauthorizedErrorResponse"
	);
	const stripePaymentMethodGet403ForbiddenErrorResponse = t(
		"alerts:stripe.paymentMethod.get.403ForbiddenErrorResponse"
	);
	const stripePaymentMethodGet404NotFoundErrorResponse = t("alerts:stripe.paymentMethod.get.404NotFoundErrorResponse");
	const stripePaymentMethodGet429TooManyRequestsErrorResponse = t(
		"alerts:stripe.paymentMethod.get.429TooManyRequestsErrorResponse"
	);
	const stripePaymentMethodGet500InternalServerErrorResponse = t(
		"alerts:stripe.paymentMethod.get.500InternalServerErrorResponse"
	);
	const stripePaymentMethodGet502BadGatewayErrorResponse = t(
		"alerts:stripe.paymentMethod.get.502BadGatewayErrorResponse"
	);
	const stripePaymentMethodGet503ServiceUnavailableErrorResponse = t(
		"alerts:stripe.paymentMethod.get.503ServiceUnavailableErrorResponse"
	);
	const stripePaymentMethodGet504GatewayTimeoutErrorResponse = t(
		"alerts:stripe.paymentMethod.get.504GatewayTimeoutErrorResponse"
	);
	const stripePaymentMethodPost200OkSuccessResponse = t("alerts:stripe.paymentMethod.post.200OkSuccessResponse");
	const stripePaymentMethodPost201CreatedSuccessResponse = t(
		"alerts:stripe.paymentMethod.post.201CreatedSuccessResponse"
	);
	const stripePaymentMethodPost400BadRequestErrorResponse = t(
		"alerts:stripe.paymentMethod.post.400BadRequestErrorResponse"
	);
	const stripePaymentMethodPost401UnauthorizedErrorResponse = t(
		"alerts:stripe.paymentMethod.post.401UnauthorizedErrorResponse"
	);
	const stripePaymentMethodPost403ForbiddenErrorResponse = t(
		"alerts:stripe.paymentMethod.post.403ForbiddenErrorResponse"
	);
	const stripePaymentMethodPost404NotFoundErrorResponse = t(
		"alerts:stripe.paymentMethod.post.404NotFoundErrorResponse"
	);
	const stripePaymentMethodPost429TooManyRequestsErrorResponse = t(
		"alerts:stripe.paymentMethod.post.429TooManyRequestsErrorResponse"
	);
	const stripePaymentMethodPost500InternalServerErrorResponse = t(
		"alerts:stripe.paymentMethod.post.500InternalServerErrorResponse"
	);
	const stripePaymentMethodPost502BadGatewayErrorResponse = t(
		"alerts:stripe.paymentMethod.post.502BadGatewayErrorResponse"
	);
	const stripePaymentMethodPost503ServiceUnavailableErrorResponse = t(
		"alerts:stripe.paymentMethod.post.503ServiceUnavailableErrorResponse"
	);
	const stripePaymentMethodPost504GatewayTimeoutErrorResponse = t(
		"alerts:stripe.paymentMethod.post.504GatewayTimeoutErrorResponse"
	);

	let responsesArray = [];

	const postResponse = {
		method: "POST",
		responses: [
			{
				status: 200,
				title: fallback200OkSuccessResponse,
				message: stripePaymentMethodPost200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: stripePaymentMethodPost201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: stripePaymentMethodPost400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: stripePaymentMethodPost401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: stripePaymentMethodPost403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: stripePaymentMethodPost404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: stripePaymentMethodPost429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: stripePaymentMethodPost500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: stripePaymentMethodPost502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: stripePaymentMethodPost503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: stripePaymentMethodPost504GatewayTimeoutErrorResponse,
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
				message: stripePaymentMethodGet200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: stripePaymentMethodGet201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: stripePaymentMethodGet400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: stripePaymentMethodGet401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: stripePaymentMethodGet403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: stripePaymentMethodGet404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: stripePaymentMethodGet429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: stripePaymentMethodGet500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: stripePaymentMethodGet502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: stripePaymentMethodGet503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: stripePaymentMethodGet504GatewayTimeoutErrorResponse,
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

	handleNotificationMessages({
		dispatch,
		config,
		setConfig,
		state,
		isStripePaymentMethod,
		data,
		fallback
	});
};

export const StripePaymentMethodDefaultNotificationMessage = ({
	dispatch,
	config,
	setConfig,
	state,
	isStripePaymentMethodDefault
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

	// Stripe payment method default translations
	const stripePaymentMethodDefaultGet200OkSuccessResponse = t(
		"alerts:stripe.paymentMethod.default.get.200OkSuccessResponse"
	);
	const stripePaymentMethodDefaultGet201CreatedSuccessResponse = t(
		"alerts:stripe.paymentMethod.default.get.201CreatedSuccessResponse"
	);
	const stripePaymentMethodDefaultGet400BadRequestErrorResponse = t(
		"alerts:stripe.paymentMethod.default.get.400BadRequestErrorResponse"
	);
	const stripePaymentMethodDefaultGet401UnauthorizedErrorResponse = t(
		"alerts:stripe.paymentMethod.default.get.401UnauthorizedErrorResponse"
	);
	const stripePaymentMethodDefaultGet403ForbiddenErrorResponse = t(
		"alerts:stripe.paymentMethod.default.get.403ForbiddenErrorResponse"
	);
	const stripePaymentMethodDefaultGet404NotFoundErrorResponse = t(
		"alerts:stripe.paymentMethod.default.get.404NotFoundErrorResponse"
	);
	const stripePaymentMethodDefaultGet429TooManyRequestsErrorResponse = t(
		"alerts:stripe.paymentMethod.default.get.429TooManyRequestsErrorResponse"
	);
	const stripePaymentMethodDefaultGet500InternalServerErrorResponse = t(
		"alerts:stripe.paymentMethod.default.get.500InternalServerErrorResponse"
	);
	const stripePaymentMethodDefaultGet502BadGatewayErrorResponse = t(
		"alerts:stripe.paymentMethod.default.get.502BadGatewayErrorResponse"
	);
	const stripePaymentMethodDefaultGet503ServiceUnavailableErrorResponse = t(
		"alerts:stripe.paymentMethod.default.get.503ServiceUnavailableErrorResponse"
	);
	const stripePaymentMethodDefaultGet504GatewayTimeoutErrorResponse = t(
		"alerts:stripe.paymentMethod.default.get.504GatewayTimeoutErrorResponse"
	);

	return null;
};

export const StripeSubscriptionsNotificationMessage = ({
	dispatch,
	config,
	setConfig,
	state,
	isStripeSubscriptions
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

	// Stripe subscriptions
	const subscriptionsGet200OkSuccessResponse = t("alerts:stripe.subscriptions.get.200OkSuccessResponse");
	const subscriptionsGet201CreatedSuccessResponse = t("alerts:stripe.subscriptions.get.201CreatedSuccessResponse");
	const subscriptionsGet400BadRequestErrorResponse = t("alerts:stripe.subscriptions.get.400BadRequestErrorResponse");
	const subscriptionsGet401UnauthorizedErrorResponse = t(
		"alerts:stripe.subscriptions.get.401UnauthorizedErrorResponse"
	);
	const subscriptionsGet403ForbiddenErrorResponse = t("alerts:stripe.subscriptions.get.403ForbiddenErrorResponse");
	const subscriptionsGet404NotFoundErrorResponse = t("alerts:stripe.subscriptions.get.404NotFoundErrorResponse");
	const subscriptionsGet429TooManyRequestsErrorResponse = t(
		"alerts:stripe.subscriptions.get.429TooManyRequestsErrorResponse"
	);
	const subscriptionsGet500InternalServerErrorResponse = t(
		"alerts:stripe.subscriptions.get.500InternalServerErrorResponse"
	);
	const subscriptionsGet502BadGatewayErrorResponse = t("alerts:stripe.subscriptions.get.502BadGatewayErrorResponse");
	const subscriptionsGet503ServiceUnavailableErrorResponse = t(
		"alerts:stripe.subscriptions.get.503ServiceUnavailableErrorResponse"
	);
	const subscriptionsGet504GatewayTimeoutErrorResponse = t(
		"alerts:stripe.subscriptions.get.504GatewayTimeoutErrorResponse"
	);

	let responsesArray = [];

	const getResponse = {
		method: "GET",
		responses: [
			{
				status: 200,
				title: fallback200OkSuccessResponse,
				message: subscriptionsGet200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: subscriptionsGet201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: subscriptionsGet400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: subscriptionsGet401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: subscriptionsGet403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: subscriptionsGet404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: subscriptionsGet429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: subscriptionsGet500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: subscriptionsGet502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: subscriptionsGet503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: subscriptionsGet504GatewayTimeoutErrorResponse,
				isSuccess: false
			}
		]
	};

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
		isStripeSubscriptions,
		data,
		fallback
	});
};

export const StripeSubscriptionsCurrentNotificationMessage = ({
	dispatch,
	config,
	setConfig,
	state,
	isStripeSubscriptionsCurrent
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

	// Stripe current subscription
	const subscriptionsCurrentGet200OkSuccessResponse = t("alerts:stripe.subscriptions.current.get.200OkSuccessResponse");
	const subscriptionsCurrentGet201CreatedSuccessResponse = t(
		"alerts:stripe.subscriptions.current.get.201CreatedSuccessResponse"
	);
	const subscriptionsCurrentGet400BadRequestErrorResponse = t(
		"alerts:stripe.subscriptions.current.get.400BadRequestErrorResponse"
	);
	const subscriptionsCurrentGet401UnauthorizedErrorResponse = t(
		"alerts:stripe.subscriptions.current.get.401UnauthorizedErrorResponse"
	);
	const subscriptionsCurrentGet403ForbiddenErrorResponse = t(
		"alerts:stripe.subscriptions.current.get.403ForbiddenErrorResponse"
	);
	const subscriptionsCurrentGet404NotFoundErrorResponse = t(
		"alerts:stripe.subscriptions.current.get.404NotFoundErrorResponse"
	);
	const subscriptionsCurrentGet429TooManyRequestsErrorResponse = t(
		"alerts:stripe.subscriptions.current.get.429TooManyRequestsErrorResponse"
	);
	const subscriptionsCurrentGet500InternalServerErrorResponse = t(
		"alerts:stripe.subscriptions.current.get.500InternalServerErrorResponse"
	);
	const subscriptionsCurrentGet502BadGatewayErrorResponse = t(
		"alerts:stripe.subscriptions.current.get.502BadGatewayErrorResponse"
	);
	const subscriptionsCurrentGet503ServiceUnavailableErrorResponse = t(
		"alerts:stripe.subscriptions.current.get.503ServiceUnavailableErrorResponse"
	);
	const subscriptionsCurrentGet504GatewayTimeoutErrorResponse = t(
		"alerts:stripe.subscriptions.current.get.504GatewayTimeoutErrorResponse"
	);
	const subscriptionsCurrentPost200OkSuccessResponse = t(
		"alerts:stripe.subscriptions.current.post.200OkSuccessResponse"
	);
	const subscriptionsCurrentPost201CreatedSuccessResponse = t(
		"alerts:stripe.subscriptions.current.post.201CreatedSuccessResponse"
	);
	const subscriptionsCurrentPost400BadRequestErrorResponse = t(
		"alerts:stripe.subscriptions.current.post.400BadRequestErrorResponse"
	);
	const subscriptionsCurrentPost401UnauthorizedErrorResponse = t(
		"alerts:stripe.subscriptions.current.post.401UnauthorizedErrorResponse"
	);
	const subscriptionsCurrentPost403ForbiddenErrorResponse = t(
		"alerts:stripe.subscriptions.current.post.403ForbiddenErrorResponse"
	);
	const subscriptionsCurrentPost404NotFoundErrorResponse = t(
		"alerts:stripe.subscriptions.current.post.404NotFoundErrorResponse"
	);
	const subscriptionsCurrentPost429TooManyRequestsErrorResponse = t(
		"alerts:stripe.subscriptions.current.post.429TooManyRequestsErrorResponse"
	);
	const subscriptionsCurrentPost500InternalServerErrorResponse = t(
		"alerts:stripe.subscriptions.current.post.500InternalServerErrorResponse"
	);
	const subscriptionsCurrentPost502BadGatewayErrorResponse = t(
		"alerts:stripe.subscriptions.current.post.502BadGatewayErrorResponse"
	);
	const subscriptionsCurrentPost503ServiceUnavailableErrorResponse = t(
		"alerts:stripe.subscriptions.current.post.503ServiceUnavailableErrorResponse"
	);
	const subscriptionsCurrentPost504GatewayTimeoutErrorResponse = t(
		"alerts:stripe.subscriptions.current.post.504GatewayTimeoutErrorResponse"
	);
	const subscriptionsCurrentDelete200OkSuccessResponse = t(
		"alerts:stripe.subscriptions.current.delete.200OkSuccessResponse"
	);
	const subscriptionsCurrentDelete201CreatedSuccessResponse = t(
		"alerts:stripe.subscriptions.current.delete.201CreatedSuccessResponse"
	);
	const subscriptionsCurrentDelete204NoContentSuccessResponse = t(
		"alerts:stripe.subscriptions.current.delete.201CreatedSuccessResponse"
	);
	const subscriptionsCurrentDelete400BadRequestErrorResponse = t(
		"alerts:stripe.subscriptions.current.delete.400BadRequestErrorResponse"
	);
	const subscriptionsCurrentDelete401UnauthorizedErrorResponse = t(
		"alerts:stripe.subscriptions.current.delete.401UnauthorizedErrorResponse"
	);
	const subscriptionsCurrentDelete403ForbiddenErrorResponse = t(
		"alerts:stripe.subscriptions.current.delete.403ForbiddenErrorResponse"
	);
	const subscriptionsCurrentDelete404NotFoundErrorResponse = t(
		"alerts:stripe.subscriptions.current.delete.404NotFoundErrorResponse"
	);
	const subscriptionsCurrentDelete429TooManyRequestsErrorResponse = t(
		"alerts:stripe.subscriptions.current.delete.429TooManyRequestsErrorResponse"
	);
	const subscriptionsCurrentDelete500InternalServerErrorResponse = t(
		"alerts:stripe.subscriptions.current.delete.500InternalServerErrorResponse"
	);
	const subscriptionsCurrentDelete502BadGatewayErrorResponse = t(
		"alerts:stripe.subscriptions.current.delete.502BadGatewayErrorResponse"
	);
	const subscriptionsCurrentDelete503ServiceUnavailableErrorResponse = t(
		"alerts:stripe.subscriptions.current.delete.503ServiceUnavailableErrorResponse"
	);
	const subscriptionsCurrentDelete504GatewayTimeoutErrorResponse = t(
		"alerts:stripe.subscriptions.current.delete.504GatewayTimeoutErrorResponse"
	);

	let responsesArray = [];

	const postResponse = {
		method: "POST",
		responses: [
			{
				status: 200,
				title: fallback200OkSuccessResponse,
				message: subscriptionsCurrentPost200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: subscriptionsCurrentPost201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: subscriptionsCurrentPost400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: subscriptionsCurrentPost401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: subscriptionsCurrentPost403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: subscriptionsCurrentPost404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: subscriptionsCurrentPost429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: subscriptionsCurrentPost500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: subscriptionsCurrentPost502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: subscriptionsCurrentPost503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: subscriptionsCurrentPost504GatewayTimeoutErrorResponse,
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
				message: subscriptionsCurrentGet200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: subscriptionsCurrentGet201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: subscriptionsCurrentGet400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: subscriptionsCurrentGet401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: subscriptionsCurrentGet403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: subscriptionsCurrentGet404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: subscriptionsCurrentGet429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: subscriptionsCurrentGet500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: subscriptionsCurrentGet502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: subscriptionsCurrentGet503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: subscriptionsCurrentGet504GatewayTimeoutErrorResponse,
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
				message: subscriptionsCurrentDelete200OkSuccessResponse,
				isSuccess: true
			},
			{
				status: 201,
				title: fallback201CreatedSuccessResponse,
				message: subscriptionsCurrentDelete201CreatedSuccessResponse,
				isSuccess: true
			},
			{
				status: 204,
				title: fallback204NoContentSuccessResponse,
				message: subscriptionsCurrentDelete204NoContentSuccessResponse,
				isSuccess: true
			},
			{
				status: 400,
				title: fallback400BadRequestErrorResponse,
				message: subscriptionsCurrentDelete400BadRequestErrorResponse,
				isSuccess: false
			},
			{
				status: 401,
				title: fallback401UnauthorizedErrorResponse,
				message: subscriptionsCurrentDelete401UnauthorizedErrorResponse,
				isSuccess: false
			},
			{
				status: 403,
				title: fallback403ForbiddenErrorResponse,
				message: subscriptionsCurrentDelete403ForbiddenErrorResponse,
				isSuccess: false
			},
			{
				status: 404,
				title: fallback404NotFoundErrorResponse,
				message: subscriptionsCurrentDelete404NotFoundErrorResponse,
				isSuccess: false
			},
			{
				status: 429,
				title: fallback429TooManyRequestsErrorResponse,
				message: subscriptionsCurrentDelete429TooManyRequestsErrorResponse,
				isSuccess: false
			},
			{
				status: 500,
				title: fallback500InternalServerErrorResponse,
				message: subscriptionsCurrentDelete500InternalServerErrorResponse,
				isSuccess: false
			},
			{
				status: 502,
				title: fallback502BadGatewayErrorResponse,
				message: subscriptionsCurrentDelete502BadGatewayErrorResponse,
				isSuccess: false
			},
			{
				status: 503,
				title: fallback503ServiceUnavailableErrorResponse,
				message: subscriptionsCurrentDelete503ServiceUnavailableErrorResponse,
				isSuccess: false
			},
			{
				status: 504,
				title: fallback504GatewayTimeoutErrorResponse,
				message: subscriptionsCurrentDelete504GatewayTimeoutErrorResponse,
				isSuccess: false
			}
		]
	};

	responsesArray.push(postResponse);
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
		isStripeSubscriptionsCurrent,
		data,
		fallback
	});
};
