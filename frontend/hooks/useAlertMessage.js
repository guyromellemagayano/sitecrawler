/* eslint-disable react-hooks/exhaustive-deps */
import { AlertDisplayInterval } from "@constants/GlobalValues";
import useTranslation from "next-translate/useTranslation";
import { useCallback, useEffect, useReducer, useState } from "react";
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
export function useAlertMessage() {
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
		method: null,
		status: null,
		responses: []
	});

	const [state, dispatch] = useReducer(messagesReducer, config);

	// Translations
	const { t } = useTranslation();

	// User translations
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
	const localTimeEnable200OkSuccessResponse = t("alerts:auth.user.patch.misc.localTime.enable.200OkSuccessResponse");
	const localTimeEnable201CreatedSuccessResponse = t(
		"alerts:auth.user.patch.misc.localTime.enable.201CreatedSuccessResponse"
	);
	const localTimeEnable400BadRequestErrorResponse = t(
		"alerts:auth.user.patch.misc.localTime.enable.400BadRequestErrorResponse"
	);
	const localTimeEnable401UnauthorizedErrorResponse = t(
		"alerts:auth.user.patch.misc.localTime.enable.401UnauthorizedErrorResponse"
	);
	const localTimeEnable403ForbiddenErrorResponse = t(
		"alerts:auth.user.patch.misc.localTime.enable.403ForbiddenErrorResponse"
	);
	const localTimeEnable404NotFoundErrorResponse = t(
		"alerts:auth.user.patch.misc.localTime.enable.404NotFoundErrorResponse"
	);
	const localTimeEnable429TooManyRequestsErrorResponse = t(
		"alerts:auth.user.patch.misc.localTime.enable.429TooManyRequestsErrorResponse"
	);
	const localTimeEnable500InternalServerErrorResponse = t(
		"alerts:auth.user.patch.misc.localTime.enable.500InternalServerErrorResponse"
	);
	const localTimeEnable502BadGatewayErrorResponse = t(
		"alerts:auth.user.patch.misc.localTime.enable.502BadGatewayErrorResponse"
	);
	const localTimeEnable503ServiceUnavailableErrorResponse = t(
		"alerts:auth.user.patch.misc.localTime.enable.503ServiceUnavailableErrorResponse"
	);
	const localTimeEnable504GatewayTimeoutErrorResponse = t(
		"alerts:auth.user.patch.misc.localTime.enable.504GatewayTimeoutErrorResponse"
	);
	const localTimeDisable200OkSuccessResponse = t("alerts:auth.user.patch.misc.localTime.disable.200OkSuccessResponse");
	const localTimeDisable201CreatedSuccessResponse = t(
		"alerts:auth.user.patch.misc.localTime.disable.201CreatedSuccessResponse"
	);
	const localTimeDisable400BadRequestErrorResponse = t(
		"alerts:auth.user.patch.misc.localTime.disable.400BadRequestErrorResponse"
	);
	const localTimeDisable401UnauthorizedErrorResponse = t(
		"alerts:auth.user.patch.misc.localTime.disable.401UnauthorizedErrorResponse"
	);
	const localTimeDisable403ForbiddenErrorResponse = t(
		"alerts:auth.user.patch.misc.localTime.disable.403ForbiddenErrorResponse"
	);
	const localTimeDisable404NotFoundErrorResponse = t(
		"alerts:auth.user.patch.misc.localTime.disable.404NotFoundErrorResponse"
	);
	const localTimeDisable429TooManyRequestsErrorResponse = t(
		"alerts:auth.user.patch.misc.localTime.disable.429TooManyRequestsErrorResponse"
	);
	const localTimeDisable500InternalServerErrorResponse = t(
		"alerts:auth.user.patch.misc.localTime.disable.500InternalServerErrorResponse"
	);
	const localTimeDisable502BadGatewayErrorResponse = t(
		"alerts:auth.user.patch.misc.localTime.disable.502BadGatewayErrorResponse"
	);
	const localTimeDisable503ServiceUnavailableErrorResponse = t(
		"alerts:auth.user.patch.misc.localTime.disable.503ServiceUnavailableErrorResponse"
	);
	const localTimeDisable504GatewayTimeoutErrorResponse = t(
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

	const handleMessages = useCallback(async () => {
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
			const method = config?.method ?? null;
			const status = config?.status ?? null;

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
					switch (method) {
						case "get":
							switch (Math.round(status / 100)) {
								case 2:
									switch (status) {
										case 200:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: userGet200OkSuccessResponse,
														isSuccess: true
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== userGet200OkSuccessResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 201:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: userGet201CreatedSuccessResponse,
														isSuccess: true
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== userGet201CreatedSuccessResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											break;
									}
									break;
								case 4:
									switch (status) {
										case 400:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: userGet400BadRequestErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== userGet400BadRequestErrorResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 401:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: userGet401UnauthorizedErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== userGet401UnauthorizedErrorResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 403:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: userGet403ForbiddenErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== userGet403ForbiddenErrorResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 404:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: userGet404NotFoundErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== userGet404NotFoundErrorResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 429:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: userGet429TooManyRequestsErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== userGet429TooManyRequestsErrorResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownClientErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownClientErrorResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
								case 5:
									switch (status) {
										case 500:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: userGet500InternalServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== userGet500InternalServerErrorResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 502:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: userGet502BadGatewayErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== userGet502BadGatewayErrorResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 503:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: userGet503ServiceUnavailableErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== userGet503ServiceUnavailableErrorResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 504:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: userGet504GatewayTimeoutErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== userGet504GatewayTimeoutErrorResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownServerErrorResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
								default:
									dispatch({
										...state,
										isUser: isUser,
										method: method,
										status: status,
										responses: [
											...state.responses,
											{
												responseText: fallbackUnknownResponse,
												isSuccess: false
											}
										]
									});

									setTimeout(() => {
										dispatch({
											...state,
											isUser: false,
											method: null,
											status: null,
											responses: [
												...state.responses,
												...state.responses.filter(({ responseText }) => responseText !== fallbackUnknownResponse)
											]
										});

										setConfig({
											isUser: false,
											method: null,
											status: null
										});
									}, AlertDisplayInterval);
									break;
							}
							break;
						case "patch":
							switch (Math.round(status / 100)) {
								case 2:
									switch (status) {
										case 200:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: userPatch200OkSuccessResponse,
														isSuccess: true
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== userPatch200OkSuccessResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 201:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: userPatch201CreatedSuccessResponse,
														isSuccess: true
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== userPatch201CreatedSuccessResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											break;
									}
									break;
								case 4:
									switch (status) {
										case 400:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: userPatch400BadRequestErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== userPatch400BadRequestErrorResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 401:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: userPatch401UnauthorizedErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== userPatch401UnauthorizedErrorResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 403:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: userPatch403ForbiddenErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== userPatch403ForbiddenErrorResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 404:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: userPatch404NotFoundErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== userPatch404NotFoundErrorResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 429:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: userPatch429TooManyRequestsErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== userPatch429TooManyRequestsErrorResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownClientErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownClientErrorResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
								case 5:
									switch (status) {
										case 500:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: userPatch500InternalServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== userPatch500InternalServerErrorResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 502:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: userPatch502BadGatewayErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== userPatch502BadGatewayErrorResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 503:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: userPatch503ServiceUnavailableErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== userPatch503ServiceUnavailableErrorResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 504:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: userPatch504GatewayTimeoutErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== userPatch504GatewayTimeoutErrorResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownServerErrorResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
								default:
									dispatch({
										...state,
										isUser: isUser,
										method: method,
										status: status,
										responses: [
											...state.responses,
											{
												responseText: fallbackUnknownResponse,
												isSuccess: false
											}
										]
									});

									setTimeout(() => {
										dispatch({
											...state,
											isUser: false,
											method: null,
											status: null,
											responses: [
												...state.responses,
												...state.responses.filter(({ responseText }) => responseText !== fallbackUnknownResponse)
											]
										});

										setConfig({
											isUser: false,
											method: null,
											status: null
										});
									}, AlertDisplayInterval);
									break;
							}
							break;
						case "put":
							switch (Math.round(status / 100)) {
								case 2:
									switch (status) {
										case 200:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: userPut200OkSuccessResponse,
														isSuccess: true
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== userPut200OkSuccessResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 201:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: userPut201CreatedSuccessResponse,
														isSuccess: true
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== userPut201CreatedSuccessResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											break;
									}
									break;
								case 4:
									switch (status) {
										case 400:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: userPut400BadRequestErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== userPut400BadRequestErrorResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 401:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: userPut401UnauthorizedErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== userPut401UnauthorizedErrorResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 403:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: userPut403ForbiddenErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== userPut403ForbiddenErrorResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 404:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: userPut404NotFoundErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== userPut404NotFoundErrorResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 429:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: userPut429TooManyRequestsErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== userPut429TooManyRequestsErrorResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownClientErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownClientErrorResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
								case 5:
									switch (status) {
										case 500:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: userPut500InternalServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== userPut500InternalServerErrorResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 502:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: userPut502BadGatewayErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== userPut502BadGatewayErrorResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 503:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: userPut503ServiceUnavailableErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== userPut503ServiceUnavailableErrorResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 504:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: userPut504GatewayTimeoutErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== userPut504GatewayTimeoutErrorResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isUser: isUser,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUser: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownServerErrorResponse
														)
													]
												});

												setConfig({
													isUser: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
								default:
									dispatch({
										...state,
										isUser: isUser,
										method: method,
										status: status,
										responses: [
											...state.responses,
											{
												responseText: fallbackUnknownResponse,
												isSuccess: false
											}
										]
									});

									setTimeout(() => {
										dispatch({
											...state,
											isUser: false,
											method: null,
											status: null,
											responses: [
												...state.responses,
												...state.responses.filter(({ responseText }) => responseText !== fallbackUnknownResponse)
											]
										});

										setConfig({
											isUser: false,
											method: null,
											status: null
										});
									}, AlertDisplayInterval);
									break;
							}
							break;
						default:
							break;
					}
				} else if (isLocalTimeEnabled) {
					switch (method) {
						case "post":
							switch (Math.round(status / 100)) {
								case 2:
									switch (status) {
										case 200:
											dispatch({
												...state,
												isLocalTimeEnabled: isLocalTimeEnabled,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: localTimeEnable200OkSuccessResponse,
														isSuccess: true
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLocalTimeEnabled: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== localTimeEnable200OkSuccessResponse
														)
													]
												});

												setConfig({
													isLocalTimeEnabled: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 201:
											dispatch({
												...state,
												isLocalTimeEnabled: isLocalTimeEnabled,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: localTimeEnable201CreatedSuccessResponse,
														isSuccess: true
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLocalTimeEnabled: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== localTimeEnable201CreatedSuccessResponse
														)
													]
												});

												setConfig({
													isLocalTimeEnabled: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											break;
									}
									break;
								case 4:
									switch (status) {
										case 400:
											dispatch({
												...state,
												isLocalTimeEnabled: isLocalTimeEnabled,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: localTimeEnable400BadRequestErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLocalTimeEnabled: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== localTimeEnable400BadRequestErrorResponse
														)
													]
												});

												setConfig({
													isLocalTimeEnabled: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 401:
											dispatch({
												...state,
												isLocalTimeEnabled: isLocalTimeEnabled,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: localTimeEnable401UnauthorizedErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLocalTimeEnabled: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== localTimeEnable401UnauthorizedErrorResponse
														)
													]
												});

												setConfig({
													isLocalTimeEnabled: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 403:
											dispatch({
												...state,
												isLocalTimeEnabled: isLocalTimeEnabled,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: localTimeEnable403ForbiddenErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLocalTimeEnabled: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== localTimeEnable403ForbiddenErrorResponse
														)
													]
												});

												setConfig({
													isLocalTimeEnabled: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 404:
											dispatch({
												...state,
												isLocalTimeEnabled: isLocalTimeEnabled,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: localTimeEnable404NotFoundErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLocalTimeEnabled: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== localTimeEnable404NotFoundErrorResponse
														)
													]
												});

												setConfig({
													isLocalTimeEnabled: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 429:
											dispatch({
												...state,
												isLocalTimeEnabled: isLocalTimeEnabled,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: localTimeEnable429TooManyRequestsErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLocalTimeEnabled: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== localTimeEnable429TooManyRequestsErrorResponse
														)
													]
												});

												setConfig({
													isLocalTimeEnabled: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isLocalTimeEnabled: isLocalTimeEnabled,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownClientErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLocalTimeEnabled: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownClientErrorResponse
														)
													]
												});

												setConfig({
													isLocalTimeEnabled: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
								case 5:
									switch (status) {
										case 500:
											dispatch({
												...state,
												isLocalTimeEnabled: isLocalTimeEnabled,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: localTimeEnable500InternalServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLocalTimeEnabled: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== localTimeEnable500InternalServerErrorResponse
														)
													]
												});

												setConfig({
													isLocalTimeEnabled: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 502:
											dispatch({
												...state,
												isLocalTimeEnabled: isLocalTimeEnabled,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: localTimeEnable502BadGatewayErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLocalTimeEnabled: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== localTimeEnable502BadGatewayErrorResponse
														)
													]
												});

												setConfig({
													isLocalTimeEnabled: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 503:
											dispatch({
												...state,
												isLocalTimeEnabled: isLocalTimeEnabled,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: localTimeEnable503ServiceUnavailableErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLocalTimeEnabled: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== localTimeEnable503ServiceUnavailableErrorResponse
														)
													]
												});

												setConfig({
													isLocalTimeEnabled: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 504:
											dispatch({
												...state,
												isLocalTimeEnabled: isLocalTimeEnabled,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: localTimeEnable504GatewayTimeoutErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLocalTimeEnabled: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== localTimeEnable504GatewayTimeoutErrorResponse
														)
													]
												});

												setConfig({
													isLocalTimeEnabled: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isLocalTimeEnabled: isLocalTimeEnabled,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLocalTimeEnabled: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownServerErrorResponse
														)
													]
												});

												setConfig({
													isLocalTimeEnabled: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
								default:
									dispatch({
										...state,
										isLocalTimeEnabled: isLocalTimeEnabled,
										method: method,
										status: status,
										responses: [
											...state.responses,
											{
												responseText: fallbackUnknownResponse,
												isSuccess: false
											}
										]
									});

									setTimeout(() => {
										dispatch({
											...state,
											isLocalTimeEnabled: false,
											method: null,
											status: null,
											responses: [
												...state.responses,
												...state.responses.filter(({ responseText }) => responseText !== fallbackUnknownResponse)
											]
										});

										setConfig({
											isLocalTimeEnabled: false,
											method: null,
											status: null
										});
									}, AlertDisplayInterval);
									break;
							}
							break;
						default:
							break;
					}
				} else if (isLocalTimeDisabled) {
					switch (method) {
						case "post":
							switch (Math.round(status / 100)) {
								case 2:
									switch (status) {
										case 200:
											dispatch({
												...state,
												isLocalTimeDisabled: isLocalTimeDisabled,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: localTimeDisable200OkSuccessResponse,
														isSuccess: true
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLocalTimeDisabled: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== localTimeDisable200OkSuccessResponse
														)
													]
												});

												setConfig({
													isLocalTimeDisabled: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 201:
											dispatch({
												...state,
												isLocalTimeDisabled: isLocalTimeDisabled,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: localTimeDisable201CreatedSuccessResponse,
														isSuccess: true
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLocalTimeDisabled: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== localTimeDisable201CreatedSuccessResponse
														)
													]
												});

												setConfig({
													isLocalTimeDisabled: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											break;
									}
									break;
								case 4:
									switch (status) {
										case 400:
											dispatch({
												...state,
												isLocalTimeDisabled: isLocalTimeDisabled,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: localTimeDisable400BadRequestErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLocalTimeDisabled: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== localTimeDisable400BadRequestErrorResponse
														)
													]
												});

												setConfig({
													isLocalTimeDisabled: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 401:
											dispatch({
												...state,
												isLocalTimeDisabled: isLocalTimeDisabled,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: localTimeDisable401UnauthorizedErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLocalTimeDisabled: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== localTimeDisable401UnauthorizedErrorResponse
														)
													]
												});

												setConfig({
													isLocalTimeDisabled: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 403:
											dispatch({
												...state,
												isLocalTimeDisabled: isLocalTimeDisabled,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: localTimeDisable403ForbiddenErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLocalTimeDisabled: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== localTimeDisable403ForbiddenErrorResponse
														)
													]
												});

												setConfig({
													isLocalTimeDisabled: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 404:
											dispatch({
												...state,
												isLocalTimeDisabled: isLocalTimeDisabled,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: localTimeDisable404NotFoundErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLocalTimeDisabled: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== localTimeDisable404NotFoundErrorResponse
														)
													]
												});

												setConfig({
													isLocalTimeDisabled: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 429:
											dispatch({
												...state,
												isLocalTimeDisabled: isLocalTimeDisabled,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: localTimeDisable429TooManyRequestsErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLocalTimeDisabled: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== localTimeDisable429TooManyRequestsErrorResponse
														)
													]
												});

												setConfig({
													isLocalTimeDisabled: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isLocalTimeDisabled: isLocalTimeDisabled,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownClientErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLocalTimeDisabled: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownClientErrorResponse
														)
													]
												});

												setConfig({
													isLocalTimeDisabled: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
								case 5:
									switch (status) {
										case 500:
											dispatch({
												...state,
												isLocalTimeDisabled: isLocalTimeDisabled,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: localTimeDisable500InternalServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLocalTimeDisabled: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== localTimeDisable500InternalServerErrorResponse
														)
													]
												});

												setConfig({
													isLocalTimeDisabled: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 502:
											dispatch({
												...state,
												isLocalTimeDisabled: isLocalTimeDisabled,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: localTimeDisable502BadGatewayErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLocalTimeDisabled: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== localTimeDisable502BadGatewayErrorResponse
														)
													]
												});

												setConfig({
													isLocalTimeDisabled: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 503:
											dispatch({
												...state,
												isLocalTimeDisabled: isLocalTimeDisabled,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: localTimeDisable503ServiceUnavailableErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLocalTimeDisabled: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== localTimeDisable503ServiceUnavailableErrorResponse
														)
													]
												});

												setConfig({
													isLocalTimeDisabled: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 504:
											dispatch({
												...state,
												isLocalTimeDisabled: isLocalTimeDisabled,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: localTimeDisable504GatewayTimeoutErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLocalTimeDisabled: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== localTimeDisable504GatewayTimeoutErrorResponse
														)
													]
												});

												setConfig({
													isLocalTimeDisabled: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isLocalTimeDisabled: isLocalTimeDisabled,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLocalTimeDisabled: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownServerErrorResponse
														)
													]
												});

												setConfig({
													isLocalTimeDisabled: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
								default:
									dispatch({
										...state,
										isLocalTimeDisabled: isLocalTimeDisabled,
										method: method,
										status: status,
										responses: [
											...state.responses,
											{
												responseText: fallbackUnknownResponse,
												isSuccess: false
											}
										]
									});

									setTimeout(() => {
										dispatch({
											...state,
											isLocalTimeDisabled: false,
											method: null,
											status: null,
											responses: [
												...state.responses,
												...state.responses.filter(({ responseText }) => responseText !== fallbackUnknownResponse)
											]
										});

										setConfig({
											isLocalTimeDisabled: false,
											method: null,
											status: null
										});
									}, AlertDisplayInterval);
									break;
							}
							break;
						default:
							break;
					}
				} else if (isLogin) {
					switch (method) {
						case "post":
							switch (Math.round(status / 100)) {
								case 2:
									switch (status) {
										case 200:
											dispatch({
												...state,
												isLogin: isLogin,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: loginPost200OkSuccessResponse,
														isSuccess: true
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogin: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== loginPost200OkSuccessResponse
														)
													]
												});

												setConfig({
													isLogin: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 201:
											dispatch({
												...state,
												isLogin: isLogin,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: loginPost201CreatedSuccessResponse,
														isSuccess: true
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogin: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== loginPost201CreatedSuccessResponse
														)
													]
												});

												setConfig({
													isLogin: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											break;
									}
									break;
								case 4:
									switch (status) {
										case 400:
											dispatch({
												...state,
												isLogin: isLogin,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: loginPost400BadRequestErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogin: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== loginPost400BadRequestErrorResponse
														)
													]
												});

												setConfig({
													isLogin: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 401:
											dispatch({
												...state,
												isLogin: isLogin,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: loginPost401UnauthorizedErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogin: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== loginPost401UnauthorizedErrorResponse
														)
													]
												});

												setConfig({
													isLogin: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 403:
											dispatch({
												...state,
												isLogin: isLogin,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: loginPost403ForbiddenErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogin: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== loginPost403ForbiddenErrorResponse
														)
													]
												});

												setConfig({
													isLogin: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 404:
											dispatch({
												...state,
												isLogin: isLogin,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: loginPost404NotFoundErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogin: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== loginPost404NotFoundErrorResponse
														)
													]
												});

												setConfig({
													isLogin: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 429:
											dispatch({
												...state,
												isLogin: isLogin,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: loginPost429TooManyRequestsErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogin: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== loginPost429TooManyRequestsErrorResponse
														)
													]
												});

												setConfig({
													isLogin: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isLogin: isLogin,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownClientErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogin: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownClientErrorResponse
														)
													]
												});

												setConfig({
													isLogin: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
								case 5:
									switch (status) {
										case 500:
											dispatch({
												...state,
												isLogin: isLogin,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: loginPost500InternalServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogin: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== loginPost500InternalServerErrorResponse
														)
													]
												});

												setConfig({
													isLogin: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 502:
											dispatch({
												...state,
												isLogin: isLogin,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: loginPost502BadGatewayErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogin: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== loginPost502BadGatewayErrorResponse
														)
													]
												});

												setConfig({
													isLogin: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 503:
											dispatch({
												...state,
												isLogin: isLogin,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: loginPost503ServiceUnavailableErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogin: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== loginPost503ServiceUnavailableErrorResponse
														)
													]
												});

												setConfig({
													isLogin: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 504:
											dispatch({
												...state,
												isLogin: isLogin,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: loginPost504GatewayTimeoutErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogin: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== loginPost504GatewayTimeoutErrorResponse
														)
													]
												});

												setConfig({
													isLogin: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isLogin: isLogin,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogin: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownServerErrorResponse
														)
													]
												});

												setConfig({
													isLogin: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
								default:
									dispatch({
										...state,
										isLogin: isLogin,
										method: method,
										status: status,
										responses: [
											...state.responses,
											{
												responseText: fallbackUnknownResponse,
												isSuccess: false
											}
										]
									});

									setTimeout(() => {
										dispatch({
											...state,
											isLogin: false,
											method: null,
											status: null,
											responses: [
												...state.responses,
												...state.responses.filter(({ responseText }) => responseText !== fallbackUnknownResponse)
											]
										});

										setConfig({
											isLogin: false,
											method: null,
											status: null
										});
									}, AlertDisplayInterval);
									break;
							}
							break;
						default:
							break;
					}
				} else if (isLogout) {
					switch (method) {
						case "post":
							switch (Math.round(status / 100)) {
								case 2:
									switch (status) {
										case 201:
											dispatch({
												...state,
												isLogout: isLogout,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: logoutPost201CreatedSuccessResponse,
														isSuccess: true
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogout: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== logoutPost201CreatedSuccessResponse
														)
													]
												});

												setConfig({
													isLogout: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											break;
									}
									break;
								case 4:
									switch (status) {
										case 400:
											dispatch({
												...state,
												isLogout: isLogout,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: logoutPost400BadRequestErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogout: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== logoutPost400BadRequestErrorResponse
														)
													]
												});

												setConfig({
													isLogout: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 401:
											dispatch({
												...state,
												isLogout: isLogout,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: logoutPost401UnauthorizedErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogout: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== logoutPost401UnauthorizedErrorResponse
														)
													]
												});

												setConfig({
													isLogout: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 403:
											dispatch({
												...state,
												isLogout: isLogout,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: logoutPost403ForbiddenErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogout: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== logoutPost403ForbiddenErrorResponse
														)
													]
												});

												setConfig({
													isLogout: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 404:
											dispatch({
												...state,
												isLogout: isLogout,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: logoutPost404NotFoundErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogout: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== logoutPost404NotFoundErrorResponse
														)
													]
												});

												setConfig({
													isLogout: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 429:
											dispatch({
												...state,
												isLogout: isLogout,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: logoutPost429TooManyRequestsErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogout: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== logoutPost429TooManyRequestsErrorResponse
														)
													]
												});

												setConfig({
													isLogout: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isLogout: isLogout,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownClientErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogout: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownClientErrorResponse
														)
													]
												});

												setConfig({
													isLogout: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
								case 5:
									switch (status) {
										case 500:
											dispatch({
												...state,
												isLogout: isLogout,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: logoutPost500InternalServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogout: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== logoutPost500InternalServerErrorResponse
														)
													]
												});

												setConfig({
													isLogout: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 502:
											dispatch({
												...state,
												isLogout: isLogout,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: logoutPost502BadGatewayErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogout: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== logoutPost502BadGatewayErrorResponse
														)
													]
												});

												setConfig({
													isLogout: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 503:
											dispatch({
												...state,
												isLogout: isLogout,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: logoutPost503ServiceUnavailableErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogout: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== logoutPost503ServiceUnavailableErrorResponse
														)
													]
												});

												setConfig({
													isLogout: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 504:
											dispatch({
												...state,
												isLogout: isLogout,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: logoutPost504GatewayTimeoutErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogout: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== logoutPost504GatewayTimeoutErrorResponse
														)
													]
												});

												setConfig({
													isLogout: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isLogout: isLogout,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogout: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownServerErrorResponse
														)
													]
												});

												setConfig({
													isLogout: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
							}
							break;
						case "get":
							switch (Math.round(status / 100)) {
								case 2:
									switch (status) {
										case 200:
											dispatch({
												...state,
												isLogout: isLogout,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: logoutGet200OkSuccessResponse,
														isSuccess: true
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogout: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== logoutGet200OkSuccessResponse
														)
													]
												});

												setConfig({
													isLogout: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											break;
									}
									break;
								case 4:
									switch (status) {
										case 400:
											dispatch({
												...state,
												isLogout: isLogout,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: logoutGet400BadRequestErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogout: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== logoutGet400BadRequestErrorResponse
														)
													]
												});

												setConfig({
													isLogout: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 401:
											dispatch({
												...state,
												isLogout: isLogout,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: logoutGet401UnauthorizedErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogout: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== logoutGet401UnauthorizedErrorResponse
														)
													]
												});

												setConfig({
													isLogout: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 403:
											dispatch({
												...state,
												isLogout: isLogout,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: logoutGet403ForbiddenErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogout: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== logoutGet403ForbiddenErrorResponse
														)
													]
												});

												setConfig({
													isLogout: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 404:
											dispatch({
												...state,
												isLogout: isLogout,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: logoutGet404NotFoundErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogout: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== logoutGet404NotFoundErrorResponse
														)
													]
												});

												setConfig({
													isLogout: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 429:
											dispatch({
												...state,
												isLogout: isLogout,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: logoutGet429TooManyRequestsErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogout: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== logoutGet429TooManyRequestsErrorResponse
														)
													]
												});

												setConfig({
													isLogout: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isLogout: isLogout,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownClientErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogout: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownClientErrorResponse
														)
													]
												});

												setConfig({
													isLogout: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
								case 5:
									switch (status) {
										case 500:
											dispatch({
												...state,
												isLogout: isLogout,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: logoutGet500InternalServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogout: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== logoutGet500InternalServerErrorResponse
														)
													]
												});

												setConfig({
													isLogout: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 502:
											dispatch({
												...state,
												isLogout: isLogout,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: logoutGet502BadGatewayErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogout: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== logoutGet502BadGatewayErrorResponse
														)
													]
												});

												setConfig({
													isLogout: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 503:
											dispatch({
												...state,
												isLogout: isLogout,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: logoutGet503ServiceUnavailableErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogout: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== logoutGet503ServiceUnavailableErrorResponse
														)
													]
												});

												setConfig({
													isLogout: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 504:
											dispatch({
												...state,
												isLogout: isLogout,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: logoutGet504GatewayTimeoutErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogout: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== logoutGet504GatewayTimeoutErrorResponse
														)
													]
												});

												setConfig({
													isLogout: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isLogout: isLogout,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isLogout: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownServerErrorResponse
														)
													]
												});

												setConfig({
													isLogout: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
								default:
									dispatch({
										...state,
										isLogout: isLogout,
										method: method,
										status: status,
										responses: [
											...state.responses,
											{
												responseText: fallbackUnknownResponse,
												isSuccess: false
											}
										]
									});

									setTimeout(() => {
										dispatch({
											...state,
											isLogout: false,
											method: null,
											status: null,
											responses: [
												...state.responses,
												...state.responses.filter(({ responseText }) => responseText !== fallbackUnknownResponse)
											]
										});

										setConfig({
											isLogout: false,
											method: null,
											status: null
										});
									}, AlertDisplayInterval);
									break;
							}
							break;
						default:
							break;
					}
				} else if (isRegistration) {
					switch (method) {
						case "post":
							switch (Math.round(status / 100)) {
								case 2:
									switch (status) {
										case 200:
											dispatch({
												...state,
												isRegistration: isRegistration,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: registrationPost200OkSuccessResponse,
														isSuccess: true
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isRegistration: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== registrationPost200OkSuccessResponse
														)
													]
												});

												setConfig({
													isRegistration: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 201:
											dispatch({
												...state,
												isRegistration: isRegistration,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: registrationPost201CreatedSuccessResponse,
														isSuccess: true
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isRegistration: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== registrationPost201CreatedSuccessResponse
														)
													]
												});

												setConfig({
													isRegistration: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											break;
									}
									break;
								case 4:
									switch (status) {
										case 400:
											dispatch({
												...state,
												isRegistration: isRegistration,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: registrationPost400BadRequestErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isRegistration: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== registrationPost400BadRequestErrorResponse
														)
													]
												});

												setConfig({
													isRegistration: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 401:
											dispatch({
												...state,
												isRegistration: isRegistration,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: registrationPost401UnauthorizedErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isRegistration: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== registrationPost401UnauthorizedErrorResponse
														)
													]
												});

												setConfig({
													isRegistration: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 403:
											dispatch({
												...state,
												isRegistration: isRegistration,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: registrationPost403ForbiddenErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isRegistration: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== registrationPost403ForbiddenErrorResponse
														)
													]
												});

												setConfig({
													isRegistration: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 404:
											dispatch({
												...state,
												isRegistration: isRegistration,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: registrationPost404NotFoundErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isRegistration: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== registrationPost404NotFoundErrorResponse
														)
													]
												});

												setConfig({
													isRegistration: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 429:
											dispatch({
												...state,
												isRegistration: isRegistration,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: registrationPost429TooManyRequestsErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isRegistration: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== registrationPost429TooManyRequestsErrorResponse
														)
													]
												});

												setConfig({
													isRegistration: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isRegistration: isRegistration,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownClientErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isRegistration: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownClientErrorResponse
														)
													]
												});

												setConfig({
													isRegistration: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
								case 5:
									switch (status) {
										case 500:
											dispatch({
												...state,
												isRegistration: isRegistration,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: registrationPost500InternalServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isRegistration: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== registrationPost500InternalServerErrorResponse
														)
													]
												});

												setConfig({
													isRegistration: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 502:
											dispatch({
												...state,
												isRegistration: isRegistration,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: registrationPost502BadGatewayErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isRegistration: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== registrationPost502BadGatewayErrorResponse
														)
													]
												});

												setConfig({
													isRegistration: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 503:
											dispatch({
												...state,
												isRegistration: isRegistration,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: registrationPost503ServiceUnavailableErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isRegistration: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== registrationPost503ServiceUnavailableErrorResponse
														)
													]
												});

												setConfig({
													isRegistration: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 504:
											dispatch({
												...state,
												isRegistration: isRegistration,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: registrationPost504GatewayTimeoutErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isRegistration: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== registrationPost504GatewayTimeoutErrorResponse
														)
													]
												});

												setConfig({
													isRegistration: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isRegistration: isRegistration,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isRegistration: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownServerErrorResponse
														)
													]
												});

												setConfig({
													isRegistration: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
								default:
									dispatch({
										...state,
										isLogin: isLogin,
										method: method,
										status: status,
										responses: [
											...state.responses,
											{
												responseText: fallbackUnknownResponse,
												isSuccess: false
											}
										]
									});

									setTimeout(() => {
										dispatch({
											...state,
											isLogin: false,
											method: null,
											status: null,
											responses: [
												...state.responses,
												...state.responses.filter(({ responseText }) => responseText !== fallbackUnknownResponse)
											]
										});
									}, AlertDisplayInterval);
									break;
							}
							break;
						default:
							break;
					}
				} else if (isPasswordChange) {
					switch (method) {
						case "post":
							switch (Math.round(status / 100)) {
								case 2:
									switch (status) {
										case 200:
											dispatch({
												...state,
												isPasswordChange: isPasswordChange,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: passwordChangePost200OkSuccessResponse,
														isSuccess: true
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordChange: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordChangePost200OkSuccessResponse
														)
													]
												});

												setConfig({
													isPasswordChange: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 201:
											dispatch({
												...state,
												isPasswordChange: isPasswordChange,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: passwordChangePost201CreatedSuccessResponse,
														isSuccess: true
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordChange: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordChangePost201CreatedSuccessResponse
														)
													]
												});

												setConfig({
													isPasswordChange: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											break;
									}
									break;
								case 4:
									switch (status) {
										case 400:
											dispatch({
												...state,
												isPasswordChange: isPasswordChange,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: passwordChangePost400BadRequestErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordChange: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordChangePost400BadRequestErrorResponse
														)
													]
												});

												setConfig({
													isPasswordChange: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 401:
											dispatch({
												...state,
												isPasswordChange: isPasswordChange,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: passwordChangePost401UnauthorizedErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordChange: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordChangePost401UnauthorizedErrorResponse
														)
													]
												});

												setConfig({
													isPasswordChange: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 403:
											dispatch({
												...state,
												isPasswordChange: isPasswordChange,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: passwordChangePost403ForbiddenErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordChange: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordChangePost403ForbiddenErrorResponse
														)
													]
												});

												setConfig({
													isPasswordChange: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 404:
											dispatch({
												...state,
												isPasswordChange: isPasswordChange,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: passwordChangePost404NotFoundErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordChange: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordChangePost404NotFoundErrorResponse
														)
													]
												});

												setConfig({
													isPasswordChange: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 429:
											dispatch({
												...state,
												isPasswordChange: isPasswordChange,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: passwordChangePost429TooManyRequestsErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordChange: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordChangePost429TooManyRequestsErrorResponse
														)
													]
												});

												setConfig({
													isPasswordChange: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isPasswordChange: isPasswordChange,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownClientErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordChange: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownClientErrorResponse
														)
													]
												});

												setConfig({
													isPasswordChange: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
								case 5:
									switch (status) {
										case 500:
											dispatch({
												...state,
												isPasswordChange: isPasswordChange,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: passwordChangePost500InternalServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordChange: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordChangePost500InternalServerErrorResponse
														)
													]
												});

												setConfig({
													isPasswordChange: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 502:
											dispatch({
												...state,
												isPasswordChange: isPasswordChange,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: passwordChangePost502BadGatewayErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordChange: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordChangePost502BadGatewayErrorResponse
														)
													]
												});

												setConfig({
													isPasswordChange: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 503:
											dispatch({
												...state,
												isPasswordChange: isPasswordChange,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: passwordChangePost503ServiceUnavailableErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordChange: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) =>
																responseText !== passwordChangePost503ServiceUnavailableErrorResponse
														)
													]
												});

												setConfig({
													isPasswordChange: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 504:
											dispatch({
												...state,
												isPasswordChange: isPasswordChange,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: passwordChangePost504GatewayTimeoutErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordChange: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordChangePost504GatewayTimeoutErrorResponse
														)
													]
												});

												setConfig({
													isPasswordChange: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isPasswordChange: isPasswordChange,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordChange: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownServerErrorResponse
														)
													]
												});

												setConfig({
													isPasswordChange: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
								default:
									dispatch({
										...state,
										isPasswordChange: isPasswordChange,
										method: method,
										status: status,
										responses: [
											...state.responses,
											{
												responseText: fallbackUnknownResponse,
												isSuccess: false
											}
										]
									});

									setTimeout(() => {
										dispatch({
											...state,
											isPasswordChange: false,
											method: null,
											status: null,
											responses: [
												...state.responses,
												...state.responses.filter(({ responseText }) => responseText !== fallbackUnknownResponse)
											]
										});

										setConfig({
											isPasswordChange: false,
											method: null,
											status: null
										});
									}, AlertDisplayInterval);
									break;
							}
							break;
						default:
							break;
					}
				} else if (isPasswordReset) {
					switch (method) {
						case "post":
							switch (Math.round(status / 100)) {
								case 2:
									switch (status) {
										case 200:
											dispatch({
												...state,
												isPasswordReset: isPasswordReset,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: passwordResetPost200OkSuccessResponse,
														isSuccess: true
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordReset: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordResetPost200OkSuccessResponse
														)
													]
												});

												setConfig({
													isPasswordReset: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 201:
											dispatch({
												...state,
												isPasswordReset: isPasswordReset,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: passwordResetPost201CreatedSuccessResponse,
														isSuccess: true
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordReset: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordResetPost201CreatedSuccessResponse
														)
													]
												});

												setConfig({
													isPasswordReset: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											break;
									}
									break;
								case 4:
									switch (status) {
										case 400:
											dispatch({
												...state,
												isPasswordReset: isPasswordReset,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: passwordResetPost400BadRequestErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordReset: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordResetPost400BadRequestErrorResponse
														)
													]
												});

												setConfig({
													isPasswordReset: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 401:
											dispatch({
												...state,
												isPasswordReset: isPasswordReset,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: passwordResetPost401UnauthorizedErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordReset: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordResetPost401UnauthorizedErrorResponse
														)
													]
												});

												setConfig({
													isPasswordReset: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 403:
											dispatch({
												...state,
												isPasswordReset: isPasswordReset,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: passwordResetPost403ForbiddenErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordReset: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordResetPost403ForbiddenErrorResponse
														)
													]
												});

												setConfig({
													isPasswordReset: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 404:
											dispatch({
												...state,
												isPasswordReset: isPasswordReset,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: passwordResetPost404NotFoundErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordReset: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordResetPost404NotFoundErrorResponse
														)
													]
												});

												setConfig({
													isPasswordReset: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 429:
											dispatch({
												...state,
												isPasswordReset: isPasswordReset,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: passwordResetPost429TooManyRequestsErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordReset: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordResetPost429TooManyRequestsErrorResponse
														)
													]
												});

												setConfig({
													isPasswordReset: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isPasswordReset: isPasswordReset,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownClientErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordReset: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownClientErrorResponse
														)
													]
												});

												setConfig({
													isPasswordReset: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
								case 5:
									switch (status) {
										case 500:
											dispatch({
												...state,
												isPasswordReset: isPasswordReset,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: passwordResetPost500InternalServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordReset: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordResetPost500InternalServerErrorResponse
														)
													]
												});

												setConfig({
													isPasswordReset: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 502:
											dispatch({
												...state,
												isPasswordReset: isPasswordReset,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: passwordResetPost502BadGatewayErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordReset: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordResetPost502BadGatewayErrorResponse
														)
													]
												});

												setConfig({
													isPasswordReset: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 503:
											dispatch({
												...state,
												isPasswordReset: isPasswordReset,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: passwordResetPost503ServiceUnavailableErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordReset: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordResetPost503ServiceUnavailableErrorResponse
														)
													]
												});

												setConfig({
													isPasswordReset: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 504:
											dispatch({
												...state,
												isPasswordReset: isPasswordReset,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: passwordResetPost504GatewayTimeoutErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordReset: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordResetPost504GatewayTimeoutErrorResponse
														)
													]
												});

												setConfig({
													isPasswordReset: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isPasswordReset: isPasswordReset,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordReset: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownServerErrorResponse
														)
													]
												});

												setConfig({
													isPasswordReset: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
								default:
									dispatch({
										...state,
										isPasswordReset: isPasswordReset,
										method: method,
										status: status,
										responses: [
											...state.responses,
											{
												responseText: fallbackUnknownResponse,
												isSuccess: false
											}
										]
									});

									setTimeout(() => {
										dispatch({
											...state,
											isPasswordReset: false,
											method: null,
											status: null,
											responses: [
												...state.responses,
												...state.responses.filter(({ responseText }) => responseText !== fallbackUnknownResponse)
											]
										});

										setConfig({
											isPasswordReset: false,
											method: null,
											status: null
										});
									}, AlertDisplayInterval);
									break;
							}
							break;
						default:
							break;
					}
				} else if (isPasswordResetConfirm) {
					switch (method) {
						case "post":
							switch (Math.round(status / 100)) {
								case 2:
									switch (status) {
										case 200:
											dispatch({
												...state,
												isPasswordResetConfirm: isPasswordResetConfirm,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: passwordResetConfirmPost200OkSuccessResponse,
														isSuccess: true
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordResetConfirm: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordResetConfirmPost200OkSuccessResponse
														)
													]
												});

												setConfig({
													isPasswordResetConfirm: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 201:
											dispatch({
												...state,
												isPasswordResetConfirm: isPasswordResetConfirm,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: passwordResetConfirmPost201CreatedSuccessResponse,
														isSuccess: true
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordResetConfirm: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordResetConfirmPost201CreatedSuccessResponse
														)
													]
												});

												setConfig({
													isPasswordResetConfirm: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											break;
									}
									break;
								case 4:
									switch (status) {
										case 400:
											dispatch({
												...state,
												isPasswordResetConfirm: isPasswordResetConfirm,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: passwordResetConfirmPost400BadRequestErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordResetConfirm: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordResetConfirmPost400BadRequestErrorResponse
														)
													]
												});

												setConfig({
													isPasswordResetConfirm: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 401:
											dispatch({
												...state,
												isPasswordResetConfirm: isPasswordResetConfirm,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: passwordResetConfirmPost401UnauthorizedErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordResetConfirm: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) =>
																responseText !== passwordResetConfirmPost401UnauthorizedErrorResponse
														)
													]
												});

												setConfig({
													isPasswordResetConfirm: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 403:
											dispatch({
												...state,
												isPasswordResetConfirm: isPasswordResetConfirm,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: passwordResetConfirmPost403ForbiddenErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordResetConfirm: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordResetConfirmPost403ForbiddenErrorResponse
														)
													]
												});

												setConfig({
													isPasswordResetConfirm: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 404:
											dispatch({
												...state,
												isPasswordResetConfirm: isPasswordResetConfirm,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: passwordResetConfirmPost404NotFoundErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordResetConfirm: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordResetConfirmPost404NotFoundErrorResponse
														)
													]
												});

												setConfig({
													isPasswordResetConfirm: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 429:
											dispatch({
												...state,
												isPasswordResetConfirm: isPasswordResetConfirm,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: passwordResetConfirmPost429TooManyRequestsErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordResetConfirm: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) =>
																responseText !== passwordResetConfirmPost429TooManyRequestsErrorResponse
														)
													]
												});

												setConfig({
													isPasswordResetConfirm: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isPasswordResetConfirm: isPasswordResetConfirm,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownClientErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordResetConfirm: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownClientErrorResponse
														)
													]
												});

												setConfig({
													isPasswordResetConfirm: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
								case 5:
									switch (status) {
										case 500:
											dispatch({
												...state,
												isPasswordResetConfirm: isPasswordResetConfirm,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: passwordResetConfirmPost500InternalServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordResetConfirm: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) =>
																responseText !== passwordResetConfirmPost500InternalServerErrorResponse
														)
													]
												});

												setConfig({
													isPasswordResetConfirm: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 502:
											dispatch({
												...state,
												isPasswordResetConfirm: isPasswordResetConfirm,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: passwordResetConfirmPost502BadGatewayErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordResetConfirm: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordResetConfirmPost502BadGatewayErrorResponse
														)
													]
												});

												setConfig({
													isPasswordResetConfirm: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 503:
											dispatch({
												...state,
												isPasswordResetConfirm: isPasswordResetConfirm,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: passwordResetConfirmPost503ServiceUnavailableErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordResetConfirm: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) =>
																responseText !== passwordResetConfirmPost503ServiceUnavailableErrorResponse
														)
													]
												});

												setConfig({
													isPasswordResetConfirm: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 504:
											dispatch({
												...state,
												isPasswordResetConfirm: isPasswordResetConfirm,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: passwordResetConfirmPost504GatewayTimeoutErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordResetConfirm: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) =>
																responseText !== passwordResetConfirmPost504GatewayTimeoutErrorResponse
														)
													]
												});

												setConfig({
													isPasswordResetConfirm: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isPasswordResetConfirm: isPasswordResetConfirm,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPasswordResetConfirm: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownServerErrorResponse
														)
													]
												});

												setConfig({
													isPasswordResetConfirm: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
								default:
									dispatch({
										...state,
										isPasswordResetConfirm: isPasswordResetConfirm,
										method: method,
										status: status,
										responses: [
											...state.responses,
											{
												responseText: fallbackUnknownResponse,
												isSuccess: false
											}
										]
									});

									setTimeout(() => {
										dispatch({
											...state,
											isPasswordResetConfirm: false,
											method: null,
											status: null,
											responses: [
												...state.responses,
												...state.responses.filter(({ responseText }) => responseText !== fallbackUnknownResponse)
											]
										});

										setConfig({
											isPasswordResetConfirm: false,
											method: null,
											status: null
										});
									}, AlertDisplayInterval);
									break;
							}
							break;
						default:
							break;
					}
				} else if (isUrlInformationStep) {
					switch (method) {
						case "patch":
							switch (Math.round(status / 100)) {
								case 2:
									switch (status) {
										case 200:
											dispatch({
												...state,
												isUrlInformationStep: isUrlInformationStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: urlInformationStepPatch200OkSuccessResponse,
														isSuccess: true
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUrlInformationStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordResetPost200OkSuccessResponse
														)
													]
												});

												setConfig({
													isUrlInformationStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 201:
											dispatch({
												...state,
												isUrlInformationStep: isUrlInformationStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: urlInformationStepPatch201CreatedSuccessResponse,
														isSuccess: true
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUrlInformationStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordResetPost201CreatedSuccessResponse
														)
													]
												});

												setConfig({
													isUrlInformationStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											break;
									}
									break;
								case 4:
									switch (status) {
										case 400:
											dispatch({
												...state,
												isUrlInformationStep: isUrlInformationStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: urlInformationStepPatch400BadRequestErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUrlInformationStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordResetPost400BadRequestErrorResponse
														)
													]
												});

												setConfig({
													isUrlInformationStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 401:
											dispatch({
												...state,
												isUrlInformationStep: isUrlInformationStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: urlInformationStepPatch401UnauthorizedErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUrlInformationStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordResetPost401UnauthorizedErrorResponse
														)
													]
												});

												setConfig({
													isUrlInformationStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 403:
											dispatch({
												...state,
												isUrlInformationStep: isUrlInformationStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: urlInformationStepPatch403ForbiddenErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUrlInformationStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordResetPost403ForbiddenErrorResponse
														)
													]
												});

												setConfig({
													isUrlInformationStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 404:
											dispatch({
												...state,
												isUrlInformationStep: isUrlInformationStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: urlInformationStepPatch404NotFoundErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUrlInformationStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordResetPost404NotFoundErrorResponse
														)
													]
												});

												setConfig({
													isUrlInformationStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 429:
											dispatch({
												...state,
												isUrlInformationStep: isUrlInformationStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: urlInformationStepPatch429TooManyRequestsErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUrlInformationStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordResetPost429TooManyRequestsErrorResponse
														)
													]
												});

												setConfig({
													isUrlInformationStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isUrlInformationStep: isUrlInformationStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownClientErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUrlInformationStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownClientErrorResponse
														)
													]
												});

												setConfig({
													isUrlInformationStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
								case 5:
									switch (status) {
										case 500:
											dispatch({
												...state,
												isUrlInformationStep: isUrlInformationStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: urlInformationStepPatch500InternalServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUrlInformationStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordResetPost500InternalServerErrorResponse
														)
													]
												});

												setConfig({
													isUrlInformationStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 502:
											dispatch({
												...state,
												isUrlInformationStep: isUrlInformationStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: urlInformationStepPatch502BadGatewayErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUrlInformationStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordResetPost502BadGatewayErrorResponse
														)
													]
												});

												setConfig({
													isUrlInformationStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 503:
											dispatch({
												...state,
												isUrlInformationStep: isUrlInformationStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: urlInformationStepPatch503ServiceUnavailableErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUrlInformationStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordResetPost503ServiceUnavailableErrorResponse
														)
													]
												});

												setConfig({
													isUrlInformationStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 504:
											dispatch({
												...state,
												isUrlInformationStep: isUrlInformationStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: urlInformationStepPatch504GatewayTimeoutErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUrlInformationStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== passwordResetPost504GatewayTimeoutErrorResponse
														)
													]
												});

												setConfig({
													isUrlInformationStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isUrlInformationStep: isUrlInformationStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUrlInformationStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownServerErrorResponse
														)
													]
												});

												setConfig({
													isUrlInformationStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
								default:
									dispatch({
										...state,
										isUrlInformationStep: isUrlInformationStep,
										method: method,
										status: status,
										responses: [
											...state.responses,
											{
												responseText: fallbackUnknownResponse,
												isSuccess: false
											}
										]
									});

									setTimeout(() => {
										dispatch({
											...state,
											isUrlInformationStep: false,
											method: null,
											status: null,
											responses: [
												...state.responses,
												...state.responses.filter(({ responseText }) => responseText !== fallbackUnknownResponse)
											]
										});

										setConfig({
											isUrlInformationStep: false,
											method: null,
											status: null
										});
									}, AlertDisplayInterval);
									break;
							}
							break;
						case "post":
							switch (Math.round(status / 100)) {
								case 2:
									switch (status) {
										case 200:
											dispatch({
												...state,
												isUrlInformationStep: isUrlInformationStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: urlInformationStepPost200OkSuccessResponse,
														isSuccess: true
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUrlInformationStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== urlInformationStepPost200OkSuccessResponse
														)
													]
												});

												setConfig({
													isUrlInformationStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 201:
											dispatch({
												...state,
												isUrlInformationStep: isUrlInformationStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: urlInformationStepPost201CreatedSuccessResponse,
														isSuccess: true
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUrlInformationStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== urlInformationStepPost201CreatedSuccessResponse
														)
													]
												});

												setConfig({
													isUrlInformationStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											break;
									}
									break;
								case 4:
									switch (status) {
										case 400:
											dispatch({
												...state,
												isUrlInformationStep: isUrlInformationStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: urlInformationStepPost400BadRequestErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUrlInformationStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== urlInformationStepPost400BadRequestErrorResponse
														)
													]
												});

												setConfig({
													isUrlInformationStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 401:
											dispatch({
												...state,
												isUrlInformationStep: isUrlInformationStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: urlInformationStepPost401UnauthorizedErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUrlInformationStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== urlInformationStepPost401UnauthorizedErrorResponse
														)
													]
												});

												setConfig({
													isUrlInformationStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 403:
											dispatch({
												...state,
												isUrlInformationStep: isUrlInformationStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: urlInformationStepPost403ForbiddenErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUrlInformationStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== urlInformationStepPost403ForbiddenErrorResponse
														)
													]
												});

												setConfig({
													isUrlInformationStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 404:
											dispatch({
												...state,
												isUrlInformationStep: isUrlInformationStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: urlInformationStepPost404NotFoundErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUrlInformationStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== urlInformationStepPost404NotFoundErrorResponse
														)
													]
												});

												setConfig({
													isUrlInformationStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 429:
											dispatch({
												...state,
												isUrlInformationStep: isUrlInformationStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: urlInformationStepPost429TooManyRequestsErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUrlInformationStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) =>
																responseText !== urlInformationStepPost429TooManyRequestsErrorResponse
														)
													]
												});

												setConfig({
													isUrlInformationStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isUrlInformationStep: isUrlInformationStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownClientErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUrlInformationStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownClientErrorResponse
														)
													]
												});

												setConfig({
													isUrlInformationStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
								case 5:
									switch (status) {
										case 500:
											dispatch({
												...state,
												isUrlInformationStep: isUrlInformationStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: urlInformationStepPost500InternalServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUrlInformationStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) =>
																responseText !== urlInformationStepPost500InternalServerErrorResponse
														)
													]
												});

												setConfig({
													isUrlInformationStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 502:
											dispatch({
												...state,
												isUrlInformationStep: isUrlInformationStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: urlInformationStepPost502BadGatewayErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUrlInformationStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== urlInformationStepPost502BadGatewayErrorResponse
														)
													]
												});

												setConfig({
													isUrlInformationStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 503:
											dispatch({
												...state,
												isUrlInformationStep: isUrlInformationStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: urlInformationStepPost503ServiceUnavailableErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUrlInformationStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) =>
																responseText !== urlInformationStepPost503ServiceUnavailableErrorResponse
														)
													]
												});

												setConfig({
													isUrlInformationStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 504:
											dispatch({
												...state,
												isUrlInformationStep: isUrlInformationStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: urlInformationStepPost504GatewayTimeoutErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUrlInformationStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) =>
																responseText !== urlInformationStepPost504GatewayTimeoutErrorResponse
														)
													]
												});

												setConfig({
													isUrlInformationStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isUrlInformationStep: isUrlInformationStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isUrlInformationStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownServerErrorResponse
														)
													]
												});

												setConfig({
													isUrlInformationStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
								default:
									dispatch({
										...state,
										isUrlInformationStep: isUrlInformationStep,
										method: method,
										status: status,
										responses: [
											...state.responses,
											{
												responseText: fallbackUnknownResponse,
												isSuccess: false
											}
										]
									});

									setTimeout(() => {
										dispatch({
											...state,
											isUrlInformationStep: false,
											method: null,
											status: null,
											responses: [
												...state.responses,
												...state.responses.filter(({ responseText }) => responseText !== fallbackUnknownResponse)
											]
										});

										setConfig({
											isUrlInformationStep: false,
											method: null,
											status: null
										});
									}, AlertDisplayInterval);
									break;
							}
							break;
						default:
							break;
					}
				} else if (isVerifyUrlStep) {
					switch (method) {
						case "post":
							switch (Math.round(status / 100)) {
								case 2:
									switch (status) {
										case 200:
											dispatch({
												...state,
												isVerifyUrlStep: isVerifyUrlStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: verifyUrlStepPost200OkSuccessResponse,
														isSuccess: true
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isVerifyUrlStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== verifyUrlStepPost200OkSuccessResponse
														)
													]
												});

												setConfig({
													isVerifyUrlStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 201:
											dispatch({
												...state,
												isVerifyUrlStep: isVerifyUrlStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: verifyUrlStepPost201CreatedSuccessResponse,
														isSuccess: true
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isVerifyUrlStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== verifyUrlStepPost201CreatedSuccessResponse
														)
													]
												});

												setConfig({
													isVerifyUrlStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											break;
									}
									break;
								case 4:
									switch (status) {
										case 400:
											dispatch({
												...state,
												isVerifyUrlStep: isVerifyUrlStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: verifyUrlStepPost400BadRequestErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isVerifyUrlStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== verifyUrlStepPost400BadRequestErrorResponse
														)
													]
												});

												setConfig({
													isVerifyUrlStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 401:
											dispatch({
												...state,
												isVerifyUrlStep: isVerifyUrlStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: verifyUrlStepPost401UnauthorizedErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isVerifyUrlStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== verifyUrlStepPost401UnauthorizedErrorResponse
														)
													]
												});

												setConfig({
													isVerifyUrlStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 403:
											dispatch({
												...state,
												isVerifyUrlStep: isVerifyUrlStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: verifyUrlStepPost403ForbiddenErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isVerifyUrlStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== verifyUrlStepPost403ForbiddenErrorResponse
														)
													]
												});

												setConfig({
													isVerifyUrlStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 404:
											dispatch({
												...state,
												isVerifyUrlStep: isVerifyUrlStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: verifyUrlStepPost404NotFoundErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isVerifyUrlStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== verifyUrlStepPost404NotFoundErrorResponse
														)
													]
												});

												setConfig({
													isVerifyUrlStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 429:
											dispatch({
												...state,
												isVerifyUrlStep: isVerifyUrlStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: verifyUrlStepPost429TooManyRequestsErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isVerifyUrlStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== verifyUrlStepPost429TooManyRequestsErrorResponse
														)
													]
												});

												setConfig({
													isVerifyUrlStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isVerifyUrlStep: isVerifyUrlStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownClientErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isVerifyUrlStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownClientErrorResponse
														)
													]
												});

												setConfig({
													isVerifyUrlStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
								case 5:
									switch (status) {
										case 500:
											dispatch({
												...state,
												isVerifyUrlStep: isVerifyUrlStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: verifyUrlStepPost500InternalServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isVerifyUrlStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== verifyUrlStepPost500InternalServerErrorResponse
														)
													]
												});

												setConfig({
													isVerifyUrlStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 502:
											dispatch({
												...state,
												isVerifyUrlStep: isVerifyUrlStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: verifyUrlStepPost502BadGatewayErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isVerifyUrlStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== verifyUrlStepPost502BadGatewayErrorResponse
														)
													]
												});

												setConfig({
													isVerifyUrlStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 503:
											dispatch({
												...state,
												isVerifyUrlStep: isVerifyUrlStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: verifyUrlStepPost503ServiceUnavailableErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isVerifyUrlStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== verifyUrlStepPost503ServiceUnavailableErrorResponse
														)
													]
												});

												setConfig({
													isVerifyUrlStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 504:
											dispatch({
												...state,
												isVerifyUrlStep: isVerifyUrlStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: verifyUrlStepPost504GatewayTimeoutErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isVerifyUrlStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== verifyUrlStepPost504GatewayTimeoutErrorResponse
														)
													]
												});

												setConfig({
													isVerifyUrlStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isVerifyUrlStep: isVerifyUrlStep,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isVerifyUrlStep: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownServerErrorResponse
														)
													]
												});

												setConfig({
													isVerifyUrlStep: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
								default:
									dispatch({
										...state,
										isVerifyUrlStep: isVerifyUrlStep,
										method: method,
										status: status,
										responses: [
											...state.responses,
											{
												responseText: fallbackUnknownResponse,
												isSuccess: false
											}
										]
									});

									setTimeout(() => {
										dispatch({
											...state,
											isVerifyUrlStep: false,
											method: null,
											status: null,
											responses: [
												...state.responses,
												...state.responses.filter(({ responseText }) => responseText !== fallbackUnknownResponse)
											]
										});

										setConfig({
											isVerifyUrlStep: false,
											method: null,
											status: null
										});
									}, AlertDisplayInterval);
									break;
							}
							break;
						default:
							break;
					}
				} else if (isSupport) {
					switch (method) {
						case "post":
							switch (Math.round(status / 100)) {
								case 2:
									switch (status) {
										case 200:
											dispatch({
												...state,
												isSupport: isSupport,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: supportPost200OkSuccessResponse,
														isSuccess: true
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isSupport: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== supportPost200OkSuccessResponse
														)
													]
												});

												setConfig({
													isSupport: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 201:
											dispatch({
												...state,
												isSupport: isSupport,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: supportPost201CreatedSuccessResponse,
														isSuccess: true
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isSupport: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== supportPost201CreatedSuccessResponse
														)
													]
												});

												setConfig({
													isSupport: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											break;
									}
									break;
								case 4:
									switch (status) {
										case 400:
											dispatch({
												...state,
												isSupport: isSupport,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: supportPost400BadRequestErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isSupport: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== supportPost400BadRequestErrorResponse
														)
													]
												});

												setConfig({
													isSupport: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 401:
											dispatch({
												...state,
												isSupport: isSupport,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: supportPost401UnauthorizedErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isSupport: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== supportPost401UnauthorizedErrorResponse
														)
													]
												});

												setConfig({
													isSupport: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 403:
											dispatch({
												...state,
												isSupport: isSupport,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: supportPost403ForbiddenErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isSupport: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== supportPost403ForbiddenErrorResponse
														)
													]
												});

												setConfig({
													isSupport: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 404:
											dispatch({
												...state,
												isSupport: isSupport,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: supportPost404NotFoundErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isSupport: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== supportPost404NotFoundErrorResponse
														)
													]
												});

												setConfig({
													isSupport: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 429:
											dispatch({
												...state,
												isSupport: isSupport,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: supportPost429TooManyRequestsErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isSupport: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== supportPost429TooManyRequestsErrorResponse
														)
													]
												});

												setConfig({
													isSupport: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isSupport: isSupport,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownClientErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isSupport: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownClientErrorResponse
														)
													]
												});

												setConfig({
													isSupport: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
								case 5:
									switch (status) {
										case 500:
											dispatch({
												...state,
												isSupport: isSupport,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: supportPost500InternalServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isSupport: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== supportPost500InternalServerErrorResponse
														)
													]
												});

												setConfig({
													isSupport: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 502:
											dispatch({
												...state,
												isSupport: isSupport,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: supportPost502BadGatewayErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isSupport: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== supportPost502BadGatewayErrorResponse
														)
													]
												});

												setConfig({
													isSupport: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 503:
											dispatch({
												...state,
												isSupport: isSupport,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: supportPost503ServiceUnavailableErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isSupport: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== supportPost503ServiceUnavailableErrorResponse
														)
													]
												});

												setConfig({
													isSupport: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 504:
											dispatch({
												...state,
												isSupport: isSupport,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: supportPost504GatewayTimeoutErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isSupport: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== supportPost504GatewayTimeoutErrorResponse
														)
													]
												});

												setConfig({
													isSupport: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isSupport: isSupport,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isSupport: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownServerErrorResponse
														)
													]
												});

												setConfig({
													isSupport: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
								default:
									dispatch({
										...state,
										isSupport: isSupport,
										method: method,
										status: status,
										responses: [
											...state.responses,
											{
												responseText: fallbackUnknownResponse,
												isSuccess: false
											}
										]
									});

									setTimeout(() => {
										dispatch({
											...state,
											isSupport: false,
											method: null,
											status: null,
											responses: [
												...state.responses,
												...state.responses.filter(({ responseText }) => responseText !== fallbackUnknownResponse)
											]
										});

										setConfig({
											isSupport: false,
											method: null,
											status: null
										});
									}, AlertDisplayInterval);
									break;
							}
							break;
						default:
							break;
					}
				} else if (isPaymentMethod) {
					switch (method) {
						case "get":
							switch (Math.round(status / 100)) {
								case 2:
									switch (status) {
										case 200:
											dispatch({
												...state,
												isPaymentMethod: isPaymentMethod,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: paymentMethodGet200OkSuccessResponse,
														isSuccess: true
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPaymentMethod: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== paymentMethodGet200OkSuccessResponse
														)
													]
												});

												setConfig({
													isPaymentMethod: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 201:
											dispatch({
												...state,
												isPaymentMethod: isPaymentMethod,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: paymentMethodGet201CreatedSuccessResponse,
														isSuccess: true
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPaymentMethod: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== paymentMethodGet201CreatedSuccessResponse
														)
													]
												});

												setConfig({
													isPaymentMethod: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											break;
									}
									break;
								case 4:
									switch (status) {
										case 400:
											dispatch({
												...state,
												isPaymentMethod: isPaymentMethod,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: paymentMethodGet400BadRequestErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPaymentMethod: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== paymentMethodGet400BadRequestErrorResponse
														)
													]
												});

												setConfig({
													isPaymentMethod: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 401:
											dispatch({
												...state,
												isPaymentMethod: isPaymentMethod,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: paymentMethodGet401UnauthorizedErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPaymentMethod: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== paymentMethodGet401UnauthorizedErrorResponse
														)
													]
												});

												setConfig({
													isPaymentMethod: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 403:
											dispatch({
												...state,
												isPaymentMethod: isPaymentMethod,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: paymentMethodGet403ForbiddenErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPaymentMethod: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== paymentMethodGet403ForbiddenErrorResponse
														)
													]
												});

												setConfig({
													isPaymentMethod: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 404:
											dispatch({
												...state,
												isPaymentMethod: isPaymentMethod,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: paymentMethodGet404NotFoundErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPaymentMethod: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== paymentMethodGet404NotFoundErrorResponse
														)
													]
												});

												setConfig({
													isPaymentMethod: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 429:
											dispatch({
												...state,
												isPaymentMethod: isPaymentMethod,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: paymentMethodGet429TooManyRequestsErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPaymentMethod: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== paymentMethodGet429TooManyRequestsErrorResponse
														)
													]
												});

												setConfig({
													isPaymentMethod: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isPaymentMethod: isPaymentMethod,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownClientErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPaymentMethod: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownClientErrorResponse
														)
													]
												});

												setConfig({
													isPaymentMethod: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
								case 5:
									switch (status) {
										case 500:
											dispatch({
												...state,
												isPaymentMethod: isPaymentMethod,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: paymentMethodGet500InternalServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPaymentMethod: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== paymentMethodGet500InternalServerErrorResponse
														)
													]
												});

												setConfig({
													isPaymentMethod: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 502:
											dispatch({
												...state,
												isPaymentMethod: isPaymentMethod,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: paymentMethodGet502BadGatewayErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPaymentMethod: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== paymentMethodGet502BadGatewayErrorResponse
														)
													]
												});

												setConfig({
													isPaymentMethod: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 503:
											dispatch({
												...state,
												isPaymentMethod: isPaymentMethod,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: paymentMethodGet503ServiceUnavailableErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPaymentMethod: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== paymentMethodGet503ServiceUnavailableErrorResponse
														)
													]
												});

												setConfig({
													isPaymentMethod: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 504:
											dispatch({
												...state,
												isPaymentMethod: isPaymentMethod,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: paymentMethodGet504GatewayTimeoutErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPaymentMethod: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== paymentMethodGet504GatewayTimeoutErrorResponse
														)
													]
												});

												setConfig({
													isPaymentMethod: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isPaymentMethod: isPaymentMethod,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPaymentMethod: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownServerErrorResponse
														)
													]
												});

												setConfig({
													isPaymentMethod: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
								default:
									dispatch({
										...state,
										isPaymentMethod: isPaymentMethod,
										method: method,
										status: status,
										responses: [
											...state.responses,
											{
												responseText: fallbackUnknownResponse,
												isSuccess: false
											}
										]
									});

									setTimeout(() => {
										dispatch({
											...state,
											isPaymentMethod: false,
											method: null,
											status: null,
											responses: [
												...state.responses,
												...state.responses.filter(({ responseText }) => responseText !== fallbackUnknownResponse)
											]
										});

										setConfig({
											isPaymentMethod: false,
											method: null,
											status: null
										});
									}, AlertDisplayInterval);
									break;
							}
							break;
						case "post":
							switch (Math.round(status / 100)) {
								case 2:
									switch (status) {
										case 200:
											dispatch({
												...state,
												isPaymentMethod: isPaymentMethod,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: paymentMethodPost200OkSuccessResponse,
														isSuccess: true
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPaymentMethod: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== paymentMethodPost200OkSuccessResponse
														)
													]
												});

												setConfig({
													isPaymentMethod: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 201:
											dispatch({
												...state,
												isPaymentMethod: isPaymentMethod,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: paymentMethodPost201CreatedSuccessResponse,
														isSuccess: true
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPaymentMethod: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== paymentMethodPost201CreatedSuccessResponse
														)
													]
												});

												setConfig({
													isPaymentMethod: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											break;
									}
									break;
								case 4:
									switch (status) {
										case 400:
											dispatch({
												...state,
												isPaymentMethod: isPaymentMethod,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: paymentMethodPost400BadRequestErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPaymentMethod: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== paymentMethodPost400BadRequestErrorResponse
														)
													]
												});

												setConfig({
													isPaymentMethod: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 401:
											dispatch({
												...state,
												isPaymentMethod: isPaymentMethod,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: paymentMethodPost401UnauthorizedErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPaymentMethod: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== paymentMethodPost401UnauthorizedErrorResponse
														)
													]
												});

												setConfig({
													isPaymentMethod: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 403:
											dispatch({
												...state,
												isPaymentMethod: isPaymentMethod,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: paymentMethodPost403ForbiddenErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPaymentMethod: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== paymentMethodPost403ForbiddenErrorResponse
														)
													]
												});

												setConfig({
													isPaymentMethod: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 404:
											dispatch({
												...state,
												isPaymentMethod: isPaymentMethod,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: paymentMethodPost404NotFoundErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPaymentMethod: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== paymentMethodPost404NotFoundErrorResponse
														)
													]
												});

												setConfig({
													isPaymentMethod: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 429:
											dispatch({
												...state,
												isPaymentMethod: isPaymentMethod,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: paymentMethodPost429TooManyRequestsErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPaymentMethod: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== paymentMethodPost429TooManyRequestsErrorResponse
														)
													]
												});

												setConfig({
													isPaymentMethod: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isPaymentMethod: isPaymentMethod,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownClientErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPaymentMethod: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownClientErrorResponse
														)
													]
												});

												setConfig({
													isPaymentMethod: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
								case 5:
									switch (status) {
										case 500:
											dispatch({
												...state,
												isPaymentMethod: isPaymentMethod,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: paymentMethodPost500InternalServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPaymentMethod: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== paymentMethodPost500InternalServerErrorResponse
														)
													]
												});

												setConfig({
													isPaymentMethod: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 502:
											dispatch({
												...state,
												isPaymentMethod: isPaymentMethod,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: paymentMethodPost502BadGatewayErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPaymentMethod: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== paymentMethodPost502BadGatewayErrorResponse
														)
													]
												});

												setConfig({
													isPaymentMethod: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 503:
											dispatch({
												...state,
												isPaymentMethod: isPaymentMethod,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: paymentMethodPost503ServiceUnavailableErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPaymentMethod: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== paymentMethodPost503ServiceUnavailableErrorResponse
														)
													]
												});

												setConfig({
													isPaymentMethod: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										case 504:
											dispatch({
												...state,
												isPaymentMethod: isPaymentMethod,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: paymentMethodPost504GatewayTimeoutErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPaymentMethod: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== paymentMethodPost504GatewayTimeoutErrorResponse
														)
													]
												});

												setConfig({
													isPaymentMethod: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
										default:
											dispatch({
												...state,
												isPaymentMethod: isPaymentMethod,
												method: method,
												status: status,
												responses: [
													...state.responses,
													{
														responseText: fallbackUnknownServerErrorResponse,
														isSuccess: false
													}
												]
											});

											setTimeout(() => {
												dispatch({
													...state,
													isPaymentMethod: false,
													method: null,
													status: null,
													responses: [
														...state.responses,
														...state.responses.filter(
															({ responseText }) => responseText !== fallbackUnknownServerErrorResponse
														)
													]
												});

												setConfig({
													isPaymentMethod: false,
													method: null,
													status: null
												});
											}, AlertDisplayInterval);
											break;
									}
									break;
								default:
									dispatch({
										...state,
										isPaymentMethod: isPaymentMethod,
										method: method,
										status: status,
										responses: [
											...state.responses,
											{
												responseText: fallbackUnknownResponse,
												isSuccess: false
											}
										]
									});

									setTimeout(() => {
										dispatch({
											...state,
											isPaymentMethod: false,
											method: null,
											status: null,
											responses: [
												...state.responses,
												...state.responses.filter(({ responseText }) => responseText !== fallbackUnknownResponse)
											]
										});

										setConfig({
											isPaymentMethod: false,
											method: null,
											status: null
										});
									}, AlertDisplayInterval);
									break;
							}
							break;
						default:
							break;
					}
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

	useEffect(() => {
		handleMessages();
	}, [handleMessages]);

	return { state, setConfig };
}
