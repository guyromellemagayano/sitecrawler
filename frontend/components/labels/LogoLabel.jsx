import { SiteLogoDark } from "@components/svgs/SiteLogo";
import { NoAuthAppLogo } from "@constants/GlobalValues";
import useTranslation from "next-translate/useTranslation";
import PropTypes from "prop-types";
import { memo } from "react";

/**
 * Custom function to render the `LogoLabel` component
 *
 * @param {boolean} isLogin
 * @param {boolean} isSignUp
 * @param {boolean} isResetPassword
 * @param {boolean} isAddPassword
 * @param {boolean} isAccountExist
 * @param {boolean} isConfirmEmail
 */
const LogoLabel = ({
	isLogin = false,
	isSignUp = false,
	isResetPassword = false,
	isAddPassword = false,
	isAccountExist = false,
	isConfirmEmail = false
}) => {
	const { t } = useTranslation("common");
	const appLogo = t("appLogo");
	const isLoginText = t("isLogin");
	const isSignUpText = t("isSignUp");
	const isResetPasswordText = t("isResetPassword");
	const isAddPasswordText = t("isAddPassword");
	const isResetPasswordFormText = t("isResetPasswordForm");
	const isAccountExistText = t("isAccountExist");
	const isConfirmEmailText = t("isConfirmEmail");

	return (
		<div className="flex flex-col items-center justify-center sm:mx-auto sm:w-full sm:max-w-md">
			{!isLogin ? <SiteLogoDark width={NoAuthAppLogo.width} height={NoAuthAppLogo.height} /> : null}
			<h2 className="mt-12 mb-6 text-center text-3xl font-extrabold leading-9 text-gray-900">
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
					: isConfirmEmail
					? isConfirmEmailText
					: isResetPasswordFormText}
			</h2>
		</div>
	);
};

LogoLabel.propTypes = {
	isAccountExist: PropTypes.bool,
	isAddPassword: PropTypes.bool,
	isConfirmEmail: PropTypes.bool,
	isLogin: PropTypes.bool,
	isResetPassword: PropTypes.bool,
	isSignUp: PropTypes.bool
};

/**
 * Memoized custom `LogoLabel` component
 */
export const MemoizedLogoLabel = memo(LogoLabel);
