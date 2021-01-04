// React
import React from 'react';

// NextJS
import Head from 'next/head';

// External
import PropTypes from 'prop-types';

const Layout = (props) => {
	const { children, title = 'Welcome | Site Crawler' } = props;

	return (
		<div id="root">
			<Head>
				<SiteHead title={title} />
			</Head>
			{children}
		</div>
	);
};

Layout.propTypes = {
	children: PropTypes.element,
	title: PropTypes.string
};

export default Layout;
