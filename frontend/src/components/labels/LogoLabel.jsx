import AppLogo from "@components/logos/AppLogo";
import { NoAuthAppLogo, SiteLogoDark } from "@configs/GlobalValues";
import useTranslation from "next-translate/useTranslation";
import PropTypes from "prop-types";
import * as React from "react";
import "twin.macro";

const LogoLabel = ({
	isLogin = false,
	isSignUp = false,
	isResetPassword = false,
	isAddPassword = false,
	isAccountExist = false
}) => {
	const { t } = useTranslation("common");
	const appLogo = t("appLogo");
	const isLoginText = t("isLogin");
	const isSignUpText = t("isSignUp");
	const isResetPasswordText = t("isResetPassword");
	const isAddPasswordText = t("isAddPassword");
	const isResetPasswordFormText = t("isResetPasswordForm");
	const isAccountExistText = t("isAccountExist");

	return (
		<div tw="sm:mx-auto sm:w-full sm:max-w-md">
			{!isLogin ? (
				<AppLogo
					className="flex justify-center"
					src={SiteLogoDark}
					alt={appLogo}
					width={NoAuthAppLogo.width}
					height={NoAuthAppLogo.height}
				/>
			) : null}
			<h2 tw="my-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
				{isLogin
					? isLoginText
					: isSignUp
					? isSignUpText
					: isResetPassword
					? isResetPasswordText
					: isAddPassword
					? isAddPasswordText
					: isAccountExist
					? isAccountExistText
					: isResetPasswordFormText}
			</h2>
		</div>
	);
};

LogoLabel.propTypes = {
	isAddPassword: PropTypes.bool,
	isLogin: PropTypes.bool,
	isResetPassword: PropTypes.bool,
	isSignUp: PropTypes.bool
};

export default LogoLabel;
