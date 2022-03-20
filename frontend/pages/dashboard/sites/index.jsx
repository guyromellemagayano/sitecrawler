import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedSitesDashboardPageLayout } from "@components/layouts/pages/SitesDashboard";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { SWRConfig } from "swr";

const SitesAuth = () => {
	// Translations
	const { t } = useTranslation("sites");
	const sitesDashboardText = t("sitesDashboard");

	return (
		<MemoizedLayout>
			<NextSeo title={sitesDashboardText} />
			<MemoizedPageLayout pageTitle={sitesDashboardText}>
				<MemoizedSitesDashboardPageLayout />
			</MemoizedPageLayout>
		</MemoizedLayout>
	);
};

export default function Sites() {
	return (
		<SWRConfig>
			<SitesAuth />
		</SWRConfig>
	);
}

Sites.getLayout = (page) => page;
