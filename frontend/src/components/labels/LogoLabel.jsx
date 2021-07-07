// External
import tw from "twin.macro";
import PropTypes from "prop-types";

// Components
import AppLogo from "src/components/logos/AppLogo";

const LogoLabel = ({ isLogin, isSignUp, isResetPassword, isAddPassword }) => {
	const siteLogoDarkSvg = "/images/logos/site-logo-dark.svg";
	const appLogoAltText = "app-logo";

	return (
		<div tw="sm:mx-auto sm:w-full sm:max-w-md">
			{!isLogin ? (
				<AppLogo tw="h-12 w-auto mx-auto" src={siteLogoDarkSvg} alt={appLogoAltText} width={230} height={40} />
			) : null}
			<h2 tw="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
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

LogoLabel.propTypes = {};

export default LogoLabel;
