// React
import React from 'react';

// External

import PropTypes from 'prop-types';

const AppLogo = ({ className, src, alt }) => {
	return <img className={className} src={src} alt={alt} />;
};

AppLogo.propTypes = {
	className: PropTypes.string,
	src: PropTypes.string,
	alt: PropTypes.string
};

export default AppLogo;
