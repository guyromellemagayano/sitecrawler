import { Layout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedComingSoonPageLayout } from "@components/layouts/pages/ComingSoon";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";

export default function Sites() {
	// Translations
	const { t } = useTranslation("sites");
	const sitesDashboard = t("sitesDashboard");

	return (
		<>
			<NextSeo title={sitesDashboard} />
			<MemoizedPageLayout pageTitle={sitesDashboard}>
				<MemoizedComingSoonPageLayout />
				{/* <MemoizedSitesDashboardPageLayout /> */}
			</MemoizedPageLayout>
		</>
	);
}

Sites.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};
