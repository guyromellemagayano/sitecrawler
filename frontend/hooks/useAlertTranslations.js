import useTranslation from "next-translate/useTranslation";

export const useAlertTranslations = () => {
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

	// Fallback translations
	const fallback = {
		okSuccessResponse: fallback200OkSuccessResponse,
		createdSuccessResponse: fallback201CreatedSuccessResponse,
		noContentSuccessResponse: fallback204NoContentSuccessResponse,
		badRequestErrorResponse: fallback400BadRequestErrorResponse,
		unauthorizedErrorResponse: fallback401UnauthorizedErrorResponse,
		forbiddenErrorResponse: fallback403ForbiddenErrorResponse,
		notFoundErrorResponse: fallback404NotFoundErrorResponse,
		tooManyRequestsErrorResponse: fallback429TooManyRequestsErrorResponse,
		internalServerErrorResponse: fallback500InternalServerErrorResponse,
		badGatewayErrorResponse: fallback502BadGatewayErrorResponse,
		serviceUnavailableErrorResponse: fallback503ServiceUnavailableErrorResponse,
		gatewayTimeoutErrorResponse: fallback504GatewayTimeoutErrorResponse,
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

	// User translations
	const userDelete200OkSuccessResponse = t("alerts:auth.user.delete.200OkSuccessResponse");
	const userDelete201CreatedSuccessResponse = t("alerts:auth.user.delete.201CreatedSuccessResponse");
	const userDelete204NoContentSuccessResponse = t("alerts:auth.user.delete.204NoContentSuccessResponse");
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

	// Confirm email translations
	const confirmEmailPost200OkSuccessResponse = t("alerts:auth.confirmEmail.post.200OkSuccessResponse");
	const confirmEmailPost201CreatedSuccessResponse = t("alerts:auth.confirmEmail.post.201CreatedSuccessResponse");
	const confirmEmailPost400BadRequestErrorResponse = t("alerts:auth.confirmEmail.post.400BadRequestErrorResponse");
	const confirmEmailPost401UnauthorizedErrorResponse = t("alerts:auth.confirmEmail.post.401UnauthorizedErrorResponse");
	const confirmEmailPost403ForbiddenErrorResponse = t("alerts:auth.confirmEmail.post.403ForbiddenErrorResponse");
	const confirmEmailPost404NotFoundErrorResponse = t("alerts:auth.confirmEmail.post.404NotFoundErrorResponse");
	const confirmEmailPost429TooManyRequestsErrorResponse = t("alerts:auth.confirmEmail.post.201CreatedSuccessResponse");
	const confirmEmailPost500InternalServerErrorResponse = t(
		"alerts:auth.confirmEmail.post.500InternalServerErrorResponse"
	);
	const confirmEmailPost502BadGatewayErrorResponse = t("alerts:auth.confirmEmail.post.502BadGatewayErrorResponse");
	const confirmEmailPost503ServiceUnavailableErrorResponse = t(
		"alerts:auth.confirmEmail.post.503ServiceUnavailableErrorResponse"
	);
	const confirmEmailPost504GatewayTimeoutErrorResponse = t(
		"alerts:auth.confirmEmail.post.504GatewayTimeoutErrorResponse"
	);

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

	// Logout translations
	const logoutPost200OkSuccessResponse = t("alerts:auth.logout.post.200OkSuccessResponse");
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

	// Signup translations
	const signupPost200OkSuccessResponse = t("alerts:signup.post.200OkSuccessResponse");
	const signupPost201CreatedSuccessResponse = t("alerts:signup.post.201CreatedSuccessResponse");
	const signupPost400BadRequestErrorResponse = t("alerts:signup.post.400BadRequestErrorResponse");
	const signupPost401UnauthorizedErrorResponse = t("alerts:signup.post.401UnauthorizedErrorResponse");
	const signupPost403ForbiddenErrorResponse = t("alerts:signup.post.403ForbiddenErrorResponse");
	const signupPost404NotFoundErrorResponse = t("alerts:signup.post.404NotFoundErrorResponse");
	const signupPost429TooManyRequestsErrorResponse = t("alerts:signup.post.201CreatedSuccessResponse");
	const signupPost500InternalServerErrorResponse = t("alerts:signup.post.500InternalServerErrorResponse");
	const signupPost502BadGatewayErrorResponse = t("alerts:signup.post.502BadGatewayErrorResponse");
	const signupPost503ServiceUnavailableErrorResponse = t("alerts:signup.post.503ServiceUnavailableErrorResponse");
	const signupPost504GatewayTimeoutErrorResponse = t("alerts:signup.post.504GatewayTimeoutErrorResponse");

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

	// Scan translations
	const scanGet200OkSuccessResponse = t("alerts:sites.scan.get.200OkSuccessResponse");
	const scanGet201CreatedSuccessResponse = t("alerts:sites.scan.get.201CreatedSuccessResponse");
	const scanGet400BadRequestErrorResponse = t("alerts:sites.scan.get.400BadRequestErrorResponse");
	const scanGet401UnauthorizedErrorResponse = t("alerts:sites.scan.get.401UnauthorizedErrorResponse");
	const scanGet403ForbiddenErrorResponse = t("alerts:sites.scan.get.403ForbiddenErrorResponse");
	const scanGet404NotFoundErrorResponse = t("alerts:sites.scan.get.404NotFoundErrorResponse");
	const scanGet429TooManyRequestsErrorResponse = t("alerts:sites.scan.get.429TooManyRequestsErrorResponse");
	const scanGet500InternalServerErrorResponse = t("alerts:sites.scan.get.500InternalServerErrorResponse");
	const scanGet502BadGatewayErrorResponse = t("alerts:sites.scan.get.502BadGatewayErrorResponse");
	const scanGet503ServiceUnavailableErrorResponse = t("alerts:sites.scan.get.503ServiceUnavailableErrorResponse");
	const scanGet504GatewayTimeoutErrorResponse = t("alerts:sites.scan.get.504GatewayTimeoutErrorResponse");
	const scanPost200OkSuccessResponse = t("alerts:sites.scan.post.200OkSuccessResponse");
	const scanPost201CreatedSuccessResponse = t("alerts:sites.scan.post.201CreatedSuccessResponse");
	const scanPost400BadRequestErrorResponse = t("alerts:sites.scan.post.400BadRequestErrorResponse");
	const scanPost401UnauthorizedErrorResponse = t("alerts:sites.scan.post.401UnauthorizedErrorResponse");
	const scanPost403ForbiddenErrorResponse = t("alerts:sites.scan.post.403ForbiddenErrorResponse");
	const scanPost404NotFoundErrorResponse = t("alerts:sites.scan.post.404NotFoundErrorResponse");
	const scanPost429TooManyRequestsErrorResponse = t("alerts:sites.scan.post.429TooManyRequestsErrorResponse");
	const scanPost500InternalServerErrorResponse = t("alerts:sites.scan.post.500InternalServerErrorResponse");
	const scanPost502BadGatewayErrorResponse = t("alerts:sites.scan.post.502BadGatewayErrorResponse");
	const scanPost503ServiceUnavailableErrorResponse = t("alerts:sites.scan.post.503ServiceUnavailableErrorResponse");
	const scanPost504GatewayTimeoutErrorResponse = t("alerts:sites.scan.post.504GatewayTimeoutErrorResponse");

	// Stats translations
	const statsGet200OkSuccessResponse = t("alerts:sites.stats.get.200OkSuccessResponse");
	const statsGet201CreatedSuccessResponse = t("alerts:sites.stats.get.201CreatedSuccessResponse");
	const statsGet400BadRequestErrorResponse = t("alerts:sites.stats.get.400BadRequestErrorResponse");
	const statsGet401UnauthorizedErrorResponse = t("alerts:sites.stats.get.401UnauthorizedErrorResponse");
	const statsGet403ForbiddenErrorResponse = t("alerts:sites.stats.get.403ForbiddenErrorResponse");
	const statsGet404NotFoundErrorResponse = t("alerts:sites.stats.get.404NotFoundErrorResponse");
	const statsGet429TooManyRequestsErrorResponse = t("alerts:sites.stats.get.429TooManyRequestsErrorResponse");
	const statsGet500InternalServerErrorResponse = t("alerts:sites.stats.get.500InternalServerErrorResponse");
	const statsGet502BadGatewayErrorResponse = t("alerts:sites.stats.get.502BadGatewayErrorResponse");
	const statsGet503ServiceUnavailableErrorResponse = t("alerts:sites.stats.get.503ServiceUnavailableErrorResponse");
	const statsGet504GatewayTimeoutErrorResponse = t("alerts:sites.stats.get.504GatewayTimeoutErrorResponse");
	const statsDelete200OkSuccessResponse = t("alerts:sites.stats.delete.200OkSuccessResponse");
	const statsDelete201CreatedSuccessResponse = t("alerts:sites.stats.delete.201CreatedSuccessResponse");
	const statsDelete400BadRequestErrorResponse = t("alerts:sites.stats.delete.400BadRequestErrorResponse");
	const statsDelete401UnauthorizedErrorResponse = t("alerts:sites.stats.delete.401UnauthorizedErrorResponse");
	const statsDelete403ForbiddenErrorResponse = t("alerts:sites.stats.delete.403ForbiddenErrorResponse");
	const statsDelete404NotFoundErrorResponse = t("alerts:sites.stats.delete.404NotFoundErrorResponse");
	const statsDelete429TooManyRequestsErrorResponse = t("alerts:sites.stats.delete.429TooManyRequestsErrorResponse");
	const statsDelete500InternalServerErrorResponse = t("alerts:sites.stats.delete.500InternalServerErrorResponse");
	const statsDelete502BadGatewayErrorResponse = t("alerts:sites.stats.delete.502BadGatewayErrorResponse");
	const statsDelete503ServiceUnavailableErrorResponse = t(
		"alerts:sites.stats.delete.503ServiceUnavailableErrorResponse"
	);
	const statsDelete504GatewayTimeoutErrorResponse = t("alerts:sites.stats.delete.504GatewayTimeoutErrorResponse");

	// Links translations
	const linksGet200OkSuccessResponse = t("alerts:sites.links.get.200OkSuccessResponse");
	const linksGet201CreatedSuccessResponse = t("alerts:sites.links.get.201CreatedSuccessResponse");
	const linksGet400BadRequestErrorResponse = t("alerts:sites.links.get.400BadRequestErrorResponse");
	const linksGet401UnauthorizedErrorResponse = t("alerts:sites.links.get.401UnauthorizedErrorResponse");
	const linksGet403ForbiddenErrorResponse = t("alerts:sites.links.get.403ForbiddenErrorResponse");
	const linksGet404NotFoundErrorResponse = t("alerts:sites.links.get.404NotFoundErrorResponse");
	const linksGet429TooManyRequestsErrorResponse = t("alerts:sites.links.get.429TooManyRequestsErrorResponse");
	const linksGet500InternalServerErrorResponse = t("alerts:sites.links.get.500InternalServerErrorResponse");
	const linksGet502BadGatewayErrorResponse = t("alerts:sites.links.get.502BadGatewayErrorResponse");
	const linksGet503ServiceUnavailableErrorResponse = t("alerts:sites.links.get.503ServiceUnavailableErrorResponse");
	const linksGet504GatewayTimeoutErrorResponse = t("alerts:sites.links.get.504GatewayTimeoutErrorResponse");
	const linksPut200OkSuccessResponse = t("alerts:sites.links.put.200OkSuccessResponse");
	const linksPut201CreatedSuccessResponse = t("alerts:sites.links.put.201CreatedSuccessResponse");
	const linksPut400BadRequestErrorResponse = t("alerts:sites.links.put.400BadRequestErrorResponse");
	const linksPut401UnauthorizedErrorResponse = t("alerts:sites.links.put.401UnauthorizedErrorResponse");
	const linksPut403ForbiddenErrorResponse = t("alerts:sites.links.put.403ForbiddenErrorResponse");
	const linksPut404NotFoundErrorResponse = t("alerts:sites.links.put.404NotFoundErrorResponse");
	const linksPut429TooManyRequestsErrorResponse = t("alerts:sites.links.put.429TooManyRequestsErrorResponse");
	const linksPut500InternalServerErrorResponse = t("alerts:sites.links.put.500InternalServerErrorResponse");
	const linksPut502BadGatewayErrorResponse = t("alerts:sites.links.put.502BadGatewayErrorResponse");
	const linksPut503ServiceUnavailableErrorResponse = t("alerts:sites.links.put.503ServiceUnavailableErrorResponse");
	const linksPut504GatewayTimeoutErrorResponse = t("alerts:sites.links.put.504GatewayTimeoutErrorResponse");
	const linksPatch200OkSuccessResponse = t("alerts:sites.links.patch.200OkSuccessResponse");
	const linksPatch201CreatedSuccessResponse = t("alerts:sites.links.patch.201CreatedSuccessResponse");
	const linksPatch400BadRequestErrorResponse = t("alerts:sites.links.patch.400BadRequestErrorResponse");
	const linksPatch401UnauthorizedErrorResponse = t("alerts:sites.links.patch.401UnauthorizedErrorResponse");
	const linksPatch403ForbiddenErrorResponse = t("alerts:sites.links.patch.403ForbiddenErrorResponse");
	const linksPatch404NotFoundErrorResponse = t("alerts:sites.links.patch.404NotFoundErrorResponse");
	const linksPatch429TooManyRequestsErrorResponse = t("alerts:sites.links.patch.429TooManyRequestsErrorResponse");
	const linksPatch500InternalServerErrorResponse = t("alerts:sites.links.patch.500InternalServerErrorResponse");
	const linksPatch502BadGatewayErrorResponse = t("alerts:sites.links.patch.502BadGatewayErrorResponse");
	const linksPatch503ServiceUnavailableErrorResponse = t("alerts:sites.links.patch.503ServiceUnavailableErrorResponse");
	const linksPatch504GatewayTimeoutErrorResponse = t("alerts:sites.links.patch.504GatewayTimeoutErrorResponse");

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

	// Stripe subscriptions translations
	const stripeSubscriptionsGet200OkSuccessResponse = t("alerts:stripe.subscriptions.get.200OkSuccessResponse");
	const stripeSubscriptionsGet201CreatedSuccessResponse = t(
		"alerts:stripe.subscriptions.get.201CreatedSuccessResponse"
	);
	const stripeSubscriptionsGet400BadRequestErrorResponse = t(
		"alerts:stripe.subscriptions.get.400BadRequestErrorResponse"
	);
	const stripeSubscriptionsGet401UnauthorizedErrorResponse = t(
		"alerts:stripe.subscriptions.get.401UnauthorizedErrorResponse"
	);
	const stripeSubscriptionsGet403ForbiddenErrorResponse = t(
		"alerts:stripe.subscriptions.get.403ForbiddenErrorResponse"
	);
	const stripeSubscriptionsGet404NotFoundErrorResponse = t("alerts:stripe.subscriptions.get.404NotFoundErrorResponse");
	const stripeSubscriptionsGet429TooManyRequestsErrorResponse = t(
		"alerts:stripe.subscriptions.get.429TooManyRequestsErrorResponse"
	);
	const stripeSubscriptionsGet500InternalServerErrorResponse = t(
		"alerts:stripe.subscriptions.get.500InternalServerErrorResponse"
	);
	const stripeSubscriptionsGet502BadGatewayErrorResponse = t(
		"alerts:stripe.subscriptions.get.502BadGatewayErrorResponse"
	);
	const stripeSubscriptionsGet503ServiceUnavailableErrorResponse = t(
		"alerts:stripe.subscriptions.get.503ServiceUnavailableErrorResponse"
	);
	const stripeSubscriptionsGet504GatewayTimeoutErrorResponse = t(
		"alerts:stripe.subscriptions.get.504GatewayTimeoutErrorResponse"
	);

	// Stripe current subscription
	const stripeSubscriptionsCurrentGet200OkSuccessResponse = t(
		"alerts:stripe.subscriptions.current.get.200OkSuccessResponse"
	);
	const stripeSubscriptionsCurrentGet201CreatedSuccessResponse = t(
		"alerts:stripe.subscriptions.current.get.201CreatedSuccessResponse"
	);
	const stripeSubscriptionsCurrentGet400BadRequestErrorResponse = t(
		"alerts:stripe.subscriptions.current.get.400BadRequestErrorResponse"
	);
	const stripeSubscriptionsCurrentGet401UnauthorizedErrorResponse = t(
		"alerts:stripe.subscriptions.current.get.401UnauthorizedErrorResponse"
	);
	const stripeSubscriptionsCurrentGet403ForbiddenErrorResponse = t(
		"alerts:stripe.subscriptions.current.get.403ForbiddenErrorResponse"
	);
	const stripeSubscriptionsCurrentGet404NotFoundErrorResponse = t(
		"alerts:stripe.subscriptions.current.get.404NotFoundErrorResponse"
	);
	const stripeSubscriptionsCurrentGet429TooManyRequestsErrorResponse = t(
		"alerts:stripe.subscriptions.current.get.429TooManyRequestsErrorResponse"
	);
	const stripeSubscriptionsCurrentGet500InternalServerErrorResponse = t(
		"alerts:stripe.subscriptions.current.get.500InternalServerErrorResponse"
	);
	const stripeSubscriptionsCurrentGet502BadGatewayErrorResponse = t(
		"alerts:stripe.subscriptions.current.get.502BadGatewayErrorResponse"
	);
	const stripeSubscriptionsCurrentGet503ServiceUnavailableErrorResponse = t(
		"alerts:stripe.subscriptions.current.get.503ServiceUnavailableErrorResponse"
	);
	const stripeSubscriptionsCurrentGet504GatewayTimeoutErrorResponse = t(
		"alerts:stripe.subscriptions.current.get.504GatewayTimeoutErrorResponse"
	);
	const stripeSubscriptionsCurrentPost200OkSuccessResponse = t(
		"alerts:stripe.subscriptions.current.post.200OkSuccessResponse"
	);
	const stripeSubscriptionsCurrentPost201CreatedSuccessResponse = t(
		"alerts:stripe.subscriptions.current.post.201CreatedSuccessResponse"
	);
	const stripeSubscriptionsCurrentPost400BadRequestErrorResponse = t(
		"alerts:stripe.subscriptions.current.post.400BadRequestErrorResponse"
	);
	const stripeSubscriptionsCurrentPost401UnauthorizedErrorResponse = t(
		"alerts:stripe.subscriptions.current.post.401UnauthorizedErrorResponse"
	);
	const stripeSubscriptionsCurrentPost403ForbiddenErrorResponse = t(
		"alerts:stripe.subscriptions.current.post.403ForbiddenErrorResponse"
	);
	const stripeSubscriptionsCurrentPost404NotFoundErrorResponse = t(
		"alerts:stripe.subscriptions.current.post.404NotFoundErrorResponse"
	);
	const stripeSubscriptionsCurrentPost429TooManyRequestsErrorResponse = t(
		"alerts:stripe.subscriptions.current.post.429TooManyRequestsErrorResponse"
	);
	const stripeSubscriptionsCurrentPost500InternalServerErrorResponse = t(
		"alerts:stripe.subscriptions.current.post.500InternalServerErrorResponse"
	);
	const stripeSubscriptionsCurrentPost502BadGatewayErrorResponse = t(
		"alerts:stripe.subscriptions.current.post.502BadGatewayErrorResponse"
	);
	const stripeSubscriptionsCurrentPost503ServiceUnavailableErrorResponse = t(
		"alerts:stripe.subscriptions.current.post.503ServiceUnavailableErrorResponse"
	);
	const stripeSubscriptionsCurrentPost504GatewayTimeoutErrorResponse = t(
		"alerts:stripe.subscriptions.current.post.504GatewayTimeoutErrorResponse"
	);
	const stripeSubscriptionsCurrentDelete200OkSuccessResponse = t(
		"alerts:stripe.subscriptions.current.delete.200OkSuccessResponse"
	);
	const stripeSubscriptionsCurrentDelete201CreatedSuccessResponse = t(
		"alerts:stripe.subscriptions.current.delete.201CreatedSuccessResponse"
	);
	const stripeSubscriptionsCurrentDelete204NoContentSuccessResponse = t(
		"alerts:stripe.subscriptions.current.delete.201CreatedSuccessResponse"
	);
	const stripeSubscriptionsCurrentDelete400BadRequestErrorResponse = t(
		"alerts:stripe.subscriptions.current.delete.400BadRequestErrorResponse"
	);
	const stripeSubscriptionsCurrentDelete401UnauthorizedErrorResponse = t(
		"alerts:stripe.subscriptions.current.delete.401UnauthorizedErrorResponse"
	);
	const stripeSubscriptionsCurrentDelete403ForbiddenErrorResponse = t(
		"alerts:stripe.subscriptions.current.delete.403ForbiddenErrorResponse"
	);
	const stripeSubscriptionsCurrentDelete404NotFoundErrorResponse = t(
		"alerts:stripe.subscriptions.current.delete.404NotFoundErrorResponse"
	);
	const stripeSubscriptionsCurrentDelete429TooManyRequestsErrorResponse = t(
		"alerts:stripe.subscriptions.current.delete.429TooManyRequestsErrorResponse"
	);
	const stripeSubscriptionsCurrentDelete500InternalServerErrorResponse = t(
		"alerts:stripe.subscriptions.current.delete.500InternalServerErrorResponse"
	);
	const stripeSubscriptionsCurrentDelete502BadGatewayErrorResponse = t(
		"alerts:stripe.subscriptions.current.delete.502BadGatewayErrorResponse"
	);
	const stripeSubscriptionsCurrentDelete503ServiceUnavailableErrorResponse = t(
		"alerts:stripe.subscriptions.current.delete.503ServiceUnavailableErrorResponse"
	);
	const stripeSubscriptionsCurrentDelete504GatewayTimeoutErrorResponse = t(
		"alerts:stripe.subscriptions.current.delete.504GatewayTimeoutErrorResponse"
	);

	return {
		fallback,
		userDelete200OkSuccessResponse,
		userDelete201CreatedSuccessResponse,
		userDelete204NoContentSuccessResponse,
		userDelete400BadRequestErrorResponse,
		userDelete401UnauthorizedErrorResponse,
		userDelete403ForbiddenErrorResponse,
		userDelete404NotFoundErrorResponse,
		userDelete429TooManyRequestsErrorResponse,
		userDelete500InternalServerErrorResponse,
		userDelete502BadGatewayErrorResponse,
		userDelete503ServiceUnavailableErrorResponse,
		userDelete504GatewayTimeoutErrorResponse,
		userGet200OkSuccessResponse,
		userGet201CreatedSuccessResponse,
		userGet400BadRequestErrorResponse,
		userGet401UnauthorizedErrorResponse,
		userGet403ForbiddenErrorResponse,
		userGet404NotFoundErrorResponse,
		userGet429TooManyRequestsErrorResponse,
		userGet500InternalServerErrorResponse,
		userGet502BadGatewayErrorResponse,
		userGet503ServiceUnavailableErrorResponse,
		userGet504GatewayTimeoutErrorResponse,
		userPatch200OkSuccessResponse,
		userPatch201CreatedSuccessResponse,
		userPatch400BadRequestErrorResponse,
		userPatch401UnauthorizedErrorResponse,
		userPatch403ForbiddenErrorResponse,
		userPatch404NotFoundErrorResponse,
		userPatch429TooManyRequestsErrorResponse,
		userPatch500InternalServerErrorResponse,
		userPatch502BadGatewayErrorResponse,
		userPatch503ServiceUnavailableErrorResponse,
		userPatch504GatewayTimeoutErrorResponse,
		userPut200OkSuccessResponse,
		userPut201CreatedSuccessResponse,
		userPut400BadRequestErrorResponse,
		userPut401UnauthorizedErrorResponse,
		userPut403ForbiddenErrorResponse,
		userPut404NotFoundErrorResponse,
		userPut429TooManyRequestsErrorResponse,
		userPut500InternalServerErrorResponse,
		userPut502BadGatewayErrorResponse,
		userPut503ServiceUnavailableErrorResponse,
		userPut504GatewayTimeoutErrorResponse,
		localTimeEnabled200OkSuccessResponse,
		localTimeEnabled201CreatedSuccessResponse,
		localTimeEnabled400BadRequestErrorResponse,
		localTimeEnabled401UnauthorizedErrorResponse,
		localTimeEnabled403ForbiddenErrorResponse,
		localTimeEnabled404NotFoundErrorResponse,
		localTimeEnabled429TooManyRequestsErrorResponse,
		localTimeEnabled500InternalServerErrorResponse,
		localTimeEnabled502BadGatewayErrorResponse,
		localTimeEnabled503ServiceUnavailableErrorResponse,
		localTimeEnabled504GatewayTimeoutErrorResponse,
		localTimeDisabled200OkSuccessResponse,
		localTimeDisabled201CreatedSuccessResponse,
		localTimeDisabled400BadRequestErrorResponse,
		localTimeDisabled401UnauthorizedErrorResponse,
		localTimeDisabled403ForbiddenErrorResponse,
		localTimeDisabled404NotFoundErrorResponse,
		localTimeDisabled429TooManyRequestsErrorResponse,
		localTimeDisabled500InternalServerErrorResponse,
		localTimeDisabled502BadGatewayErrorResponse,
		localTimeDisabled503ServiceUnavailableErrorResponse,
		localTimeDisabled504GatewayTimeoutErrorResponse,
		confirmEmailPost200OkSuccessResponse,
		confirmEmailPost201CreatedSuccessResponse,
		confirmEmailPost400BadRequestErrorResponse,
		confirmEmailPost401UnauthorizedErrorResponse,
		confirmEmailPost403ForbiddenErrorResponse,
		confirmEmailPost404NotFoundErrorResponse,
		confirmEmailPost429TooManyRequestsErrorResponse,
		confirmEmailPost500InternalServerErrorResponse,
		confirmEmailPost502BadGatewayErrorResponse,
		confirmEmailPost503ServiceUnavailableErrorResponse,
		confirmEmailPost504GatewayTimeoutErrorResponse,
		loginPost200OkSuccessResponse,
		loginPost201CreatedSuccessResponse,
		loginPost400BadRequestErrorResponse,
		loginPost401UnauthorizedErrorResponse,
		loginPost403ForbiddenErrorResponse,
		loginPost404NotFoundErrorResponse,
		loginPost429TooManyRequestsErrorResponse,
		loginPost500InternalServerErrorResponse,
		loginPost502BadGatewayErrorResponse,
		loginPost503ServiceUnavailableErrorResponse,
		loginPost504GatewayTimeoutErrorResponse,
		logoutPost200OkSuccessResponse,
		logoutPost201CreatedSuccessResponse,
		logoutPost400BadRequestErrorResponse,
		logoutPost401UnauthorizedErrorResponse,
		logoutPost403ForbiddenErrorResponse,
		logoutPost404NotFoundErrorResponse,
		logoutPost429TooManyRequestsErrorResponse,
		logoutPost500InternalServerErrorResponse,
		logoutPost502BadGatewayErrorResponse,
		logoutPost503ServiceUnavailableErrorResponse,
		logoutPost504GatewayTimeoutErrorResponse,
		passwordResetPost200OkSuccessResponse,
		passwordResetPost201CreatedSuccessResponse,
		passwordResetPost400BadRequestErrorResponse,
		passwordResetPost401UnauthorizedErrorResponse,
		passwordResetPost403ForbiddenErrorResponse,
		passwordResetPost404NotFoundErrorResponse,
		passwordResetPost429TooManyRequestsErrorResponse,
		passwordResetPost500InternalServerErrorResponse,
		passwordResetPost502BadGatewayErrorResponse,
		passwordResetPost503ServiceUnavailableErrorResponse,
		passwordResetPost504GatewayTimeoutErrorResponse,
		passwordResetConfirmPost200OkSuccessResponse,
		passwordResetConfirmPost201CreatedSuccessResponse,
		passwordResetConfirmPost400BadRequestErrorResponse,
		passwordResetConfirmPost401UnauthorizedErrorResponse,
		passwordResetConfirmPost403ForbiddenErrorResponse,
		passwordResetConfirmPost404NotFoundErrorResponse,
		passwordResetConfirmPost429TooManyRequestsErrorResponse,
		passwordResetConfirmPost500InternalServerErrorResponse,
		passwordResetConfirmPost502BadGatewayErrorResponse,
		passwordResetConfirmPost503ServiceUnavailableErrorResponse,
		passwordResetConfirmPost504GatewayTimeoutErrorResponse,
		passwordChangePost200OkSuccessResponse,
		passwordChangePost201CreatedSuccessResponse,
		passwordChangePost400BadRequestErrorResponse,
		passwordChangePost401UnauthorizedErrorResponse,
		passwordChangePost403ForbiddenErrorResponse,
		passwordChangePost404NotFoundErrorResponse,
		passwordChangePost429TooManyRequestsErrorResponse,
		passwordChangePost500InternalServerErrorResponse,
		passwordChangePost502BadGatewayErrorResponse,
		passwordChangePost503ServiceUnavailableErrorResponse,
		passwordChangePost504GatewayTimeoutErrorResponse,
		registrationPost200OkSuccessResponse,
		registrationPost201CreatedSuccessResponse,
		registrationPost400BadRequestErrorResponse,
		registrationPost401UnauthorizedErrorResponse,
		registrationPost403ForbiddenErrorResponse,
		registrationPost404NotFoundErrorResponse,
		registrationPost429TooManyRequestsErrorResponse,
		registrationPost500InternalServerErrorResponse,
		registrationPost502BadGatewayErrorResponse,
		registrationPost503ServiceUnavailableErrorResponse,
		registrationPost504GatewayTimeoutErrorResponse,
		signupPost200OkSuccessResponse,
		signupPost201CreatedSuccessResponse,
		signupPost400BadRequestErrorResponse,
		signupPost401UnauthorizedErrorResponse,
		signupPost403ForbiddenErrorResponse,
		signupPost404NotFoundErrorResponse,
		signupPost429TooManyRequestsErrorResponse,
		signupPost500InternalServerErrorResponse,
		signupPost502BadGatewayErrorResponse,
		signupPost503ServiceUnavailableErrorResponse,
		signupPost504GatewayTimeoutErrorResponse,
		supportPost200OkSuccessResponse,
		supportPost201CreatedSuccessResponse,
		supportPost400BadRequestErrorResponse,
		supportPost401UnauthorizedErrorResponse,
		supportPost403ForbiddenErrorResponse,
		supportPost404NotFoundErrorResponse,
		supportPost429TooManyRequestsErrorResponse,
		supportPost500InternalServerErrorResponse,
		supportPost502BadGatewayErrorResponse,
		supportPost503ServiceUnavailableErrorResponse,
		supportPost504GatewayTimeoutErrorResponse,
		sitesGet200OkSuccessResponse,
		sitesGet201CreatedSuccessResponse,
		sitesGet400BadRequestErrorResponse,
		sitesGet401UnauthorizedErrorResponse,
		sitesGet403ForbiddenErrorResponse,
		sitesGet404NotFoundErrorResponse,
		sitesGet429TooManyRequestsErrorResponse,
		sitesGet500InternalServerErrorResponse,
		sitesGet502BadGatewayErrorResponse,
		sitesGet503ServiceUnavailableErrorResponse,
		sitesGet504GatewayTimeoutErrorResponse,
		sitesPost200OkSuccessResponse,
		sitesPost201CreatedSuccessResponse,
		sitesPost400BadRequestErrorResponse,
		sitesPost401UnauthorizedErrorResponse,
		sitesPost403ForbiddenErrorResponse,
		sitesPost404NotFoundErrorResponse,
		sitesPost429TooManyRequestsErrorResponse,
		sitesPost500InternalServerErrorResponse,
		sitesPost502BadGatewayErrorResponse,
		sitesPost503ServiceUnavailableErrorResponse,
		sitesPost504GatewayTimeoutErrorResponse,
		sitesPut200OkSuccessResponse,
		sitesPut201CreatedSuccessResponse,
		sitesPut400BadRequestErrorResponse,
		sitesPut401UnauthorizedErrorResponse,
		sitesPut403ForbiddenErrorResponse,
		sitesPut404NotFoundErrorResponse,
		sitesPut429TooManyRequestsErrorResponse,
		sitesPut500InternalServerErrorResponse,
		sitesPut502BadGatewayErrorResponse,
		sitesPut503ServiceUnavailableErrorResponse,
		sitesPut504GatewayTimeoutErrorResponse,
		sitesDelete200OkSuccessResponse,
		sitesDelete201CreatedSuccessResponse,
		sitesDelete400BadRequestErrorResponse,
		sitesDelete401UnauthorizedErrorResponse,
		sitesDelete403ForbiddenErrorResponse,
		sitesDelete404NotFoundErrorResponse,
		sitesDelete429TooManyRequestsErrorResponse,
		sitesDelete500InternalServerErrorResponse,
		sitesDelete502BadGatewayErrorResponse,
		sitesDelete503ServiceUnavailableErrorResponse,
		sitesDelete504GatewayTimeoutErrorResponse,
		sitesPatch200OkSuccessResponse,
		sitesPatch201CreatedSuccessResponse,
		sitesPatch400BadRequestErrorResponse,
		sitesPatch401UnauthorizedErrorResponse,
		sitesPatch403ForbiddenErrorResponse,
		sitesPatch404NotFoundErrorResponse,
		sitesPatch429TooManyRequestsErrorResponse,
		sitesPatch500InternalServerErrorResponse,
		sitesPatch502BadGatewayErrorResponse,
		sitesPatch503ServiceUnavailableErrorResponse,
		sitesPatch504GatewayTimeoutErrorResponse,
		scanGet200OkSuccessResponse,
		scanGet201CreatedSuccessResponse,
		scanGet400BadRequestErrorResponse,
		scanGet401UnauthorizedErrorResponse,
		scanGet403ForbiddenErrorResponse,
		scanGet404NotFoundErrorResponse,
		scanGet429TooManyRequestsErrorResponse,
		scanGet500InternalServerErrorResponse,
		scanGet502BadGatewayErrorResponse,
		scanGet503ServiceUnavailableErrorResponse,
		scanGet504GatewayTimeoutErrorResponse,
		scanPost200OkSuccessResponse,
		scanPost201CreatedSuccessResponse,
		scanPost400BadRequestErrorResponse,
		scanPost401UnauthorizedErrorResponse,
		scanPost403ForbiddenErrorResponse,
		scanPost404NotFoundErrorResponse,
		scanPost429TooManyRequestsErrorResponse,
		scanPost500InternalServerErrorResponse,
		scanPost502BadGatewayErrorResponse,
		scanPost503ServiceUnavailableErrorResponse,
		scanPost504GatewayTimeoutErrorResponse,
		statsGet200OkSuccessResponse,
		statsGet201CreatedSuccessResponse,
		statsGet400BadRequestErrorResponse,
		statsGet401UnauthorizedErrorResponse,
		statsGet403ForbiddenErrorResponse,
		statsGet404NotFoundErrorResponse,
		statsGet429TooManyRequestsErrorResponse,
		statsGet500InternalServerErrorResponse,
		statsGet502BadGatewayErrorResponse,
		statsGet503ServiceUnavailableErrorResponse,
		statsGet504GatewayTimeoutErrorResponse,
		statsDelete200OkSuccessResponse,
		statsDelete201CreatedSuccessResponse,
		statsDelete400BadRequestErrorResponse,
		statsDelete401UnauthorizedErrorResponse,
		statsDelete403ForbiddenErrorResponse,
		statsDelete404NotFoundErrorResponse,
		statsDelete429TooManyRequestsErrorResponse,
		statsDelete500InternalServerErrorResponse,
		statsDelete502BadGatewayErrorResponse,
		statsDelete503ServiceUnavailableErrorResponse,
		statsDelete504GatewayTimeoutErrorResponse,
		linksGet200OkSuccessResponse,
		linksGet201CreatedSuccessResponse,
		linksGet400BadRequestErrorResponse,
		linksGet401UnauthorizedErrorResponse,
		linksGet403ForbiddenErrorResponse,
		linksGet404NotFoundErrorResponse,
		linksGet429TooManyRequestsErrorResponse,
		linksGet500InternalServerErrorResponse,
		linksGet502BadGatewayErrorResponse,
		linksGet503ServiceUnavailableErrorResponse,
		linksGet504GatewayTimeoutErrorResponse,
		linksPut200OkSuccessResponse,
		linksPut201CreatedSuccessResponse,
		linksPut400BadRequestErrorResponse,
		linksPut401UnauthorizedErrorResponse,
		linksPut403ForbiddenErrorResponse,
		linksPut404NotFoundErrorResponse,
		linksPut429TooManyRequestsErrorResponse,
		linksPut500InternalServerErrorResponse,
		linksPut502BadGatewayErrorResponse,
		linksPut503ServiceUnavailableErrorResponse,
		linksPut504GatewayTimeoutErrorResponse,
		linksPatch200OkSuccessResponse,
		linksPatch201CreatedSuccessResponse,
		linksPatch400BadRequestErrorResponse,
		linksPatch401UnauthorizedErrorResponse,
		linksPatch403ForbiddenErrorResponse,
		linksPatch404NotFoundErrorResponse,
		linksPatch429TooManyRequestsErrorResponse,
		linksPatch500InternalServerErrorResponse,
		linksPatch502BadGatewayErrorResponse,
		linksPatch503ServiceUnavailableErrorResponse,
		linksPatch504GatewayTimeoutErrorResponse,
		pagesGet200OkSuccessResponse,
		pagesGet201CreatedSuccessResponse,
		pagesGet400BadRequestErrorResponse,
		pagesGet401UnauthorizedErrorResponse,
		pagesGet403ForbiddenErrorResponse,
		pagesGet404NotFoundErrorResponse,
		pagesGet429TooManyRequestsErrorResponse,
		pagesGet500InternalServerErrorResponse,
		pagesGet502BadGatewayErrorResponse,
		pagesGet503ServiceUnavailableErrorResponse,
		pagesGet504GatewayTimeoutErrorResponse,
		pagesPost200OkSuccessResponse,
		pagesPost201CreatedSuccessResponse,
		pagesPost400BadRequestErrorResponse,
		pagesPost401UnauthorizedErrorResponse,
		pagesPost403ForbiddenErrorResponse,
		pagesPost404NotFoundErrorResponse,
		pagesPost429TooManyRequestsErrorResponse,
		pagesPost500InternalServerErrorResponse,
		pagesPost502BadGatewayErrorResponse,
		pagesPost503ServiceUnavailableErrorResponse,
		pagesPost504GatewayTimeoutErrorResponse,
		imagesGet200OkSuccessResponse,
		imagesGet201CreatedSuccessResponse,
		imagesGet400BadRequestErrorResponse,
		imagesGet401UnauthorizedErrorResponse,
		imagesGet403ForbiddenErrorResponse,
		imagesGet404NotFoundErrorResponse,
		imagesGet429TooManyRequestsErrorResponse,
		imagesGet500InternalServerErrorResponse,
		imagesGet502BadGatewayErrorResponse,
		imagesGet503ServiceUnavailableErrorResponse,
		imagesGet504GatewayTimeoutErrorResponse,
		imagesPost200OkSuccessResponse,
		imagesPost201CreatedSuccessResponse,
		imagesPost400BadRequestErrorResponse,
		imagesPost401UnauthorizedErrorResponse,
		imagesPost403ForbiddenErrorResponse,
		imagesPost404NotFoundErrorResponse,
		imagesPost429TooManyRequestsErrorResponse,
		imagesPost500InternalServerErrorResponse,
		imagesPost502BadGatewayErrorResponse,
		imagesPost503ServiceUnavailableErrorResponse,
		imagesPost504GatewayTimeoutErrorResponse,
		urlInformationStepPatch200OkSuccessResponse,
		urlInformationStepPatch201CreatedSuccessResponse,
		urlInformationStepPatch400BadRequestErrorResponse,
		urlInformationStepPatch401UnauthorizedErrorResponse,
		urlInformationStepPatch403ForbiddenErrorResponse,
		urlInformationStepPatch404NotFoundErrorResponse,
		urlInformationStepPatch429TooManyRequestsErrorResponse,
		urlInformationStepPatch500InternalServerErrorResponse,
		urlInformationStepPatch502BadGatewayErrorResponse,
		urlInformationStepPatch503ServiceUnavailableErrorResponse,
		urlInformationStepPatch504GatewayTimeoutErrorResponse,
		urlInformationStepPost200OkSuccessResponse,
		urlInformationStepPost201CreatedSuccessResponse,
		urlInformationStepPost400BadRequestErrorResponse,
		urlInformationStepPost401UnauthorizedErrorResponse,
		urlInformationStepPost403ForbiddenErrorResponse,
		urlInformationStepPost404NotFoundErrorResponse,
		urlInformationStepPost429TooManyRequestsErrorResponse,
		urlInformationStepPost500InternalServerErrorResponse,
		urlInformationStepPost502BadGatewayErrorResponse,
		urlInformationStepPost503ServiceUnavailableErrorResponse,
		urlInformationStepPost504GatewayTimeoutErrorResponse,
		urlInformationStepPut200OkSuccessResponse,
		urlInformationStepPut201CreatedSuccessResponse,
		urlInformationStepPut400BadRequestErrorResponse,
		urlInformationStepPut401UnauthorizedErrorResponse,
		urlInformationStepPut403ForbiddenErrorResponse,
		urlInformationStepPut404NotFoundErrorResponse,
		urlInformationStepPut429TooManyRequestsErrorResponse,
		urlInformationStepPut500InternalServerErrorResponse,
		urlInformationStepPut502BadGatewayErrorResponse,
		urlInformationStepPut503ServiceUnavailableErrorResponse,
		urlInformationStepPut504GatewayTimeoutErrorResponse,
		verifyUrlStepPost200OkSuccessResponse,
		verifyUrlStepPost201CreatedSuccessResponse,
		verifyUrlStepPost400BadRequestErrorResponse,
		verifyUrlStepPost401UnauthorizedErrorResponse,
		verifyUrlStepPost403ForbiddenErrorResponse,
		verifyUrlStepPost404NotFoundErrorResponse,
		verifyUrlStepPost429TooManyRequestsErrorResponse,
		verifyUrlStepPost500InternalServerErrorResponse,
		verifyUrlStepPost502BadGatewayErrorResponse,
		verifyUrlStepPost503ServiceUnavailableErrorResponse,
		verifyUrlStepPost504GatewayTimeoutErrorResponse,
		stripePaymentMethodGet200OkSuccessResponse,
		stripePaymentMethodGet201CreatedSuccessResponse,
		stripePaymentMethodGet400BadRequestErrorResponse,
		stripePaymentMethodGet401UnauthorizedErrorResponse,
		stripePaymentMethodGet403ForbiddenErrorResponse,
		stripePaymentMethodGet404NotFoundErrorResponse,
		stripePaymentMethodGet429TooManyRequestsErrorResponse,
		stripePaymentMethodGet500InternalServerErrorResponse,
		stripePaymentMethodGet502BadGatewayErrorResponse,
		stripePaymentMethodGet503ServiceUnavailableErrorResponse,
		stripePaymentMethodGet504GatewayTimeoutErrorResponse,
		stripePaymentMethodPost200OkSuccessResponse,
		stripePaymentMethodPost201CreatedSuccessResponse,
		stripePaymentMethodPost400BadRequestErrorResponse,
		stripePaymentMethodPost401UnauthorizedErrorResponse,
		stripePaymentMethodPost403ForbiddenErrorResponse,
		stripePaymentMethodPost404NotFoundErrorResponse,
		stripePaymentMethodPost429TooManyRequestsErrorResponse,
		stripePaymentMethodPost500InternalServerErrorResponse,
		stripePaymentMethodPost502BadGatewayErrorResponse,
		stripePaymentMethodPost503ServiceUnavailableErrorResponse,
		stripePaymentMethodPost504GatewayTimeoutErrorResponse,
		stripePaymentMethodDefaultGet200OkSuccessResponse,
		stripePaymentMethodDefaultGet201CreatedSuccessResponse,
		stripePaymentMethodDefaultGet400BadRequestErrorResponse,
		stripePaymentMethodDefaultGet401UnauthorizedErrorResponse,
		stripePaymentMethodDefaultGet403ForbiddenErrorResponse,
		stripePaymentMethodDefaultGet404NotFoundErrorResponse,
		stripePaymentMethodDefaultGet429TooManyRequestsErrorResponse,
		stripePaymentMethodDefaultGet500InternalServerErrorResponse,
		stripePaymentMethodDefaultGet502BadGatewayErrorResponse,
		stripePaymentMethodDefaultGet503ServiceUnavailableErrorResponse,
		stripePaymentMethodDefaultGet504GatewayTimeoutErrorResponse,
		stripeSubscriptionsGet200OkSuccessResponse,
		stripeSubscriptionsGet201CreatedSuccessResponse,
		stripeSubscriptionsGet400BadRequestErrorResponse,
		stripeSubscriptionsGet401UnauthorizedErrorResponse,
		stripeSubscriptionsGet403ForbiddenErrorResponse,
		stripeSubscriptionsGet404NotFoundErrorResponse,
		stripeSubscriptionsGet429TooManyRequestsErrorResponse,
		stripeSubscriptionsGet500InternalServerErrorResponse,
		stripeSubscriptionsGet502BadGatewayErrorResponse,
		stripeSubscriptionsGet503ServiceUnavailableErrorResponse,
		stripeSubscriptionsGet504GatewayTimeoutErrorResponse,
		stripeSubscriptionsCurrentGet200OkSuccessResponse,
		stripeSubscriptionsCurrentGet201CreatedSuccessResponse,
		stripeSubscriptionsCurrentGet400BadRequestErrorResponse,
		stripeSubscriptionsCurrentGet401UnauthorizedErrorResponse,
		stripeSubscriptionsCurrentGet403ForbiddenErrorResponse,
		stripeSubscriptionsCurrentGet404NotFoundErrorResponse,
		stripeSubscriptionsCurrentGet429TooManyRequestsErrorResponse,
		stripeSubscriptionsCurrentGet500InternalServerErrorResponse,
		stripeSubscriptionsCurrentGet502BadGatewayErrorResponse,
		stripeSubscriptionsCurrentGet503ServiceUnavailableErrorResponse,
		stripeSubscriptionsCurrentGet504GatewayTimeoutErrorResponse,
		stripeSubscriptionsCurrentPost200OkSuccessResponse,
		stripeSubscriptionsCurrentPost201CreatedSuccessResponse,
		stripeSubscriptionsCurrentPost400BadRequestErrorResponse,
		stripeSubscriptionsCurrentPost401UnauthorizedErrorResponse,
		stripeSubscriptionsCurrentPost403ForbiddenErrorResponse,
		stripeSubscriptionsCurrentPost404NotFoundErrorResponse,
		stripeSubscriptionsCurrentPost429TooManyRequestsErrorResponse,
		stripeSubscriptionsCurrentPost500InternalServerErrorResponse,
		stripeSubscriptionsCurrentPost502BadGatewayErrorResponse,
		stripeSubscriptionsCurrentPost503ServiceUnavailableErrorResponse,
		stripeSubscriptionsCurrentPost504GatewayTimeoutErrorResponse,
		stripeSubscriptionsCurrentDelete200OkSuccessResponse,
		stripeSubscriptionsCurrentDelete201CreatedSuccessResponse,
		stripeSubscriptionsCurrentDelete204NoContentSuccessResponse,
		stripeSubscriptionsCurrentDelete400BadRequestErrorResponse,
		stripeSubscriptionsCurrentDelete401UnauthorizedErrorResponse,
		stripeSubscriptionsCurrentDelete403ForbiddenErrorResponse,
		stripeSubscriptionsCurrentDelete404NotFoundErrorResponse,
		stripeSubscriptionsCurrentDelete429TooManyRequestsErrorResponse,
		stripeSubscriptionsCurrentDelete500InternalServerErrorResponse,
		stripeSubscriptionsCurrentDelete502BadGatewayErrorResponse,
		stripeSubscriptionsCurrentDelete503ServiceUnavailableErrorResponse,
		stripeSubscriptionsCurrentDelete504GatewayTimeoutErrorResponse
	};
};
