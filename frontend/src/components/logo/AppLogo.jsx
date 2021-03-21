// External
import PropTypes from "prop-types";

const AppLogo = ({ className, src, alt }) => {
	return <img css={className} src={src} alt={alt} />;
};

AppLogo.propTypes = {};

export default AppLogo;
