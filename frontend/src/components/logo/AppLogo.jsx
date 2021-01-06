// React
import React from 'react';

// External
import 'core-js';
import PropTypes from 'prop-types';

const AppLogo = ({ className, src, alt }) => {
	return <img className={className} src={src} alt={alt} />;
};

AppLogo.propTypes = {
	className: PropTypes.string,
	src: PropTypes.string.isRequired,
	alt: PropTypes.string.isRequired
};

export default AppLogo;
