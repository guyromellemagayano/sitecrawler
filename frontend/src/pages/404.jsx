import Layout from "@components/layouts";
import useTranslation from "next-translate/useTranslation";
import dynamic from "next/dynamic";
import * as React from "react";

/**
 * Dynamic imports
 */
const ComingSoon = dynamic(() => import("@components/layouts/pages/ComingSoon"), { ssr: true });

/**
 * Memoized `Custom404` page.
 */
const Custom404 = React.memo(() => {
	// Translations
	const { t } = useTranslation("common");
	const Custom404ErrorPageNotFound = t("404ErrorPageNotFound");

	return (
		<React.Fragment>
			<NextSeo title={Custom404ErrorPageNotFound} />
			<ComingSoon pageTitle={Custom404ErrorPageNotFound} />
		</React.Fragment>
	);
});

Custom404.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};

export default Custom404;
