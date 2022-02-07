import { handleAlertMessages } from "@helpers/handleNotificationMessages";
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
export const useNotificationMessages = () => {
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
	const fallback200OkSuccessResponse = t("alerts:fallback.200OkSuccessResponse");
	const fallback201CreatedSuccessResponse = t("alerts:fallback.201CreatedSuccessResponse");
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
								title: fallback200OkSuccessResponse,
								message: loginPost200OkSuccessResponse,
								isSuccess: true
							},
							{
								status: 201,
								title: fallback201CreatedSuccessResponse,
								message: loginPost201CreatedSuccessResponse,
								isSuccess: true
							},
							{
								status: 400,
								title: fallback400BadRequestErrorResponse,
								message: loginPost400BadRequestErrorResponse,
								isSuccess: false
							},
							{
								status: 401,
								title: fallback401UnauthorizedErrorResponse,
								message: loginPost401UnauthorizedErrorResponse,
								isSuccess: false
							},
							{
								status: 403,
								title: fallback403ForbiddenErrorResponse,
								message: loginPost403ForbiddenErrorResponse,
								isSuccess: false
							},
							{
								status: 404,
								title: fallback404NotFoundErrorResponse,
								message: loginPost404NotFoundErrorResponse,
								isSuccess: false
							},
							{
								status: 429,
								title: fallback429TooManyRequestsErrorResponse,
								message: loginPost429TooManyRequestsErrorResponse,
								isSuccess: false
							},
							{
								status: 500,
								title: fallback500InternalServerErrorResponse,
								message: loginPost500InternalServerErrorResponse,
								isSuccess: false
							},
							{
								status: 502,
								title: fallback502BadGatewayErrorResponse,
								message: loginPost502BadGatewayErrorResponse,
								isSuccess: false
							},
							{
								status: 503,
								title: fallback503ServiceUnavailableErrorResponse,
								message: loginPost503ServiceUnavailableErrorResponse,
								isSuccess: false
							},
							{
								status: 504,
								title: fallback504GatewayTimeoutErrorResponse,
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
								title: fallback201CreatedSuccessResponse,
								message: logoutPost201CreatedSuccessResponse,
								isSuccess: true
							},
							{
								status: 400,
								title: fallback400BadRequestErrorResponse,
								message: logoutPost400BadRequestErrorResponse,
								isSuccess: false
							},
							{
								status: 401,
								title: fallback401UnauthorizedErrorResponse,
								message: logoutPost401UnauthorizedErrorResponse,
								isSuccess: false
							},
							{
								status: 403,
								title: fallback403ForbiddenErrorResponse,
								message: logoutPost403ForbiddenErrorResponse,
								isSuccess: false
							},
							{
								status: 404,
								title: fallback404NotFoundErrorResponse,
								message: logoutPost404NotFoundErrorResponse,
								isSuccess: false
							},
							{
								status: 429,
								title: fallback429TooManyRequestsErrorResponse,
								message: logoutPost429TooManyRequestsErrorResponse,
								isSuccess: false
							},
							{
								status: 500,
								title: fallback500InternalServerErrorResponse,
								message: logoutPost500InternalServerErrorResponse,
								isSuccess: false
							},
							{
								status: 502,
								title: fallback502BadGatewayErrorResponse,
								message: logoutPost502BadGatewayErrorResponse,
								isSuccess: false
							},
							{
								status: 503,
								title: fallback503ServiceUnavailableErrorResponse,
								message: logoutPost503ServiceUnavailableErrorResponse,
								isSuccess: false
							},
							{
								status: 504,
								title: fallback504GatewayTimeoutErrorResponse,
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
								title: fallback200OkSuccessResponse,
								message: logoutGet200OkSuccessResponse,
								isSuccess: true
							},
							{
								status: 400,
								title: fallback400BadRequestErrorResponse,
								message: logoutGet400BadRequestErrorResponse,
								isSuccess: false
							},
							{
								status: 401,
								title: fallback401UnauthorizedErrorResponse,
								message: logoutGet401UnauthorizedErrorResponse,
								isSuccess: false
							},
							{
								status: 403,
								title: fallback403ForbiddenErrorResponse,
								message: logoutGet403ForbiddenErrorResponse,
								isSuccess: false
							},
							{
								status: 404,
								title: fallback404NotFoundErrorResponse,
								message: logoutGet404NotFoundErrorResponse,
								isSuccess: false
							},
							{
								status: 429,
								title: fallback429TooManyRequestsErrorResponse,
								message: logoutGet429TooManyRequestsErrorResponse,
								isSuccess: false
							},
							{
								status: 500,
								title: fallback500InternalServerErrorResponse,
								message: logoutGet500InternalServerErrorResponse,
								isSuccess: false
							},
							{
								status: 502,
								title: fallback502BadGatewayErrorResponse,
								message: logoutGet502BadGatewayErrorResponse,
								isSuccess: false
							},
							{
								status: 503,
								title: fallback503ServiceUnavailableErrorResponse,
								message: logoutGet503ServiceUnavailableErrorResponse,
								isSuccess: false
							},
							{
								status: 504,
								title: fallback504GatewayTimeoutErrorResponse,
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
								title: fallback200OkSuccessResponse,
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
								title: fallback200OkSuccessResponse,
								message: supportPost200OkSuccessResponse,
								isSuccess: true
							},
							{
								status: 201,
								title: fallback201CreatedSuccessResponse,
								message: supportPost201CreatedSuccessResponse,
								isSuccess: true
							},
							{
								status: 400,
								title: fallback400BadRequestErrorResponse,
								message: supportPost400BadRequestErrorResponse,
								isSuccess: false
							},
							{
								status: 401,
								title: fallback401UnauthorizedErrorResponse,
								message: supportPost401UnauthorizedErrorResponse,
								isSuccess: false
							},
							{
								status: 403,
								title: fallback403ForbiddenErrorResponse,
								message: supportPost403ForbiddenErrorResponse,
								isSuccess: false
							},
							{
								status: 404,
								title: fallback404NotFoundErrorResponse,
								message: supportPost404NotFoundErrorResponse,
								isSuccess: false
							},
							{
								status: 429,
								title: fallback429TooManyRequestsErrorResponse,
								message: supportPost429TooManyRequestsErrorResponse,
								isSuccess: false
							},
							{
								status: 500,
								title: fallback500InternalServerErrorResponse,
								message: supportPost500InternalServerErrorResponse,
								isSuccess: false
							},
							{
								status: 502,
								title: fallback502BadGatewayErrorResponse,
								message: supportPost502BadGatewayErrorResponse,
								isSuccess: false
							},
							{
								status: 503,
								title: fallback503ServiceUnavailableErrorResponse,
								message: supportPost503ServiceUnavailableErrorResponse,
								isSuccess: false
							},
							{
								status: 504,
								title: fallback504GatewayTimeoutErrorResponse,
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
								status: 200,
								title: fallback200OkSuccessResponse,
								message: paymentMethodPost200OkSuccessResponse,
								isSuccess: true
							},
							{
								status: 201,
								title: fallback201CreatedSuccessResponse,
								message: paymentMethodPost201CreatedSuccessResponse,
								isSuccess: true
							},
							{
								status: 400,
								title: fallback400BadRequestErrorResponse,
								message: paymentMethodPost400BadRequestErrorResponse,
								isSuccess: false
							},
							{
								status: 401,
								title: fallback401UnauthorizedErrorResponse,
								message: paymentMethodPost401UnauthorizedErrorResponse,
								isSuccess: false
							},
							{
								status: 403,
								title: fallback403ForbiddenErrorResponse,
								message: paymentMethodPost403ForbiddenErrorResponse,
								isSuccess: false
							},
							{
								status: 404,
								title: fallback404NotFoundErrorResponse,
								message: paymentMethodPost404NotFoundErrorResponse,
								isSuccess: false
							},
							{
								status: 429,
								title: fallback429TooManyRequestsErrorResponse,
								message: paymentMethodPost429TooManyRequestsErrorResponse,
								isSuccess: false
							},
							{
								status: 500,
								title: fallback500InternalServerErrorResponse,
								message: paymentMethodPost500InternalServerErrorResponse,
								isSuccess: false
							},
							{
								status: 502,
								title: fallback502BadGatewayErrorResponse,
								message: paymentMethodPost502BadGatewayErrorResponse,
								isSuccess: false
							},
							{
								status: 503,
								title: fallback503ServiceUnavailableErrorResponse,
								message: paymentMethodPost503ServiceUnavailableErrorResponse,
								isSuccess: false
							},
							{
								status: 504,
								title: fallback504GatewayTimeoutErrorResponse,
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
								title: fallback200OkSuccessResponse,
								message: paymentMethodGet200OkSuccessResponse,
								isSuccess: true
							},
							{
								status: 201,
								title: fallback201CreatedSuccessResponse,
								message: paymentMethodGet201CreatedSuccessResponse,
								isSuccess: true
							},
							{
								status: 400,
								title: fallback400BadRequestErrorResponse,
								message: paymentMethodGet400BadRequestErrorResponse,
								isSuccess: false
							},
							{
								status: 401,
								title: fallback401UnauthorizedErrorResponse,
								message: paymentMethodGet401UnauthorizedErrorResponse,
								isSuccess: false
							},
							{
								status: 403,
								title: fallback403ForbiddenErrorResponse,
								message: paymentMethodGet403ForbiddenErrorResponse,
								isSuccess: false
							},
							{
								status: 404,
								title: fallback404NotFoundErrorResponse,
								message: paymentMethodGet404NotFoundErrorResponse,
								isSuccess: false
							},
							{
								status: 429,
								title: fallback429TooManyRequestsErrorResponse,
								message: paymentMethodGet429TooManyRequestsErrorResponse,
								isSuccess: false
							},
							{
								status: 500,
								title: fallback500InternalServerErrorResponse,
								message: paymentMethodGet500InternalServerErrorResponse,
								isSuccess: false
							},
							{
								status: 502,
								title: fallback502BadGatewayErrorResponse,
								message: paymentMethodGet502BadGatewayErrorResponse,
								isSuccess: false
							},
							{
								status: 503,
								title: fallback503ServiceUnavailableErrorResponse,
								message: paymentMethodGet503ServiceUnavailableErrorResponse,
								isSuccess: false
							},
							{
								status: 504,
								title: fallback504GatewayTimeoutErrorResponse,
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
				} else if (isSites) {
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

					const data = responsesArray
						?.find(
							(datum) =>
								handleConversionStringToLowercase(datum.method) === handleConversionStringToLowercase(config.method)
						)
						?.responses?.find(
							(response) =>
								handleConversionStringToNumber(response.status) === handleConversionStringToNumber(config.status)
						);

					handleAlertMessages({ dispatch, config, setConfig, state, isSites, data, fallback });
				} else {
					return null;
				}

				// else if (isRegistrationVerifyEmail) {
				// } else if (isSignup) {
				// } else if (isStats) {
				// }
			}
		}

		return { state, config };
	}, [config]);

	return { state, setConfig };
};
