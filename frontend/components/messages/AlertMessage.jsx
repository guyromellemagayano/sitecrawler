/* eslint-disable react-hooks/exhaustive-deps */
import { MemoizedAlert } from "@components/alerts";
import useTranslation from "next-translate/useTranslation";
import { memo, useCallback, useEffect, useReducer } from "react";

const messagesReducer = (state, action) => {
	console.log(state, action);

	return {
		...state,
		responses: action.responses
	};
};

/**
 * Custom hook that will handle success and error messages
 */
export function AlertMessage(...props) {
	const {
		isLogin,
		isLogout,
		isMembershipType,
		isPasswordChange,
		isPasswordReset,
		isPasswordResetConfirm,
		isRegistrationVerifyEmail,
		isRegistration,
		isSignup,
		isSite,
		isStripeConfig,
		isStripePaymentMethod,
		isStripePaymentMethodDefault,
		isStripeSubscription,
		isStripeSubscriptionCurrent,
		isStripeSubscriptionDefault,
		isSupport,
		isTeam,
		isTeamAcceptInvitation,
		isTeamCurrent,
		isTeamMembershipCurrent,
		isUser,
		method,
		status,
		responses
	} = props;

	console.log(props);

	const [state, dispatch] = useReducer(messagesReducer, {
		isLogin,
		isLogout,
		isMembershipType,
		isPasswordChange,
		isPasswordReset,
		isPasswordResetConfirm,
		isRegistrationVerifyEmail,
		isRegistration,
		isSignup,
		isSite,
		isStripeConfig,
		isStripePaymentMethod,
		isStripePaymentMethodDefault,
		isStripeSubscription,
		isStripeSubscriptionCurrent,
		isStripeSubscriptionDefault,
		isSupport,
		isTeam,
		isTeamAcceptInvitation,
		isTeamCurrent,
		isTeamMembershipCurrent,
		isUser,
		method,
		status,
		responses
	});

	// Translations
	const { t } = useTranslation();

	// Login translations
	const loginDelete200OkSuccessResponse = t("alerts:auth.login.delete.200OkSuccessResponse");
	const loginDelete201CreatedSuccessResponse = t("alerts:auth.login.delete.201CreatedSuccessResponse");
	const loginDelete400BadRequestErrorResponse = t("alerts:auth.login.delete.400BadRequestErrorResponse");
	const loginDelete401UnauthorizedErrorResponse = t("alerts:auth.login.delete.401UnauthorizedErrorResponse");
	const loginDelete403ForbiddenErrorResponse = t("alerts:auth.login.delete.403ForbiddenErrorResponse");
	const loginDelete404NotFoundErrorResponse = t("alerts:auth.login.delete.404NotFoundErrorResponse");
	const loginDelete429TooManyRequestsErrorResponse = t("alerts:auth.login.delete.201CreatedSuccessResponse");
	const loginDelete500InternalServerErrorResponse = t("alerts:auth.login.delete.500InternalServerErrorResponse");
	const loginDelete502BadGatewayErrorResponse = t("alerts:auth.login.delete.502BadGatewayErrorResponse");
	const loginDelete503ServiceUnavailableErrorResponse = t(
		"alerts:auth.login.delete.503ServiceUnavailableErrorResponse"
	);
	const loginDelete504GatewayTimeoutErrorResponse = t("alerts:auth.login.delete.504GatewayTimeoutErrorResponse");
	const loginGet200OkSuccessResponse = t("alerts:auth.login.get.200OkSuccessResponse");
	const loginGet201CreatedSuccessResponse = t("alerts:auth.login.get.201CreatedSuccessResponse");
	const loginGet400BadRequestErrorResponse = t("alerts:auth.login.get.400BadRequestErrorResponse");
	const loginGet401UnauthorizedErrorResponse = t("alerts:auth.login.get.401UnauthorizedErrorResponse");
	const loginGet403ForbiddenErrorResponse = t("alerts:auth.login.get.403ForbiddenErrorResponse");
	const loginGet404NotFoundErrorResponse = t("alerts:auth.login.get.404NotFoundErrorResponse");
	const loginGet429TooManyRequestsErrorResponse = t("alerts:auth.login.get.201CreatedSuccessResponse");
	const loginGet500InternalServerErrorResponse = t("alerts:auth.login.get.500InternalServerErrorResponse");
	const loginGet502BadGatewayErrorResponse = t("alerts:auth.login.get.502BadGatewayErrorResponse");
	const loginGet503ServiceUnavailableErrorResponse = t("alerts:auth.login.get.503ServiceUnavailableErrorResponse");
	const loginGet504GatewayTimeoutErrorResponse = t("alerts:auth.login.patch.504GatewayTimeoutErrorResponse");
	const loginPatch200OkSuccessResponse = t("alerts:auth.login.patch.200OkSuccessResponse");
	const loginPatch201CreatedSuccessResponse = t("alerts:auth.login.patch.201CreatedSuccessResponse");
	const loginPatch400BadRequestErrorResponse = t("alerts:auth.login.patch.400BadRequestErrorResponse");
	const loginPatch401UnauthorizedErrorResponse = t("alerts:auth.login.patch.401UnauthorizedErrorResponse");
	const loginPatch403ForbiddenErrorResponse = t("alerts:auth.login.patch.403ForbiddenErrorResponse");
	const loginPatch404NotFoundErrorResponse = t("alerts:auth.login.patch.404NotFoundErrorResponse");
	const loginPatch429TooManyRequestsErrorResponse = t("alerts:auth.login.patch.201CreatedSuccessResponse");
	const loginPatch500InternalServerErrorResponse = t("alerts:auth.login.patch.500InternalServerErrorResponse");
	const loginPatch502BadGatewayErrorResponse = t("alerts:auth.login.patch.502BadGatewayErrorResponse");
	const loginPatch503ServiceUnavailableErrorResponse = t("alerts:auth.login.patch.503ServiceUnavailableErrorResponse");
	const loginPatch504GatewayTimeoutErrorResponse = t("alerts:auth.login.patch.504GatewayTimeoutErrorResponse");
	const loginPost200OkSuccessResponse = t("alerts:auth.login.post.200OkSuccessResponse");
	const loginPost201CreatedSuccessResponse = t("alerts:auth.login.post.201CreatedSuccessResponse");
	const loginPost400BadRequestErrorResponse = t("alerts:auth.login.post.400BadRequestErrorResponse");
	const loginPost401UnauthorizedErrorResponse = t("alerts:auth.login.post.401UnauthorizedErrorResponse");
	const loginPost403ForbiddenErrorResponse = t("alerts:auth.login.post.403ForbiddenErrorResponse");
	const loginPost404NotFoundErrorResponse = t("alerts:auth.login.post.404NotFoundErrorResponse");
	const loginPost429TooManyRequestsErrorResponse = t("alerts:auth.login.post.201CreatedSuccessResponse");
	const loginPost500InternalServerErrorResponse = t("alerts:auth.login.post.500InternalServerErrorResponse");
	const loginPost502BadGatewayErrorResponse = t("alerts:auth.login.post.502BadGatewayErrorResponse");
	const loginPost503ServiceUnavailableErrorResponse = t("alerts:auth.login.post.503ServiceUnavailableErrorResponse");
	const loginPost504GatewayTimeoutErrorResponse = t("alerts:auth.login.post.504GatewayTimeoutErrorResponse");
	const loginPut200OkSuccessResponse = t("alerts:auth.login.put.200OkSuccessResponse");
	const loginPut201CreatedSuccessResponse = t("alerts:auth.login.put.201CreatedSuccessResponse");
	const loginPut400BadRequestErrorResponse = t("alerts:auth.login.put.400BadRequestErrorResponse");
	const loginPut401UnauthorizedErrorResponse = t("alerts:auth.login.put.401UnauthorizedErrorResponse");
	const loginPut403ForbiddenErrorResponse = t("alerts:auth.login.put.403ForbiddenErrorResponse");
	const loginPut404NotFoundErrorResponse = t("alerts:auth.login.put.404NotFoundErrorResponse");
	const loginPut429TooManyRequestsErrorResponse = t("alerts:auth.login.put.201CreatedSuccessResponse");
	const loginPut500InternalServerErrorResponse = t("alerts:auth.login.put.500InternalServerErrorResponse");
	const loginPut502BadGatewayErrorResponse = t("alerts:auth.login.put.502BadGatewayErrorResponse");
	const loginPut503ServiceUnavailableErrorResponse = t("alerts:auth.login.put.503ServiceUnavailableErrorResponse");
	const loginPut504GatewayTimeoutErrorResponse = t("alerts:auth.login.put.504GatewayTimeoutErrorResponse");

	// Fallback translations
	const fallbackUnknownResponse = t("alerts:fallback.unknownResponse");
	const fallbackUnknownClientErrorResponse = t("alerts:fallback.unknownClientErrorResponse");
	const fallbackUnknownServerErrorResponse = t("alerts:fallback.unknownServerErrorResponse");

	// Handle SWR hook errors
	const handleResponseMessages = useCallback(async () => {
		const status = parseInt(state?.status) ?? null;
		const method = state?.method?.toString().toLowerCase() ?? null;
		const isLogin = state?.isLogin ?? false;
		const isLogout = state?.isLogout ?? false;
		const isMembershipType = state?.isMembershipType ?? false;
		const isPasswordChange = state?.isPasswordChange ?? false;
		const isPasswordReset = state?.isPasswordReset ?? false;
		const isPasswordResetConfirm = state?.isPasswordResetConfirm ?? false;
		const isRegistrationVerifyEmail = state?.isRegistrationVerifyEmail ?? false;
		const isRegistration = state?.isRegistration ?? false;
		const isSignup = state?.isSignup ?? false;
		const isSite = state?.isSite ?? false;
		const isStripeConfig = state?.isStripeConfig ?? false;
		const isStripePaymentMethod = state?.isStripePaymentMethod ?? false;
		const isStripePaymentMethodDefault = state?.isStripePaymentMethodDefault ?? false;
		const isStripeSubscription = state?.isStripeSubscription ?? false;
		const isStripeSubscriptionCurrent = state?.isStripeSubscriptionCurrent ?? false;
		const isStripeSubscriptionDefault = state?.isStripeSubscriptionDefault ?? false;
		const isSupport = state?.isSupport ?? false;
		const isTeam = state?.isTeam ?? false;
		const isTeamAcceptInvitation = state?.isTeamAcceptInvitation ?? false;
		const isTeamCurrent = state?.isTeamCurrent ?? false;
		const isTeamMembershipCurrent = state?.isTeamMembershipCurrent ?? false;
		const isUser = state?.isUser ?? false;

		if (
			status !== null &&
			method !== null &&
			(isLogin ||
				isLogout ||
				isMembershipType ||
				isPasswordChange ||
				isPasswordReset ||
				isPasswordResetConfirm ||
				isRegistrationVerifyEmail ||
				isRegistration ||
				isSignup ||
				isSite ||
				isStripeConfig ||
				isStripePaymentMethod ||
				isStripePaymentMethodDefault ||
				isStripeSubscription ||
				isStripeSubscriptionCurrent ||
				isStripeSubscriptionDefault ||
				isSupport ||
				isTeam ||
				isTeamAcceptInvitation ||
				isTeamCurrent ||
				isTeamMembershipCurrent ||
				isUser)
		) {
			if (status !== null && method !== null) {
				if (isLogin) {
					if (method === "post") {
						if (Math.round(status / 200) === 1) {
							if (status === 200) {
								dispatch({
									...state,
									responses: [
										...state.responses,
										{
											responseText: loginPost200OkSuccessResponse,
											isSuccess: true
										}
									]
								});
							} else if (status === 201) {
								dispatch({
									...state,
									responses: [
										...state.responses,
										{
											responseText: loginGet201CreatedSuccessResponse,
											isSuccess: true
										}
									]
								});
							}
						} else if (Math.round(status / 400) === 1) {
							if (status === 400) {
								dispatch({
									responses: [
										...state.responses,
										{
											responseText: loginPost400BadRequestErrorResponse,
											isSuccess: false
										}
									]
								});
							} else if (status === 401) {
								dispatch({
									...state,
									responses: [
										...state.responses,
										{
											responseText: loginPost401UnauthorizedErrorResponse,
											isSuccess: false
										}
									]
								});
							} else if (status === 403) {
								dispatch({
									...state,
									responses: [
										...state.responses,
										{
											responseText: loginPost403ForbiddenErrorResponse,
											isSuccess: false
										}
									]
								});
							} else if (status === 404) {
								dispatch({
									...state,
									responses: [
										...state.responses,
										{
											responseText: loginPost404NotFoundErrorResponse,
											isSuccess: false
										}
									]
								});
							} else if (status === 429) {
								dispatch({
									...state,
									responses: [
										...state.responses,
										{
											responseText: loginPost429TooManyRequestsErrorResponse,
											isSuccess: false
										}
									]
								});
							} else {
								dispatch({
									...state,
									responses: [
										...state.responses,
										{
											responseText: fallbackUnknownClientErrorResponse,
											isSuccess: false
										}
									]
								});
							}
						} else if (Math.round(status / 500) === 1) {
							if (status === 500) {
								dispatch({
									...state,
									responses: [
										...state.responses,
										{
											responseText: loginPost500InternalServerErrorResponse,
											isSuccess: false
										}
									]
								});
							} else if (status === 502) {
								dispatch({
									...state,
									responses: [
										...state.responses,
										{
											responseText: loginPost502BadGatewayErrorResponse,
											isSuccess: false
										}
									]
								});
							} else if (status === 503) {
								dispatch({
									...state,
									responses: [
										...state.responses,
										{
											responseText: loginPost503ServiceUnavailableErrorResponse,
											isSuccess: false
										}
									]
								});
							} else if (status === 504) {
								dispatch({
									...state,
									responses: [
										...state.responses,
										{
											responseText: loginPost504GatewayTimeoutErrorResponse,
											isSuccess: false
										}
									]
								});
							} else {
								dispatch({
									...state,
									responses: [
										...state.responses,
										{
											responseText: fallbackUnknownServerErrorResponse,
											isSuccess: false
										}
									]
								});
							}
						} else {
							dispatch({
								...state,
								responses: [
									...state.responses,
									{
										responseText: fallbackUnknownResponse,
										isSuccess: false
									}
								]
							});
						}
					}
				}
			}
		}
	}, [state]);

	useEffect(() => {
		handleResponseMessages();
	}, [handleResponseMessages]);

	return state?.responses !== [] && state?.responses?.length > 0 && Object.keys(state?.responses)?.length > 0 ? (
		<div tw="fixed right-6 bottom-6 grid grid-flow-row gap-4">
			{state?.responses?.map((value, key) => (
				<MemoizedAlert key={key} message={value} isError />
			))}
		</div>
	) : null;
}

export const MemoizedAlertMessage = memo(AlertMessage);
