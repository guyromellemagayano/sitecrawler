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
import { useMemo, useReducer, useState } from "react";

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
		isConfirmEmail: false,
		isLocalTimeDisabled: false,
		isLocalTimeEnabled: false,
		isLogin: false,
		isLogout: false,
		isPasswordChange: false,
		isPasswordReset: false,
		isPasswordResetConfirm: false,
		isRegistration: false,
		isSites: false,
		isScan: false,
		isSignup: false,
		isStats: false,
		isLinks: false,
		isPages: false,
		isImages: false,
		isStripePaymentMethod: false,
		isStripePaymentMethodDefault: false,
		isStripeSubscriptions: false,
		isStripeSubscriptionsCurrent: false,
		isSupport: false,
		isUrlInformationStep: false,
		isUser: false,
		isVerifyUrlStep: false,
		isError: false,
		isAlert: false,
		isNotification: false,
		method: null,
		status: null,
		responses: []
	});

	// Custom hooks
	const [state, dispatch] = useReducer(messagesReducer, config);

	useMemo(() => {
		if (config) {
			const isError = config?.isError ?? false;
			const isLinks = config?.isLinks ?? false;
			const isLocalTimeDisabled = config?.isLocalTimeDisabled ?? false;
			const isLocalTimeEnabled = config?.isLocalTimeEnabled ?? false;
			const isLogin = config?.isLogin ?? false;
			const isLogout = config?.isLogout ?? false;
			const isPages = config?.isPages ?? false;
			const isImages = config?.isImages ?? false;
			const isPasswordChange = config?.isPasswordChange ?? false;
			const isPasswordReset = config?.isPasswordReset ?? false;
			const isPasswordResetConfirm = config?.isPasswordResetConfirm ?? false;
			const isConfirmEmail = config?.isConfirmEmail ?? false;
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
				status !== null &&
				method !== null &&
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
					isError)
			) {
				if (isUser) {
					// User
					return UserNotificationMessage({
						dispatch,
						config,
						setConfig,
						state,
						isUser
					});
				} else if (isLocalTimeEnabled) {
					// Local time enabled
					return LocalTimeEnabledNotificationMessage({
						dispatch,
						config,
						setConfig,
						state,
						isLocalTimeEnabled
					});
				} else if (isLocalTimeDisabled) {
					// Local time disabled
					return LocalTimeDisabledNotificationMessage({
						dispatch,
						config,
						setConfig,
						state,
						isLocalTimeDisabled
					});
				} else if (isLogin) {
					// Login
					return LoginNotificationMessage({
						dispatch,
						config,
						setConfig,
						state,
						isLogin
					});
				} else if (isLogout) {
					// Logout
					return LogoutNotificationMessage({
						dispatch,
						config,
						setConfig,
						state,
						isLogout
					});
				} else if (isRegistration) {
					// Registration
					return RegistrationNotificationMessage({
						dispatch,
						config,
						setConfig,
						state,
						isRegistration
					});
				} else if (isPasswordChange) {
					// Password change
					return PasswordChangeNotificationMessage({
						dispatch,
						config,
						setConfig,
						state,
						isPasswordChange
					});
				} else if (isPasswordReset) {
					// Password reset
					return PasswordResetNotificationMessage({
						dispatch,
						config,
						setConfig,
						state,
						isPasswordReset
					});
				} else if (isPasswordResetConfirm) {
					// Password reset confirm
					return PasswordResetConfirmNotificationMessage({
						dispatch,
						config,
						setConfig,
						state,
						isPasswordResetConfirm
					});
				} else if (isConfirmEmail) {
					// Confirm email
					return ConfirmEmailNotificationMessage({
						dispatch,
						config,
						setConfig,
						state,
						isConfirmEmail
					});
				} else if (isSignup) {
					// Signup
					return SignupNotificationMessage({
						dispatch,
						config,
						setConfig,
						state,
						isSignup
					});
				} else if (isSites) {
					// Sites
					return SitesNotificationMessage({
						dispatch,
						config,
						setConfig,
						state,
						isSites
					});
				} else if (isScan) {
					// Scan
					return ScanNotificationMessages({
						dispatch,
						config,
						setConfig,
						state,
						isScan
					});
				} else if (isStats) {
					// Stats
					return StatsNotificationMessage({
						dispatch,
						config,
						setConfig,
						state,
						isStats
					});
				} else if (isLinks) {
					// Links
					return LinksNotificationMessage({
						dispatch,
						config,
						setConfig,
						state,
						isLinks
					});
				} else if (isPages) {
					// Pages
					return PagesNotificationMessage({
						dispatch,
						config,
						setConfig,
						state,
						isPages
					});
				} else if (isImages) {
					// Images
					return ImagesNotificationMessage({
						dispatch,
						config,
						setConfig,
						state,
						isImages
					});
				} else if (isUrlInformationStep) {
					// Url information step
					return UrlInformationStepNotificationMessage({
						dispatch,
						config,
						setConfig,
						state,
						isUrlInformationStep
					});
				} else if (isVerifyUrlStep) {
					// Verify url step
					return VerifyUrlStepNotificationMessage({
						dispatch,
						isError,
						config,
						setConfig,
						state,
						isVerifyUrlStep
					});
				} else if (isSupport) {
					// Support
					return SupportNotificationMessage({
						dispatch,
						config,
						setConfig,
						state,
						isSupport
					});
				} else if (isStripePaymentMethod) {
					// Payment method
					return StripePaymentMethodNotificationMessage({
						dispatch,
						config,
						setConfig,
						state,
						isStripePaymentMethod
					});
				} else if (isStripePaymentMethodDefault) {
					// Payment method default
					return StripePaymentMethodDefaultNotificationMessage({
						dispatch,
						config,
						setConfig,
						state,
						isStripePaymentMethodDefault
					});
				} else if (isStripeSubscriptions) {
					// Subscriptions
					return StripeSubscriptionsNotificationMessage({
						dispatch,
						config,
						setConfig,
						state,
						isStripeSubscriptions
					});
				} else if (isStripeSubscriptionsCurrent) {
					// Subscriptions
					return StripeSubscriptionsCurrentNotificationMessage({
						dispatch,
						config,
						setConfig,
						state,
						isStripeSubscriptionsCurrent
					});
				} else {
					return null;
				}
			}
		}

		return { state, config };
	}, [config]);

	return { state, setConfig };
};
