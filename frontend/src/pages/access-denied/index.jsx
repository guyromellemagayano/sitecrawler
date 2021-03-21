// React

// NextJS
import Link from 'next/link';
import { useRouter } from 'next/router';

// External
import { NextSeo } from 'next-seo';
import PropTypes from 'prop-types';
import 'twin.macro';

// JSON
import AccessDeniedLabel from 'public/labels/pages/access-denied.json';

// Components
import Layout from 'src/components/Layout';

const AccessDenied = () => {
	const pageTitle = 'Access Denied';

	return (
		<Layout>
			<NextSeo title={pageTitle} />

			<div tw='absolute inset-0 flex flex-col items-center justify-center w-full min-h-screen bg-gray-50'>
				<div tw='flex flex-col items-start justify-center max-w-4xl space-y-4'>
					<h1>{AccessDeniedLabel[0].label}</h1>
				</div>
			</div>
		</Layout>
	);
};

export default AccessDenied;
