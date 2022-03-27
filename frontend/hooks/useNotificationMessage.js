import { ConfirmEmailNotificationMessage } from "@constants/notificationMessage/auth/confirmEmail";
import { LoginNotificationMessage } from "@constants/notificationMessage/auth/login";
import { LogoutNotificationMessage } from "@constants/notificationMessage/auth/logout";
import {
	PasswordChangeNotificationMessage,
	PasswordResetConfirmNotificationMessage,
	PasswordResetNotificationMessage
} from "@constants/notificationMessage/auth/password";
import { RegistrationNotificationMessage } from "@constants/notificationMessage/auth/registration";
import {
	LocalTimeDisabledNotificationMessage,
	LocalTimeEnabledNotificationMessage,
	UserNotificationMessage
} from "@constants/notificationMessage/auth/user";
import { SignupNotificationMessage } from "@constants/notificationMessage/signup";
import {
	ImagesNotificationMessage,
	LinksNotificationMessage,
	PagesNotificationMessage,
	ScanNotificationMessages,
	SitesNotificationMessage,
	StatsNotificationMessage,
	UrlInformationStepNotificationMessage,
	VerifyUrlStepNotificationMessage
} from "@constants/notificationMessage/site";
import {
	StripePaymentMethodDefaultNotificationMessage,
	StripePaymentMethodNotificationMessage,
	StripeSubscriptionsCurrentNotificationMessage,
	StripeSubscriptionsNotificationMessage
} from "@constants/notificationMessage/stripe";
import { SupportNotificationMessage } from "@constants/notificationMessage/support";
import { useEffect, useReducer, useState } from "react";
import { useAlertTranslations } from "./useAlertTranslations";

const messagesReducer = (state, action) => {
	return {
		...state,
		...action
	};
};

/**
 * Custom hook that will handle success and error messages
 */
