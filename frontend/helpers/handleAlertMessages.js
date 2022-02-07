import { AlertDisplayInterval } from "@constants/GlobalValues";
import { handleConversionStringToUppercase } from "@utils/convertCase";

export const handleAlertMessages = ({
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
							? fallback.unknownClientErrordata.title
							: Math.round(data.status / 100) === 5
							? fallback.unknownServerErrordata.title
							: fallback.unknowndata.title,
					responseText:
						data.message?.length > 0 && data.status
							? data.message
							: Math.round(data.status / 100) === 4
							? fallback.unknownClientErrordata.message
							: Math.round(data.status / 100) === 5
							? fallback.unknownServerErrordata.message
							: fallback.unknowndata.message,
					isSuccess:
						data.message?.length > 0 && data.status
							? data.isSuccess
							: Math.round(data.status / 100) === 4
							? fallback.unknownClientErrordata.isSuccess
							: Math.round(data.status / 100) === 5
							? fallback.unknownServerErrordata.isSuccess
							: fallback.unknowndata.isSuccess
				}
			]
		});

		const timeout = setTimeout(() => {
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
				method: null,
				status: null,
				responses: [
					...state.responses,
					...state.responses.filter(
						({ responseText }) =>
							responseText !==
							(data.message?.length && data.status
								? data.message
								: Math.round(data.status / 100) === 4
								? fallback.unknownClientErrordata.message
								: Math.round(data.status / 100) === 5
								? fallback.unknownServerErrordata.message
								: fallback.unknowndata.message)
					)
				]
			});

			setConfig({
				...(isUser && { isUser: false }),
				...(isLocalTimeEnabled && { isLocalTimeEnabled: false }),
				...(isLocalTimeDisabled && { isLocalTimeDisabled: false }),
				...(isLogin && { isLogin: false }),
				...(isLogout && { isLogout: false }),
				...(isRegistration && { isRegistration: false }),
				...(isPasswordChange && { isPasswordChange: false }),
				...(isPasswordReset && { isPasswordReset: false }),
				...(isPasswordResetConfirm && { isPasswordResetConfirm: false }),
				...(isVerifyUrlStep && { isVerifyUrlStep: false }),
				...(isSupport && { isSupport: false }),
				...(isPaymentMethod && { isPaymentMethod: false }),
				method: null,
				status: null
			});
		}, AlertDisplayInterval);

		return () => {
			clearTimeout(timeout);
		};
	}

	return { state, config };
};
