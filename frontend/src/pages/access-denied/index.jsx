// React
import React from 'react';

// NextJS
import Link from 'next/link';
import { useRouter } from 'next/router';

// External
import { NextSeo } from 'next-seo';
import PropTypes from 'prop-types';
import tw from 'twin.macro';

// JSON
// Components
import Layout from 'src/components/Layout';

// Icons

const AccessDenied = () => (
	<Layout>
		<h1>Access Denied</h1>
	</Layout>
);

export default AccessDenied;
