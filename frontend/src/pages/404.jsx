// React
import * as React from "react";

// NextJS
import Link from "next/link";

// External
import "twin.macro";
import { NextSeo } from "next-seo";

// Enums
import { Custom404Labels } from "@enums/Custom404Labels";

// Components
import Layout from "@components/layouts";

const Custom404 = () => {
	const pageTitle = Custom404Labels[0].label;

	// TODO: Update UI of 404 page
	return (
		<Layout>
			<NextSeo title={pageTitle} />

			{/* TODO: Update UI of this page */}
			<div tw="absolute inset-0 flex flex-col items-center justify-center w-full min-h-screen bg-gray-50">
				<div tw="flex flex-col items-start justify-center max-w-4xl space-y-4">
					<h1>{Custom404Labels[0].label}</h1>
					<Link href="/sites" passHref>
						<a>{Custom404Labels[1].label}</a>
					</Link>
				</div>
			</div>
		</Layout>
	);
};

export default Custom404;
