// React
import React from 'react';

// External
import 'core-js';
import PropTypes from 'prop-types';

const Layout = ({ children }) => {
	return <div id="root">{children}</div>;
};

Layout.propTypes = {
	children: PropTypes.array.isRequired
};

export default Layout;