export const useNotificationMessage = () => {
	const [config, setConfig] = useState({
		isAlert: false,
		isConfirmEmail: false,
		isError: null,
		isImages: false,
		isLinks: false,
		isLocalTimeDisabled: false,
		isLocalTimeEnabled: false,
		isLogin: false,
		isLogout: false,
		isNotification: false,
		isPages: false,
		isPasswordChange: false,
		isPasswordReset: false,
		isPasswordResetConfirm: false,
		isRegistration: false,
		isScan: false,
		isSignup: false,
		isSites: false,
		isStats: false,
		isStripePaymentMethod: false,
		isStripePaymentMethodDefault: false,
		isStripeSubscriptions: false,
		isStripeSubscriptionsCurrent: false,
		isSupport: false,
		isUrlInformationStep: false,
		isUser: false,
		isVerifyUrlStep: false,
		method: null,
		responses: [],
		status: null
	});

	// Custom hooks
	const [state, dispatch] = useReducer(messagesReducer, config);

	// Custom alert/notification translations
	const {
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
		sitesDelete204NoContentSuccessResponse,
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
		verifyUrlStepPostMiscSiteVerificationFailedErrorResponse,
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
	} = useAlertTranslations();

	// Handle alert/notification messasges
	useEffect(() => {
		if (config) {
			const isAlert = config?.isAlert ?? false;
			const isConfirmEmail = config?.isConfirmEmail ?? false;
			const isError = config?.isError ?? null;
			const isImages = config?.isImages ?? false;
			const isLinks = config?.isLinks ?? false;
			const isLocalTimeDisabled = config?.isLocalTimeDisabled ?? false;
			const isLocalTimeEnabled = config?.isLocalTimeEnabled ?? false;
			const isLogin = config?.isLogin ?? false;
			const isLogout = config?.isLogout ?? false;
			const isNotification = config?.isNotification ?? false;
			const isPages = config?.isPages ?? false;
			const isPasswordChange = config?.isPasswordChange ?? false;
			const isPasswordReset = config?.isPasswordReset ?? false;
			const isPasswordResetConfirm = config?.isPasswordResetConfirm ?? false;
			const isRegistration = config?.isRegistration ?? false;
			const isScan = config?.isScan ?? false;
			const isSignup = config?.isSignup ?? false;
			const isSites = config?.isSites ?? false;
			const isStats = config?.isStats ?? false;
			const isStripePaymentMethod = config?.isStripePaymentMethod ?? false;
			const isStripePaymentMethodDefault = config?.isStripePaymentMethodDefault ?? false;
			const isStripeSubscriptions = config?.isStripeSubscriptions ?? false;
			const isStripeSubscriptionsCurrent = config?.isStripeSubscriptionsCurrent ?? false;
			const isSupport = config?.isSupport ?? false;
			const isUrlInformationStep = config?.isUrlInformationStep ?? false;
			const isUser = config?.isUser ?? false;
			const isVerifyUrlStep = config?.isVerifyUrlStep ?? false;
			const method = config?.method ?? null;
			const status = config?.status ?? null;

			if (
				status &&
				method &&
				(isLocalTimeEnabled ||
					isLocalTimeDisabled ||
					isLogin ||
					isLogout ||
					isPasswordChange ||
					isPasswordReset ||
					isPasswordResetConfirm ||
					isConfirmEmail ||
					isUrlInformationStep ||
					isVerifyUrlStep ||
					isPages ||
					isImages ||
					isRegistration ||
					isSignup ||
					isSites ||
					isStats ||
					isLinks ||
					isScan ||
					isStripePaymentMethod ||
					isStripePaymentMethodDefault ||
					isStripeSubscriptions ||
					isStripeSubscriptionsCurrent ||
					isSupport ||
					isUser ||
					isError ||
					isNotification ||
					isAlert)
			) {
				if (isUser) {
					const locales = {
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
						userPut504GatewayTimeoutErrorResponse
					};

					// User
					return UserNotificationMessage({
						locales,
						fallback,
						dispatch,
						config,
						setConfig,
						state,
						isUser,
						isAlert,
						isNotification
					});
				} else if (isLocalTimeEnabled) {
					const locales = {
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
						localTimeEnabled504GatewayTimeoutErrorResponse
					};

					// Local time enabled
					return LocalTimeEnabledNotificationMessage({
						locales,
						fallback,
						dispatch,
						config,
						setConfig,
						state,
						isLocalTimeEnabled,
						isAlert,
						isNotification
					});
				} else if (isLocalTimeDisabled) {
					const locales = {
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
						localTimeDisabled504GatewayTimeoutErrorResponse
					};

					// Local time disabled
					return LocalTimeDisabledNotificationMessage({
						locales,
						fallback,
						dispatch,
						config,
						setConfig,
						state,
						isLocalTimeDisabled,
						isAlert,
						isNotification
					});
				} else if (isLogin) {
					const locales = {
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
						loginPost504GatewayTimeoutErrorResponse
					};

					// Login
					return LoginNotificationMessage({
						locales,
						fallback,
						dispatch,
						config,
						setConfig,
						state,
						isLogin,
						isAlert,
						isNotification
					});
				} else if (isLogout) {
					const locales = {
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
						logoutPost504GatewayTimeoutErrorResponse
					};

					// Logout
					return LogoutNotificationMessage({
						locales,
						fallback,
						dispatch,
						config,
						setConfig,
						state,
						isLogout,
						isAlert,
						isNotification
					});
				} else if (isRegistration) {
					const locales = {
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
						registrationPost504GatewayTimeoutErrorResponse
					};

					// Registration
					return RegistrationNotificationMessage({
						locales,
						fallback,
						dispatch,
						config,
						setConfig,
						state,
						isRegistration,
						isAlert,
						isNotification
					});
				} else if (isPasswordChange) {
					const locales = {
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
						passwordChangePost504GatewayTimeoutErrorResponse
					};

					// Password change
					return PasswordChangeNotificationMessage({
						locales,
						fallback,
						dispatch,
						config,
						setConfig,
						state,
						isPasswordChange,
						isAlert,
						isNotification
					});
				} else if (isPasswordReset) {
					// Password reset
					return PasswordResetNotificationMessage({
						dispatch,
						config,
						setConfig,
						state,
						isPasswordReset,
						isAlert,
						isNotification
					});
				} else if (isPasswordResetConfirm) {
					const locales = {
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
						passwordResetConfirmPost504GatewayTimeoutErrorResponse
					};

					// Password reset confirm
					return PasswordResetConfirmNotificationMessage({
						locales,
						fallback,
						dispatch,
						config,
						setConfig,
						state,
						isPasswordResetConfirm,
						isAlert,
						isNotification
					});
				} else if (isConfirmEmail) {
					const locales = {
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
						confirmEmailPost504GatewayTimeoutErrorResponse
					};

					// Confirm email
					return ConfirmEmailNotificationMessage({
						locales,
						fallback,
						dispatch,
						config,
						setConfig,
						state,
						isConfirmEmail,
						isAlert,
						isNotification
					});
				} else if (isSignup) {
					const locales = {
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
						signupPost504GatewayTimeoutErrorResponse
					};

					// Signup
					return SignupNotificationMessage({
						dispatch,
						config,
						setConfig,
						state,
						isSignup,
						isAlert,
						isNotification
					});
				} else if (isSites) {
					const locales = {
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
						sitesDelete204NoContentSuccessResponse,
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
						sitesPatch504GatewayTimeoutErrorResponse
					};

					// Sites
					return SitesNotificationMessage({
						locales,
						fallback,
						dispatch,
						config,
						setConfig,
						state,
						isSites,
						isAlert,
						isNotification
					});
				} else if (isScan) {
					const locales = {
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
						scanPost504GatewayTimeoutErrorResponse
					};

					// Scan
					return ScanNotificationMessages({
						dispatch,
						config,
						setConfig,
						state,
						isScan,
						isAlert,
						isNotification
					});
				} else if (isStats) {
					const locales = {
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
						statsDelete504GatewayTimeoutErrorResponse
					};

					// Stats
					return StatsNotificationMessage({
						locales,
						fallback,
						dispatch,
						config,
						setConfig,
						state,
						isStats,
						isAlert,
						isNotification
					});
				} else if (isLinks) {
					const locales = {
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
						linksPatch504GatewayTimeoutErrorResponse
					};

					// Links
					return LinksNotificationMessage({
						dispatch,
						config,
						setConfig,
						state,
						isLinks,
						isAlert,
						isNotification
					});
				} else if (isPages) {
					// Pages
					return PagesNotificationMessage({
						dispatch,
						config,
						setConfig,
						state,
						isPages,
						isAlert,
						isNotification
					});
				} else if (isImages) {
					const locales = {
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
						imagesPost504GatewayTimeoutErrorResponse
					};

					// Images
					return ImagesNotificationMessage({
						locales,
						fallback,
						dispatch,
						config,
						setConfig,
						state,
						isImages,
						isAlert,
						isNotification
					});
				} else if (isUrlInformationStep) {
					const locales = {
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
						urlInformationStepPut504GatewayTimeoutErrorResponse
					};

					// Url information step
					return UrlInformationStepNotificationMessage({
						locales,
						fallback,
						dispatch,
						config,
						setConfig,
						state,
						isUrlInformationStep,
						isAlert,
						isNotification
					});
				} else if (isVerifyUrlStep) {
					const locales = {
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
						verifyUrlStepPostMiscSiteVerificationFailedErrorResponse
					};

					// Verify url step
					return VerifyUrlStepNotificationMessage({
						locales,
						fallback,
						dispatch,
						isError,
						config,
						setConfig,
						state,
						isVerifyUrlStep,
						isAlert,
						isNotification
					});
				} else if (isSupport) {
					const locales = {
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
						supportPost504GatewayTimeoutErrorResponse
					};

					// Support
					return SupportNotificationMessage({
						locales,
						fallback,
						dispatch,
						config,
						setConfig,
						state,
						isSupport,
						isAlert,
						isNotification
					});
				} else if (isStripePaymentMethod) {
					const locales = {
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
						stripePaymentMethodPost504GatewayTimeoutErrorResponse
					};

					// Payment method
					return StripePaymentMethodNotificationMessage({
						locales,
						fallback,
						dispatch,
						config,
						setConfig,
						state,
						isStripePaymentMethod,
						isAlert,
						isNotification
					});
				} else if (isStripePaymentMethodDefault) {
					const locales = {
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
						stripePaymentMethodDefaultGet504GatewayTimeoutErrorResponse
					};

					// Payment method default
					return StripePaymentMethodDefaultNotificationMessage({
						locales,
						fallback,
						dispatch,
						config,
						setConfig,
						state,
						isStripePaymentMethodDefault,
						isAlert,
						isNotification
					});
				} else if (isStripeSubscriptions) {
					const locales = {
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
						stripeSubscriptionsGet504GatewayTimeoutErrorResponse
					};

					// Subscriptions
					return StripeSubscriptionsNotificationMessage({
						locales,
						fallback,
						dispatch,
						config,
						setConfig,
						state,
						isStripeSubscriptions,
						isAlert,
						isNotification
					});
				} else if (isStripeSubscriptionsCurrent) {
					const locales = {
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

					// Current subscription
					return StripeSubscriptionsCurrentNotificationMessage({
						locales,
						fallback,
						dispatch,
						config,
						setConfig,
						state,
						isStripeSubscriptionsCurrent,
						isAlert,
						isNotification
					});
				} else {
					return null;
				}
			}
		}
	}, [config]);

	return { state, setConfig };
};
