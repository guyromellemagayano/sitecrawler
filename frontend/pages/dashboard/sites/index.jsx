import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedSitesDashboardPageLayout } from "@components/layouts/pages/SitesDashboard";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";

export default function Sites() {
	// Translations
	const { t } = useTranslation("sites");
	const sitesDashboard = t("sitesDashboard");

	return (
		<MemoizedLayout>
			<NextSeo title={sitesDashboard} />
			<MemoizedPageLayout pageTitle={sitesDashboard}>
				<MemoizedSitesDashboardPageLayout />
			</MemoizedPageLayout>
		</MemoizedLayout>
	);
}

Sites.getLayout = (page) => page;
