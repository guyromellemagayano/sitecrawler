import PropTypes from "prop-types";
import * as React from "react";
import "twin.macro";

const Layout = ({ children }) => {
	return (
		<div id="root-auth">
			<main tw="h-screen">{children}</main>
		</div>
	);
};

Layout.propTypes = {
	children: PropTypes.any
};

export default Layout;
