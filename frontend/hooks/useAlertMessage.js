import { handleAlertMessages } from "@helpers/handleAlertMessages";
import { handleConversionStringToLowercase, handleConversionStringToNumber } from "@utils/convertCase";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useReducer, useState } from "react";
import "twin.macro";

const messagesReducer = (state, action) => {
	return {
		...state,
		...action
	};
};

/**
 * Custom hook that will handle success and error messages
 */
export const useAlertMessage = () => {
	const [config, setConfig] = useState({
		isLocalTimeEnabled: false,
		isLocalTimeDisabled: false,
		isLogin: false,
		isLogout: false,
		isPasswordChange: false,
		isPasswordReset: false,
		isPasswordResetConfirm: false,
		isUrlInformationStep: false,
		isVerifyUrlStep: false,
		isRegistration: false,
		isSignup: false,
		isSite: false,
		isSites: false,
		isStats: false,
		isPaymentMethod: false,
		isSubscriptions: false,
		isSupport: false,
		isUser: false,
		isError: null,
		method: null,
		status: null,
		responses: []
	});

	const [state, dispatch] = useReducer(messagesReducer, config);

	// Translations
	const { t } = useTranslation();

	// User translations
	const userDelete200OkSuccessResponse = t("alerts:auth.user.delete.200OkSuccessResponse");
	const userDelete201CreatedSuccessResponse = t("alerts:auth.user.delete.201CreatedSuccessResponse");
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

	// Support translations
	const supportPost200OkSuccessResponse = t("alerts:support.post.200OkSuccessResponse");
	const supportPost201CreatedSuccessResponse = t("alerts:support.post.201CreatedSuccessResponse");
	const supportPost400BadRequestErrorResponse = t("alerts:support.post.400BadRequestErrorResponse");
	const supportPost401UnauthorizedErrorResponse = t("alerts:support.post.401UnauthorizedErrorResponse");
	const supportPost403ForbiddenErrorResponse = t("alerts:support.post.403ForbiddenErrorResponse");
	const supportPost404NotFoundErrorResponse = t("alerts:support.post.404NotFoundErrorResponse");
	const supportPost429TooManyRequestsErrorResponse = t("alerts:support.post.201CreatedSuccessResponse");
	const supportPost500InternalServerErrorResponse = t("alerts:support.post.500InternalServerErrorResponse");
	const supportPost502BadGatewayErrorResponse = t("alerts:support.post.502BadGatewayErrorResponse");
	const supportPost503ServiceUnavailableErrorResponse = t("alerts:support.post.503ServiceUnavailableErrorResponse");
	const supportPost504GatewayTimeoutErrorResponse = t("alerts:support.post.504GatewayTimeoutErrorResponse");

	// Login translations
	const loginPost200OkSuccessResponse = t("alerts:auth.login.post.200OkSuccessResponse");
	const loginPost201CreatedSuccessResponse = t("alerts:auth.login.post.201CreatedSuccessResponse");
	const loginPost400BadRequestErrorResponse = t("alerts:auth.login.post.400BadRequestErrorResponse");
	const loginPost401UnauthorizedErrorResponse = t("alerts:auth.login.post.401UnauthorizedErrorResponse");
	const loginPost403ForbiddenErrorResponse = t("alerts:auth.login.post.403ForbiddenErrorResponse");
	const loginPost404NotFoundErrorResponse = t("alerts:auth.login.post.404NotFoundErrorResponse");
	const loginPost429TooManyRequestsErrorResponse = t("alerts:auth.login.post.429TooManyRequestsErrorResponse");
	const loginPost500InternalServerErrorResponse = t("alerts:auth.login.post.500InternalServerErrorResponse");
	const loginPost502BadGatewayErrorResponse = t("alerts:auth.login.post.502BadGatewayErrorResponse");
	const loginPost503ServiceUnavailableErrorResponse = t("alerts:auth.login.post.503ServiceUnavailableErrorResponse");
	const loginPost504GatewayTimeoutErrorResponse = t("alerts:auth.login.post.504GatewayTimeoutErrorResponse");

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

	// Payment method translations
	const paymentMethodGet200OkSuccessResponse = t("alerts:stripe.paymentMethod.get.200OkSuccessResponse");
	const paymentMethodGet201CreatedSuccessResponse = t("alerts:stripe.paymentMethod.get.201CreatedSuccessResponse");
	const paymentMethodGet400BadRequestErrorResponse = t("alerts:stripe.paymentMethod.get.400BadRequestErrorResponse");
	const paymentMethodGet401UnauthorizedErrorResponse = t(
		"alerts:stripe.paymentMethod.get.401UnauthorizedErrorResponse"
	);
	const paymentMethodGet403ForbiddenErrorResponse = t("alerts:stripe.paymentMethod.get.403ForbiddenErrorResponse");
	const paymentMethodGet404NotFoundErrorResponse = t("alerts:stripe.paymentMethod.get.404NotFoundErrorResponse");
	const paymentMethodGet429TooManyRequestsErrorResponse = t(
		"alerts:stripe.paymentMethod.get.429TooManyRequestsErrorResponse"
	);
	const paymentMethodGet500InternalServerErrorResponse = t(
		"alerts:stripe.paymentMethod.get.500InternalServerErrorResponse"
	);
	const paymentMethodGet502BadGatewayErrorResponse = t("alerts:stripe.paymentMethod.get.502BadGatewayErrorResponse");
	const paymentMethodGet503ServiceUnavailableErrorResponse = t(
		"alerts:stripe.paymentMethod.get.503ServiceUnavailableErrorResponse"
	);
	const paymentMethodGet504GatewayTimeoutErrorResponse = t(
		"alerts:stripe.paymentMethod.get.504GatewayTimeoutErrorResponse"
	);
	const paymentMethodPost200OkSuccessResponse = t("alerts:stripe.paymentMethod.post.200OkSuccessResponse");
	const paymentMethodPost201CreatedSuccessResponse = t("alerts:stripe.paymentMethod.post.201CreatedSuccessResponse");
	const paymentMethodPost400BadRequestErrorResponse = t("alerts:stripe.paymentMethod.post.400BadRequestErrorResponse");
	const paymentMethodPost401UnauthorizedErrorResponse = t(
		"alerts:stripe.paymentMethod.post.401UnauthorizedErrorResponse"
	);
	const paymentMethodPost403ForbiddenErrorResponse = t("alerts:stripe.paymentMethod.post.403ForbiddenErrorResponse");
	const paymentMethodPost404NotFoundErrorResponse = t("alerts:stripe.paymentMethod.post.404NotFoundErrorResponse");
	const paymentMethodPost429TooManyRequestsErrorResponse = t(
		"alerts:stripe.paymentMethod.post.201CreatedSuccessResponse"
	);
	const paymentMethodPost500InternalServerErrorResponse = t(
		"alerts:stripe.paymentMethod.post.500InternalServerErrorResponse"
	);
	const paymentMethodPost502BadGatewayErrorResponse = t("alerts:stripe.paymentMethod.post.502BadGatewayErrorResponse");
	const paymentMethodPost503ServiceUnavailableErrorResponse = t(
		"alerts:stripe.paymentMethod.post.503ServiceUnavailableErrorResponse"
	);
	const paymentMethodPost504GatewayTimeoutErrorResponse = t(
		"alerts:stripe.paymentMethod.post.504GatewayTimeoutErrorResponse"
	);

	// Logout translations
	const logoutGet200OkSuccessResponse = t("alerts:auth.logout.get.200OkSuccessResponse");
	const logoutGet400BadRequestErrorResponse = t("alerts:auth.logout.get.400BadRequestErrorResponse");
	const logoutGet401UnauthorizedErrorResponse = t("alerts:auth.logout.get.401UnauthorizedErrorResponse");
	const logoutGet403ForbiddenErrorResponse = t("alerts:auth.logout.get.403ForbiddenErrorResponse");
	const logoutGet404NotFoundErrorResponse = t("alerts:auth.logout.get.404NotFoundErrorResponse");
	const logoutGet429TooManyRequestsErrorResponse = t("alerts:auth.logout.get.429TooManyRequestsErrorResponse");
	const logoutGet500InternalServerErrorResponse = t("alerts:auth.logout.get.500InternalServerErrorResponse");
	const logoutGet502BadGatewayErrorResponse = t("alerts:auth.logout.get.502BadGatewayErrorResponse");
	const logoutGet503ServiceUnavailableErrorResponse = t("alerts:auth.logout.get.503ServiceUnavailableErrorResponse");
	const logoutGet504GatewayTimeoutErrorResponse = t("alerts:auth.logout.get.504GatewayTimeoutErrorResponse");
	const logoutPost201CreatedSuccessResponse = t("alerts:auth.logout.post.201CreatedSuccessResponse");
	const logoutPost400BadRequestErrorResponse = t("alerts:auth.logout.post.400BadRequestErrorResponse");
	const logoutPost401UnauthorizedErrorResponse = t("alerts:auth.logout.post.401UnauthorizedErrorResponse");
	const logoutPost403ForbiddenErrorResponse = t("alerts:auth.logout.post.403ForbiddenErrorResponse");
	const logoutPost404NotFoundErrorResponse = t("alerts:auth.logout.post.404NotFoundErrorResponse");
	const logoutPost429TooManyRequestsErrorResponse = t("alerts:auth.logout.post.201CreatedSuccessResponse");
	const logoutPost500InternalServerErrorResponse = t("alerts:auth.logout.post.500InternalServerErrorResponse");
	const logoutPost502BadGatewayErrorResponse = t("alerts:auth.logout.post.502BadGatewayErrorResponse");
	const logoutPost503ServiceUnavailableErrorResponse = t("alerts:auth.logout.post.503ServiceUnavailableErrorResponse");
	const logoutPost504GatewayTimeoutErrorResponse = t("alerts:auth.logout.post.504GatewayTimeoutErrorResponse");

	// Fallback translations
	const fallbackUnknownResponse = t("alerts:fallback.unknownResponse");
	const fallbackUnknownClientErrorResponse = t("alerts:fallback.unknownClientErrorResponse");
	const fallbackUnknownServerErrorResponse = t("alerts:fallback.unknownServerErrorResponse");

	useEffect(() => {
		if (config) {
			const isLocalTimeEnabled = config?.isLocalTimeEnabled ?? false;
			const isLocalTimeDisabled = config?.isLocalTimeDisabled ?? false;
			const isLogin = config?.isLogin ?? false;
			const isLogout = config?.isLogout ?? false;
			const isPasswordChange = config?.isPasswordChange ?? false;
			const isPasswordReset = config?.isPasswordReset ?? false;
			const isPasswordResetConfirm = config?.isPasswordResetConfirm ?? false;
			const isUrlInformationStep = config?.isUrlInformationStep ?? false;
			const isVerifyUrlStep = config?.isVerifyUrlStep ?? false;
			const isRegistration = config?.isRegistration ?? false;
			const isSignup = config?.isSignup ?? false;
			const isSite = config?.isSite ?? false;
			const isSites = config?.isSites ?? false;
			const isStats = config?.isStats ?? false;
			const isPaymentMethod = config?.isPaymentMethod ?? false;
			const isSubscriptions = config?.isSubscriptions ?? false;
			const isSupport = config?.isSupport ?? false;
			const isUser = config?.isUser ?? false;
			const isError = config?.isError ?? null;
			const method = config?.method ?? null;
			const status = config?.status ?? null;

			const fallback = {
				unknownResponse: {
					message: fallbackUnknownResponse,
					isSuccess: false
				},
				unknownClientErrorResponse: {
					message: fallbackUnknownClientErrorResponse,
					isSuccess: false
				},
				unknownServerErrorResponse: {
					message: fallbackUnknownServerErrorResponse,
					isSuccess: false
				}
			};

			if (
				status !== null &&
				method !== null &&
				(isLocalTimeEnabled ||
					isLocalTimeDisabled ||
					isLogin ||
					isLogout ||
					isPasswordChange ||
					isPasswordReset ||
					isPasswordResetConfirm ||
					isUrlInformationStep ||
					isVerifyUrlStep ||
					isRegistration ||
					isSignup ||
					isSite ||
					isSites ||
					isStats ||
					isPaymentMethod ||
					isSubscriptions ||
					isSupport ||
					isUser)
			) {
				if (isUser) {
					let responsesArray = [];

					const deleteResponse = {
						method: "DELETE",
						responses: [
							{
								status: 200,
								message: userDelete200OkSuccessResponse,
								isSuccess: true
							},
							{
								status: 201,
								message: userDelete201CreatedSuccessResponse,
								isSuccess: true
							},
							{
								status: 400,
								message: userDelete400BadRequestErrorResponse,
								isSuccess: false
							},
							{
								status: 401,
								message: userDelete401UnauthorizedErrorResponse,
								isSuccess: false
							},
							{
								status: 403,
								message: userDelete403ForbiddenErrorResponse,
								isSuccess: false
							},
							{
								status: 404,
								message: userDelete404NotFoundErrorResponse,
								isSuccess: false
							},
							{
								status: 429,
								message: userDelete429TooManyRequestsErrorResponse,
								isSuccess: false
							},
							{
								status: 500,
								message: userDelete500InternalServerErrorResponse,
								isSuccess: false
							},
							{
								status: 502,
								message: userDelete502BadGatewayErrorResponse,
								isSuccess: false
							},
							{
								status: 503,
								message: userDelete503ServiceUnavailableErrorResponse,
								isSuccess: false
							},
							{
								status: 504,
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
								message: userGet200OkSuccessResponse,
								isSuccess: true
							},
							{
								status: 201,
								message: userGet201CreatedSuccessResponse,
								isSuccess: true
							},
							{
								status: 400,
								message: userGet400BadRequestErrorResponse,
								isSuccess: false
							},
							{
								status: 401,
								message: userGet401UnauthorizedErrorResponse,
								isSuccess: false
							},
							{
								status: 403,
								message: userGet403ForbiddenErrorResponse,
								isSuccess: false
							},
							{
								status: 404,
								message: userGet404NotFoundErrorResponse,
								isSuccess: false
							},
							{
								status: 429,
								message: userGet429TooManyRequestsErrorResponse,
								isSuccess: false
							},
							{
								status: 500,
								message: userGet500InternalServerErrorResponse,
								isSuccess: false
							},
							{
								status: 502,
								message: userGet502BadGatewayErrorResponse,
								isSuccess: false
							},
							{
								status: 503,
								message: userGet503ServiceUnavailableErrorResponse,
								isSuccess: false
							},
							{
								status: 504,
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
								message: userPatch200OkSuccessResponse,
								isSuccess: true
							},
							{
								status: 201,
								message: userPatch201CreatedSuccessResponse,
								isSuccess: true
							},
							{
								status: 400,
								message: userPatch400BadRequestErrorResponse,
								isSuccess: false
							},
							{
								status: 401,
								message: userPatch401UnauthorizedErrorResponse,
								isSuccess: false
							},
							{
								status: 403,
								message: userPatch403ForbiddenErrorResponse,
								isSuccess: false
							},
							{
								status: 404,
								message: userPatch404NotFoundErrorResponse,
								isSuccess: false
							},
							{
								status: 429,
								message: userPatch429TooManyRequestsErrorResponse,
								isSuccess: false
							},
							{
								status: 500,
								message: userPatch500InternalServerErrorResponse,
								isSuccess: false
							},
							{
								status: 502,
								message: userPatch502BadGatewayErrorResponse,
								isSuccess: false
							},
							{
								status: 503,
								message: userPatch503ServiceUnavailableErrorResponse,
								isSuccess: false
							},
							{
								status: 504,
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
								message: userPut200OkSuccessResponse,
								isSuccess: true
							},
							{
								status: 201,
								message: userPut201CreatedSuccessResponse,
								isSuccess: true
							},
							{
								status: 400,
								message: userPut400BadRequestErrorResponse,
								isSuccess: false
							},
							{
								status: 401,
								message: userPut401UnauthorizedErrorResponse,
								isSuccess: false
							},
							{
								status: 403,
								message: userPut403ForbiddenErrorResponse,
								isSuccess: false
							},
							{
								status: 404,
								message: userPut404NotFoundErrorResponse,
								isSuccess: false
							},
							{
								status: 429,
								message: userPut429TooManyRequestsErrorResponse,
								isSuccess: false
							},
							{
								status: 500,
								message: userPut500InternalServerErrorResponse,
								isSuccess: false
							},
							{
								status: 502,
								message: userPut502BadGatewayErrorResponse,
								isSuccess: false
							},
							{
								status: 503,
								message: userPut503ServiceUnavailableErrorResponse,
								isSuccess: false
							},
							{
								status: 504,
								message: userPut504GatewayTimeoutErrorResponse,
								isSuccess: false
							}
						]
					};

					responsesArray.push(deleteResponse);
					responsesArray.push(getResponse);
					responsesArray.push(deleteResponse);
					responsesArray.push(patchResponse);

					const data = responsesArray
						?.find(
							(datum) =>
								handleConversionStringToLowercase(datum.method) === handleConversionStringToLowercase(config.method)
						)
						?.responses?.find(
							(response) =>
								handleConversionStringToNumber(response.status) === handleConversionStringToNumber(config.status)
						);

					handleAlertMessages({ dispatch, config, setConfig, state, isUser, data, fallback });
				} else if (isLocalTimeEnabled) {
					let responsesArray = [];

					const postResponse = {
						method: "POST",
						responses: [
							{
								status: 200,
								message: localTimeEnabled200OkSuccessResponse,
								isSuccess: true
							},
							{
								status: 201,
								message: localTimeEnabled201CreatedSuccessResponse,
								isSuccess: true
							},
							{
								status: 400,
								message: localTimeEnabled400BadRequestErrorResponse,
								isSuccess: false
							},
							{
								status: 401,
								message: localTimeEnabled401UnauthorizedErrorResponse,
								isSuccess: false
							},
							{
								status: 403,
								message: localTimeEnabled403ForbiddenErrorResponse,
								isSuccess: false
							},
							{
								status: 404,
								message: localTimeEnabled404NotFoundErrorResponse,
								isSuccess: false
							},
							{
								status: 429,
								message: localTimeEnabled429TooManyRequestsErrorResponse,
								isSuccess: false
							},
							{
								status: 500,
								message: localTimeEnabled500InternalServerErrorResponse,
								isSuccess: false
							},
							{
								status: 502,
								message: localTimeEnabled502BadGatewayErrorResponse,
								isSuccess: false
							},
							{
								status: 503,
								message: localTimeEnabled503ServiceUnavailableErrorResponse,
								isSuccess: false
							},
							{
								status: 504,
								message: localTimeEnabled504GatewayTimeoutErrorResponse,
								isSuccess: false
							}
						]
					};

					responsesArray.push(postResponse);

					handleAlertMessages({
						dispatch,
						config,
						setConfig,
						state,
						isLocalTimeEnabled,
						data: responsesArray,
						fallback
					});
				} else if (isLocalTimeDisabled) {
					let responsesArray = [];

					const postResponse = {
						method: "POST",
						responses: [
							{
								status: 200,
								message: localTimeDisabled200OkSuccessResponse,
								isSuccess: true
							},
							{
								status: 201,
								message: localTimeDisabled201CreatedSuccessResponse,
								isSuccess: true
							},
							{
								status: 400,
								message: localTimeDisabled400BadRequestErrorResponse,
								isSuccess: false
							},
							{
								status: 401,
								message: localTimeDisabled401UnauthorizedErrorResponse,
								isSuccess: false
							},
							{
								status: 403,
								message: localTimeDisabled403ForbiddenErrorResponse,
								isSuccess: false
							},
							{
								status: 404,
								message: localTimeDisabled404NotFoundErrorResponse,
								isSuccess: false
							},
							{
								status: 429,
								message: localTimeDisabled429TooManyRequestsErrorResponse,
								isSuccess: false
							},
							{
								status: 500,
								message: localTimeDisabled500InternalServerErrorResponse,
								isSuccess: false
							},
							{
								status: 502,
								message: localTimeDisabled502BadGatewayErrorResponse,
								isSuccess: false
							},
							{
								status: 503,
								message: localTimeDisabled503ServiceUnavailableErrorResponse,
								isSuccess: false
							},
							{
								status: 504,
								message: localTimeDisabled504GatewayTimeoutErrorResponse,
								isSuccess: false
							}
						]
					};

					responsesArray.push(postResponse);

					handleAlertMessages({
						dispatch,
						config,
						setConfig,
						state,
						isLocalTimeDisabled,
						data: responsesArray,
						fallback
					});
				} else if (isLogin) {
					let responsesArray = [];

					const postResponse = {
						method: "POST",
						responses: [
							{
								status: 200,
								message: loginPost200OkSuccessResponse,
								isSuccess: true
							},
							{
								status: 201,
								message: loginPost201CreatedSuccessResponse,
								isSuccess: true
							},
							{
								status: 400,
								message: loginPost400BadRequestErrorResponse,
								isSuccess: false
							},
							{
								status: 401,
								message: loginPost401UnauthorizedErrorResponse,
								isSuccess: false
							},
							{
								status: 403,
								message: loginPost403ForbiddenErrorResponse,
								isSuccess: false
							},
							{
								status: 404,
								message: loginPost404NotFoundErrorResponse,
								isSuccess: false
							},
							{
								status: 429,
								message: loginPost429TooManyRequestsErrorResponse,
								isSuccess: false
							},
							{
								status: 500,
								message: loginPost500InternalServerErrorResponse,
								isSuccess: false
							},
							{
								status: 502,
								message: loginPost502BadGatewayErrorResponse,
								isSuccess: false
							},
							{
								status: 503,
								message: loginPost503ServiceUnavailableErrorResponse,
								isSuccess: false
							},
							{
								status: 504,
								message: loginPost504GatewayTimeoutErrorResponse,
								isSuccess: false
							}
						]
					};

					responsesArray.push(postResponse);

					const data = responsesArray
						?.find(
							(datum) =>
								handleConversionStringToLowercase(datum.method) === handleConversionStringToLowercase(config.method)
						)
						?.responses?.find(
							(response) =>
								handleConversionStringToNumber(response.status) === handleConversionStringToNumber(config.status)
						);

					handleAlertMessages({ dispatch, config, setConfig, state, isLogin, data, fallback });
				} else if (isLogout) {
					let responsesArray = [];

					const postResponse = {
						method: "POST",
						responses: [
							{
								status: 201,
								message: logoutPost201CreatedSuccessResponse,
								isSuccess: true
							},
							{
								status: 400,
								message: logoutPost400BadRequestErrorResponse,
								isSuccess: false
							},
							{
								status: 401,
								message: logoutPost401UnauthorizedErrorResponse,
								isSuccess: false
							},
							{
								status: 403,
								message: logoutPost403ForbiddenErrorResponse,
								isSuccess: false
							},
							{
								status: 404,
								message: logoutPost404NotFoundErrorResponse,
								isSuccess: false
							},
							{
								status: 429,
								message: logoutPost429TooManyRequestsErrorResponse,
								isSuccess: false
							},
							{
								status: 500,
								message: logoutPost500InternalServerErrorResponse,
								isSuccess: false
							},
							{
								status: 502,
								message: logoutPost502BadGatewayErrorResponse,
								isSuccess: false
							},
							{
								status: 503,
								message: logoutPost503ServiceUnavailableErrorResponse,
								isSuccess: false
							},
							{
								status: 504,
								message: logoutPost504GatewayTimeoutErrorResponse,
								isSuccess: false
							}
						]
					};
					const getResponse = {
						method: "GET",
						responses: [
							{
								status: 200,
								message: logoutGet200OkSuccessResponse,
								isSuccess: true
							},
							{
								status: 400,
								message: logoutGet400BadRequestErrorResponse,
								isSuccess: false
							},
							{
								status: 401,
								message: logoutGet401UnauthorizedErrorResponse,
								isSuccess: false
							},
							{
								status: 403,
								message: logoutGet403ForbiddenErrorResponse,
								isSuccess: false
							},
							{
								status: 404,
								message: logoutGet404NotFoundErrorResponse,
								isSuccess: false
							},
							{
								status: 429,
								message: logoutGet429TooManyRequestsErrorResponse,
								isSuccess: false
							},
							{
								status: 500,
								message: logoutGet500InternalServerErrorResponse,
								isSuccess: false
							},
							{
								status: 502,
								message: logoutGet502BadGatewayErrorResponse,
								isSuccess: false
							},
							{
								status: 503,
								message: logoutGet503ServiceUnavailableErrorResponse,
								isSuccess: false
							},
							{
								status: 504,
								message: logoutGet504GatewayTimeoutErrorResponse,
								isSuccess: false
							}
						]
					};

					responsesArray.push(postResponse);
					responsesArray.push(getResponse);

					const data = responsesArray
						?.find(
							(datum) =>
								handleConversionStringToLowercase(datum.method) === handleConversionStringToLowercase(config.method)
						)
						?.responses?.find(
							(response) =>
								handleConversionStringToNumber(response.status) === handleConversionStringToNumber(config.status)
						);

					handleAlertMessages({ dispatch, config, setConfig, state, isLogout, data, fallback });
				} else if (isRegistration) {
					let responsesArray = [];

					const postResponse = {
						method: "POST",
						responses: [
							{
								status: 200,
								message: registrationPost200OkSuccessResponse,
								isSuccess: true
							},
							{
								status: 201,
								message: registrationPost201CreatedSuccessResponse,
								isSuccess: true
							},
							{
								status: 400,
								message: registrationPost400BadRequestErrorResponse,
								isSuccess: false
							},
							{
								status: 401,
								message: registrationPost401UnauthorizedErrorResponse,
								isSuccess: false
							},
							{
								status: 403,
								message: registrationPost403ForbiddenErrorResponse,
								isSuccess: false
							},
							{
								status: 404,
								message: registrationPost404NotFoundErrorResponse,
								isSuccess: false
							},
							{
								status: 429,
								message: registrationPost429TooManyRequestsErrorResponse,
								isSuccess: false
							},
							{
								status: 500,
								message: registrationPost500InternalServerErrorResponse,
								isSuccess: false
							},
							{
								status: 502,
								message: registrationPost502BadGatewayErrorResponse,
								isSuccess: false
							},
							{
								status: 503,
								message: registrationPost503ServiceUnavailableErrorResponse,
								isSuccess: false
							},
							{
								status: 504,
								message: registrationPost504GatewayTimeoutErrorResponse,
								isSuccess: false
							}
						]
					};

					responsesArray.push(postResponse);

					const data = responsesArray
						?.find(
							(datum) =>
								handleConversionStringToLowercase(datum.method) === handleConversionStringToLowercase(config.method)
						)
						?.responses?.find(
							(response) =>
								handleConversionStringToNumber(response.status) === handleConversionStringToNumber(config.status)
						);

					handleAlertMessages({ dispatch, config, setConfig, state, isRegistration, data, fallback });
				} else if (isPasswordChange) {
					let responsesArray = [];

					const postResponse = {
						method: "POST",
						responses: [
							{
								status: 200,
								message: passwordChangePost200OkSuccessResponse,
								isSuccess: true
							},
							{
								status: 201,
								message: passwordChangePost201CreatedSuccessResponse,
								isSuccess: true
							},
							{
								status: 400,
								message: passwordChangePost400BadRequestErrorResponse,
								isSuccess: false
							},
							{
								status: 401,
								message: passwordChangePost401UnauthorizedErrorResponse,
								isSuccess: false
							},
							{
								status: 403,
								message: passwordChangePost403ForbiddenErrorResponse,
								isSuccess: false
							},
							{
								status: 404,
								message: passwordChangePost404NotFoundErrorResponse,
								isSuccess: false
							},
							{
								status: 429,
								message: passwordChangePost429TooManyRequestsErrorResponse,
								isSuccess: false
							},
							{
								status: 500,
								message: passwordChangePost500InternalServerErrorResponse,
								isSuccess: false
							},
							{
								status: 502,
								message: passwordChangePost502BadGatewayErrorResponse,
								isSuccess: false
							},
							{
								status: 503,
								message: passwordChangePost503ServiceUnavailableErrorResponse,
								isSuccess: false
							},
							{
								status: 504,
								message: passwordChangePost504GatewayTimeoutErrorResponse,
								isSuccess: false
							}
						]
					};

					responsesArray.push(postResponse);

					const data = responsesArray
						?.find(
							(datum) =>
								handleConversionStringToLowercase(datum.method) === handleConversionStringToLowercase(config.method)
						)
						?.responses?.find(
							(response) =>
								handleConversionStringToNumber(response.status) === handleConversionStringToNumber(config.status)
						);

					handleAlertMessages({ dispatch, config, setConfig, state, isPasswordChange, data, fallback });
				} else if (isPasswordReset) {
					let responsesArray = [];

					const postResponse = {
						method: "POST",
						responses: [
							{
								status: 200,
								message: passwordResetPost200OkSuccessResponse,
								isSuccess: true
							},
							{
								status: 201,
								message: passwordResetPost201CreatedSuccessResponse,
								isSuccess: true
							},
							{
								status: 400,
								message: passwordResetPost400BadRequestErrorResponse,
								isSuccess: false
							},
							{
								status: 401,
								message: passwordResetPost401UnauthorizedErrorResponse,
								isSuccess: false
							},
							{
								status: 403,
								message: passwordResetPost403ForbiddenErrorResponse,
								isSuccess: false
							},
							{
								status: 404,
								message: passwordResetPost404NotFoundErrorResponse,
								isSuccess: false
							},
							{
								status: 429,
								message: passwordResetPost429TooManyRequestsErrorResponse,
								isSuccess: false
							},
							{
								status: 500,
								message: passwordResetPost500InternalServerErrorResponse,
								isSuccess: false
							},
							{
								status: 502,
								message: passwordResetPost502BadGatewayErrorResponse,
								isSuccess: false
							},
							{
								status: 503,
								message: passwordResetPost503ServiceUnavailableErrorResponse,
								isSuccess: false
							},
							{
								status: 504,
								message: passwordResetPost504GatewayTimeoutErrorResponse,
								isSuccess: false
							}
						]
					};

					responsesArray.push(postResponse);

					const data = responsesArray
						?.find(
							(datum) =>
								handleConversionStringToLowercase(datum.method) === handleConversionStringToLowercase(config.method)
						)
						?.responses?.find(
							(response) =>
								handleConversionStringToNumber(response.status) === handleConversionStringToNumber(config.status)
						);

					handleAlertMessages({ dispatch, config, setConfig, state, isPasswordReset, data, fallback });
				} else if (isPasswordResetConfirm) {
					let responsesArray = [];

					const postResponse = {
						method: "POST",
						responses: [
							{
								status: 200,
								message: passwordResetConfirmPost200OkSuccessResponse,
								isSuccess: true
							},
							{
								status: 201,
								message: passwordResetConfirmPost201CreatedSuccessResponse,
								isSuccess: true
							},
							{
								status: 400,
								message: passwordResetConfirmPost400BadRequestErrorResponse,
								isSuccess: false
							},
							{
								status: 401,
								message: passwordResetConfirmPost401UnauthorizedErrorResponse,
								isSuccess: false
							},
							{
								status: 403,
								message: passwordResetConfirmPost403ForbiddenErrorResponse,
								isSuccess: false
							},
							{
								status: 404,
								message: passwordResetConfirmPost404NotFoundErrorResponse,
								isSuccess: false
							},
							{
								status: 429,
								message: passwordResetConfirmPost429TooManyRequestsErrorResponse,
								isSuccess: false
							},
							{
								status: 500,
								message: passwordResetConfirmPost500InternalServerErrorResponse,
								isSuccess: false
							},
							{
								status: 502,
								message: passwordResetConfirmPost502BadGatewayErrorResponse,
								isSuccess: false
							},
							{
								status: 503,
								message: passwordResetConfirmPost503ServiceUnavailableErrorResponse,
								isSuccess: false
							},
							{
								status: 504,
								message: passwordResetConfirmPost504GatewayTimeoutErrorResponse,
								isSuccess: false
							}
						]
					};

					responsesArray.push(postResponse);

					handleAlertMessages({
						dispatch,
						config,
						setConfig,
						state,
						isPasswordResetConfirm,
						data: responsesArray,
						fallback
					});
				} else if (isUrlInformationStep) {
					let responsesArray = [];

					const patchResponse = {
						method: "POST",
						responses: [
							{
								status: 200,
								message: urlInformationStepPatch200OkSuccessResponse,
								isSuccess: true
							},
							{
								status: 201,
								message: urlInformationStepPatch201CreatedSuccessResponse,
								isSuccess: true
							},
							{
								status: 400,
								message: urlInformationStepPatch400BadRequestErrorResponse,
								isSuccess: false
							},
							{
								status: 401,
								message: urlInformationStepPatch401UnauthorizedErrorResponse,
								isSuccess: false
							},
							{
								status: 403,
								message: urlInformationStepPatch403ForbiddenErrorResponse,
								isSuccess: false
							},
							{
								status: 404,
								message: urlInformationStepPatch404NotFoundErrorResponse,
								isSuccess: false
							},
							{
								status: 429,
								message: urlInformationStepPatch429TooManyRequestsErrorResponse,
								isSuccess: false
							},
							{
								status: 500,
								message: urlInformationStepPatch500InternalServerErrorResponse,
								isSuccess: false
							},
							{
								status: 502,
								message: urlInformationStepPatch502BadGatewayErrorResponse,
								isSuccess: false
							},
							{
								status: 503,
								message: urlInformationStepPatch503ServiceUnavailableErrorResponse,
								isSuccess: false
							},
							{
								status: 504,
								message: urlInformationStepPatch504GatewayTimeoutErrorResponse,
								isSuccess: false
							}
						]
					};
					const postResponse = {
						method: "POST",
						responses: [
							{
								status: 200,
								message: urlInformationStepPost200OkSuccessResponse,
								isSuccess: true
							},
							{
								status: 201,
								message: urlInformationStepPost201CreatedSuccessResponse,
								isSuccess: true
							},
							{
								status: 400,
								message: urlInformationStepPost400BadRequestErrorResponse,
								isSuccess: false
							},
							{
								status: 401,
								message: urlInformationStepPost401UnauthorizedErrorResponse,
								isSuccess: false
							},
							{
								status: 403,
								message: urlInformationStepPost403ForbiddenErrorResponse,
								isSuccess: false
							},
							{
								status: 404,
								message: urlInformationStepPost404NotFoundErrorResponse,
								isSuccess: false
							},
							{
								status: 429,
								message: urlInformationStepPost429TooManyRequestsErrorResponse,
								isSuccess: false
							},
							{
								status: 500,
								message: urlInformationStepPost500InternalServerErrorResponse,
								isSuccess: false
							},
							{
								status: 502,
								message: urlInformationStepPost502BadGatewayErrorResponse,
								isSuccess: false
							},
							{
								status: 503,
								message: urlInformationStepPost503ServiceUnavailableErrorResponse,
								isSuccess: false
							},
							{
								status: 504,
								message: urlInformationStepPost504GatewayTimeoutErrorResponse,
								isSuccess: false
							}
						]
					};

					responsesArray.push(patchResponse);
					responsesArray.push(postResponse);

					const data = responsesArray
						?.find(
							(datum) =>
								handleConversionStringToLowercase(datum.method) === handleConversionStringToLowercase(config.method)
						)
						?.responses?.find(
							(response) =>
								handleConversionStringToNumber(response.status) === handleConversionStringToNumber(config.status)
						);

					handleAlertMessages({ dispatch, config, setConfig, state, isPasswordReset, data, fallback });
				} else if (isVerifyUrlStep) {
					let responsesArray = [];

					const postResponse = {
						method: "POST",
						responses: [
							{
								status: 200,
								message: isError
									? verifyUrlStepPostMiscSiteVerificationFailedErrorResponse
									: verifyUrlStepPost200OkSuccessResponse,
								isSuccess: isError ? false : true
							},
							{
								status: 201,
								message: verifyUrlStepPost201CreatedSuccessResponse,
								isSuccess: true
							},
							{
								status: 400,
								message: verifyUrlStepPost400BadRequestErrorResponse,
								isSuccess: false
							},
							{
								status: 401,
								message: verifyUrlStepPost401UnauthorizedErrorResponse,
								isSuccess: false
							},
							{
								status: 403,
								message: verifyUrlStepPost403ForbiddenErrorResponse,
								isSuccess: false
							},
							{
								status: 404,
								message: verifyUrlStepPost404NotFoundErrorResponse,
								isSuccess: false
							},
							{
								status: 429,
								message: verifyUrlStepPost429TooManyRequestsErrorResponse,
								isSuccess: false
							},
							{
								status: 500,
								message: verifyUrlStepPost500InternalServerErrorResponse,
								isSuccess: false
							},
							{
								status: 502,
								message: verifyUrlStepPost502BadGatewayErrorResponse,
								isSuccess: false
							},
							{
								status: 503,
								message: verifyUrlStepPost503ServiceUnavailableErrorResponse,
								isSuccess: false
							},
							{
								status: 504,
								message: verifyUrlStepPost504GatewayTimeoutErrorResponse,
								isSuccess: false
							}
						]
					};

					responsesArray.push(postResponse);

					const data = responsesArray
						?.find(
							(datum) =>
								handleConversionStringToLowercase(datum.method) === handleConversionStringToLowercase(config.method)
						)
						?.responses?.find(
							(response) =>
								handleConversionStringToNumber(response.status) === handleConversionStringToNumber(config.status)
						);

					handleAlertMessages({ dispatch, config, setConfig, state, isVerifyUrlStep, data, fallback });
				} else if (isSupport) {
					let responsesArray = [];

					const postResponse = {
						method: "POST",
						responses: [
							{
								status: 200,
								message: supportPost200OkSuccessResponse,
								isSuccess: true
							},
							{
								status: 201,
								message: supportPost201CreatedSuccessResponse,
								isSuccess: true
							},
							{
								status: 400,
								message: supportPost400BadRequestErrorResponse,
								isSuccess: false
							},
							{
								status: 401,
								message: supportPost401UnauthorizedErrorResponse,
								isSuccess: false
							},
							{
								status: 403,
								message: supportPost403ForbiddenErrorResponse,
								isSuccess: false
							},
							{
								status: 404,
								message: supportPost404NotFoundErrorResponse,
								isSuccess: false
							},
							{
								status: 429,
								message: supportPost429TooManyRequestsErrorResponse,
								isSuccess: false
							},
							{
								status: 500,
								message: supportPost500InternalServerErrorResponse,
								isSuccess: false
							},
							{
								status: 502,
								message: supportPost502BadGatewayErrorResponse,
								isSuccess: false
							},
							{
								status: 503,
								message: supportPost503ServiceUnavailableErrorResponse,
								isSuccess: false
							},
							{
								status: 504,
								message: supportPost504GatewayTimeoutErrorResponse,
								isSuccess: false
							}
						]
					};

					responsesArray.push(postResponse);

					const data = responsesArray
						?.find(
							(datum) =>
								handleConversionStringToLowercase(datum.method) === handleConversionStringToLowercase(config.method)
						)
						?.responses?.find(
							(response) =>
								handleConversionStringToNumber(response.status) === handleConversionStringToNumber(config.status)
						);

					handleAlertMessages({ dispatch, config, setConfig, state, isSupport, data, fallback });
				} else if (isPaymentMethod) {
					let responsesArray = [];

					const postResponse = {
						method: "POST",
						responses: [
							{
								status: 201,
								message: paymentMethodPost201CreatedSuccessResponse,
								isSuccess: true
							},
							{
								status: 400,
								message: paymentMethodPost400BadRequestErrorResponse,
								isSuccess: false
							},
							{
								status: 401,
								message: paymentMethodPost401UnauthorizedErrorResponse,
								isSuccess: false
							},
							{
								status: 403,
								message: paymentMethodPost403ForbiddenErrorResponse,
								isSuccess: false
							},
							{
								status: 404,
								message: paymentMethodPost404NotFoundErrorResponse,
								isSuccess: false
							},
							{
								status: 429,
								message: paymentMethodPost429TooManyRequestsErrorResponse,
								isSuccess: false
							},
							{
								status: 500,
								message: paymentMethodPost500InternalServerErrorResponse,
								isSuccess: false
							},
							{
								status: 502,
								message: paymentMethodPost502BadGatewayErrorResponse,
								isSuccess: false
							},
							{
								status: 503,
								message: paymentMethodPost503ServiceUnavailableErrorResponse,
								isSuccess: false
							},
							{
								status: 504,
								message: paymentMethodPost504GatewayTimeoutErrorResponse,
								isSuccess: false
							}
						]
					};
					const getResponse = {
						method: "GET",
						responses: [
							{
								status: 200,
								message: paymentMethodGet200OkSuccessResponse,
								isSuccess: true
							},
							{
								status: 400,
								message: paymentMethodGet400BadRequestErrorResponse,
								isSuccess: false
							},
							{
								status: 401,
								message: paymentMethodGet401UnauthorizedErrorResponse,
								isSuccess: false
							},
							{
								status: 403,
								message: paymentMethodGet403ForbiddenErrorResponse,
								isSuccess: false
							},
							{
								status: 404,
								message: paymentMethodGet404NotFoundErrorResponse,
								isSuccess: false
							},
							{
								status: 429,
								message: paymentMethodGet429TooManyRequestsErrorResponse,
								isSuccess: false
							},
							{
								status: 500,
								message: paymentMethodGet500InternalServerErrorResponse,
								isSuccess: false
							},
							{
								status: 502,
								message: paymentMethodGet502BadGatewayErrorResponse,
								isSuccess: false
							},
							{
								status: 503,
								message: paymentMethodGet503ServiceUnavailableErrorResponse,
								isSuccess: false
							},
							{
								status: 504,
								message: paymentMethodGet504GatewayTimeoutErrorResponse,
								isSuccess: false
							}
						]
					};

					responsesArray.push(postResponse);
					responsesArray.push(getResponse);

					const data = responsesArray
						?.find(
							(datum) =>
								handleConversionStringToLowercase(datum.method) === handleConversionStringToLowercase(config.method)
						)
						?.responses?.find(
							(response) =>
								handleConversionStringToNumber(response.status) === handleConversionStringToNumber(config.status)
						);

					handleAlertMessages({ dispatch, config, setConfig, state, isPaymentMethod, data, fallback });
				} else {
					return null;
				}

				// else if (isRegistrationVerifyEmail) {
				// } else if (isSignup) {
				// } else if (isSite) {
				// } else if (isSites){
				// } else if (isStats) {
				// }
			}
		}

		return { state, config };
	}, [config]);

	return { state, setConfig };
};
