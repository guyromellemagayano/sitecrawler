import Layout from "@components/layouts";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import dynamic from "next/dynamic";
import { memo } from "react";

/**
 * Dynamic imports
 */
const ErrorPageLayout = dynamic(() => import("@components/layouts/pages/Error"), { ssr: true });

/**
 * Memoized `Custom404` page.
 */
const Custom404 = memo(() => {
	// Translations
	const { t } = useTranslation("common");
	const Custom404ErrorPageNotFound = t("Custom404ErrorPageNotFound");

	return (
        <>
			<NextSeo title={Custom404ErrorPageNotFound} />
			<ErrorPageLayout statusCode={404} />;
		</>
    );
});

Custom404.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};

export default Custom404;
