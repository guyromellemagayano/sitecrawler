import Layout from "@components/layouts";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import * as React from "react";
import "twin.macro";

export const PageNotFoundMessage = () => {
	const { t } = useTranslation("error");
	const pageNotFound = t("pageNotFound");
	const urlCheck = t("urlCheck");
	const goBackHome = t("goBackHome");
	const contactSupport = t("contactSupport");

	return (
		<Layout>
			<NextSeo title={pageNotFound} />

			<div tw="bg-white min-h-screen px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
				<div tw="max-w-max mx-auto">
					<main tw="sm:flex">
						<p tw="text-4xl font-extrabold text-indigo-600 sm:text-5xl">404</p>
						<div tw="sm:ml-6">
							<div tw="sm:border-l sm:border-gray-200 sm:pl-6">
								<h1 tw="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">{pageNotFound}</h1>
								<p tw="mt-1 text-base text-gray-500">{urlCheck}</p>
							</div>
							<div tw="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
								<Link href="/" passHref={true}>
									<a tw="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
										{goBackHome}
									</a>
								</Link>
								<Link href="/support" passHref={true}>
									<a tw="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
										{contactSupport}
									</a>
								</Link>
							</div>
						</div>
					</main>
				</div>
			</div>
		</Layout>
	);
};
