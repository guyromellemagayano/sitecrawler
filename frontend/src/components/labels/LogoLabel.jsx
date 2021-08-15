// React
import * as React from "react";

// External
import "twin.macro";
import PropTypes from "prop-types";

// Components
import AppLogo from "src/components/logos/AppLogo";
import { GlobalLabels, SiteLogoDark } from "@enums/GlobalValues";

const LogoLabel = ({ isLogin, isSignUp, isResetPassword, isAddPassword }) => {
	const appLogoAltText = "app-logo";

	return (
		<div tw="sm:mx-auto sm:w-full sm:max-w-md">
			{!isLogin ? (
				<AppLogo
					className="flex justify-center"
					src={SiteLogoDark}
					alt={GlobalLabels[0].label}
					width={GlobalLabels[0].width}
					height={GlobalLabels[0].height}
				/>
			) : null}
			<h2 tw="my-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
				{isLogin
					? "Log In"
					: isSignUp
					? "Sign Up"
					: isResetPassword
					? "Reset Password"
					: isAddPassword
					? "Add Password"
					: "Reset Password Form"}
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

LogoLabel.defaultProps = {
	isAddPassword: false,
	isLogin: false,
	isResetPassword: false,
	isSignUp: false
};

export default LogoLabel;
