import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Layout from 'components/Layout';

const NotFoundDiv = styled.div``;

const NotFound = () => {
	const { query } = useRouter();

	const pageTitle = '404 Not Found';

	return (
		<Layout>
			<Head>
				<title>{pageTitle}</title>
				<SiteHead />
			</Head>

			<NotFoundDiv></NotFoundDiv>
		</Layout>
	);
};

export default NotFound;

NotFound.propTypes = {};
