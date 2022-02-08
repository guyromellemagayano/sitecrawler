import { NotificationDisplayInterval } from "@constants/GlobalValues";
import { handleConversionStringToUppercase } from "@utils/convertCase";

export const handleNotificationMessages = ({
	dispatch,
	config,
	setConfig,
	state,
	isUser = false,
	isLocalTimeEnabled = false,
	isLocalTimeDisabled = false,
	isLogin = false,
	isLogout = false,
	isRegistration = false,
	isPasswordChange = false,
	isPasswordReset = false,
	isPasswordResetConfirm = false,
	isVerifyUrlStep = false,
	isSupport = false,
	isPaymentMethod = false,
	data,
	fallback
}) => {
	if (typeof data === "object" && Object.keys(data)?.length > 0) {
		dispatch({
			...state,
			...(isUser && { isUser: isUser }),
			...(isLocalTimeEnabled && { isLocalTimeEnabled: isLocalTimeEnabled }),
			...(isLocalTimeDisabled && { isLocalTimeDisabled: isLocalTimeDisabled }),
			...(isLogin && { isLogin: isLogin }),
			...(isLogout && { isLogout: isLogout }),
			...(isRegistration && { isRegistration: isRegistration }),
			...(isPasswordChange && { isPasswordChange: isPasswordChange }),
			...(isPasswordReset && { isPasswordReset: isPasswordReset }),
			...(isPasswordResetConfirm && { isPasswordResetConfirm: isPasswordResetConfirm }),
			...(isVerifyUrlStep && { isVerifyUrlStep: isVerifyUrlStep }),
			...(isSupport && { isSupport: isSupport }),
			...(isPaymentMethod && { isPaymentMethod: isPaymentMethod }),
			method: handleConversionStringToUppercase(data.method),
			status: data.status,
			responses: [
				...state.responses,
				{
					responseTitle:
						data.title?.length > 0 && data.status
							? data.title
							: Math.round(data.status / 100) === 4
							? fallback.unknownClientErrorResponse.title
							: Math.round(data.status / 100) === 5
							? fallback.unknownServerErrorResponse.title
							: fallback.unknownResponse.title,
					responseText:
						data.message?.length > 0 && data.status
							? data.message
							: Math.round(data.status / 100) === 4
							? fallback.unknownClientErrorResponse.message
							: Math.round(data.status / 100) === 5
							? fallback.unknownServerErrorResponse.message
							: fallback.unknownResponse.message,
					isSuccess: data.isSuccess
				}
			]
		});

		const timeout = setTimeout(() => {
			dispatch({
				...state,
				...(isUser && { isUser: !isUser }),
				...(isLocalTimeEnabled && { isLocalTimeEnabled: !isLocalTimeEnabled }),
				...(isLocalTimeDisabled && { isLocalTimeDisabled: !isLocalTimeDisabled }),
				...(isLogin && { isLogin: !isLogin }),
				...(isLogout && { isLogout: !isLogout }),
				...(isRegistration && { isRegistration: !isRegistration }),
				...(isPasswordChange && { isPasswordChange: !isPasswordChange }),
				...(isPasswordReset && { isPasswordReset: !isPasswordReset }),
				...(isPasswordResetConfirm && { isPasswordResetConfirm: !isPasswordResetConfirm }),
				...(isVerifyUrlStep && { isVerifyUrlStep: !isVerifyUrlStep }),
				...(isSupport && { isSupport: !isSupport }),
				...(isPaymentMethod && { isPaymentMethod: !isPaymentMethod }),
				method: null,
				status: null,
				responses: [
					...state.responses,
					...state.responses.filter(
						({ responseTitle, responseText }) =>
							responseTitle !==
								(data.title?.length && data.status
									? data.title
									: Math.round(data.status / 100) === 4
									? fallback.unknownClientErrorResponse.title
									: Math.round(data.status / 100) === 5
									? fallback.unknownServerErrorResponse.title
									: fallback.unknownResponse.title) &&
							responseText !==
								(data.message?.length && data.status
									? data.message
									: Math.round(data.status / 100) === 4
									? fallback.unknownClientErrorResponse.message
									: Math.round(data.status / 100) === 5
									? fallback.unknownServerErrorResponse.message
									: fallback.unknownResponse.message)
					)
				]
			});

			setConfig({
				...(isUser && { isUser: !isUser }),
				...(isLocalTimeEnabled && { isLocalTimeEnabled: !isLocalTimeEnabled }),
				...(isLocalTimeDisabled && { isLocalTimeDisabled: !isLocalTimeDisabled }),
				...(isLogin && { isLogin: !isLogin }),
				...(isLogout && { isLogout: !isLogout }),
				...(isRegistration && { isRegistration: !isRegistration }),
				...(isPasswordChange && { isPasswordChange: !isPasswordChange }),
				...(isPasswordReset && { isPasswordReset: !isPasswordReset }),
				...(isPasswordResetConfirm && { isPasswordResetConfirm: !isPasswordResetConfirm }),
				...(isVerifyUrlStep && { isVerifyUrlStep: !isVerifyUrlStep }),
				...(isSupport && { isSupport: !isSupport }),
				...(isPaymentMethod && { isPaymentMethod: !isPaymentMethod }),
				method: null,
				status: null
			});
		}, NotificationDisplayInterval);

		return () => {
			clearTimeout(timeout);
		};
	}

	console.log({ state, config });

	return { state, config };
};
