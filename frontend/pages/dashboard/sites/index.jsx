import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedComingSoonPageLayout } from "@components/layouts/pages/ComingSoon";
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
				<MemoizedComingSoonPageLayout />
				{/* <MemoizedSitesDashboardPageLayout /> */}
			</MemoizedPageLayout>
		</MemoizedLayout>
	);
}

Sites.getLayout = (page) => page;
