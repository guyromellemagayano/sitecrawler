// React
import React from 'react';

// External

import PropTypes from 'prop-types';

const Layout = ({ children }) => {
	return <div id="root">{children}</div>;
};

Layout.propTypes = {
	children: PropTypes.array
};

export default Layout;
