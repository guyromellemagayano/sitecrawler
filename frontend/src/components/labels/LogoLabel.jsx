// External
import tw from "twin.macro";
import PropTypes from "prop-types";

// Components
import AppLogo from "src/components/logos/AppLogo";

const LogoLabel = ({ isLogin, isSignUp, isResetPassword, isAddPassword }) => {
	const siteLogoDarkSvg = "/images/logos/site-logo-dark.svg";

	return (
		<div tw="sm:mx-auto sm:w-full sm:max-w-md">
			{!isLogin && !isSignUp ? (
				<AppLogo className={tw`h-12 w-auto mx-auto`} src={siteLogoDarkSvg} alt="app-logo" />
			) : null}
			<h2 tw="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
				{isLogin
					? "Log In"
					: isSignUp
					? "Sign up"
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
