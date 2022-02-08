import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedSitesDashboardPageLayout } from "@components/layouts/pages/SitesDashboard";
import { MemoizedLoader } from "@components/loaders";
import { SiteCrawlerAppContext } from "@pages/_app";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useContext } from "react";

export default function Sites() {
	// Translations
	const { t } = useTranslation("sites");
	const sitesDashboard = t("sitesDashboard");

	// Custom context
	const { user, state, setConfig } = useContext(SiteCrawlerAppContext);

	return user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
		<MemoizedLayout>
			<NextSeo title={sitesDashboard} />
			<MemoizedPageLayout pageTitle={sitesDashboard}>
				<MemoizedSitesDashboardPageLayout />
			</MemoizedPageLayout>
		</MemoizedLayout>
	) : !state?.responses?.length ? (
		<MemoizedLoader />
	) : (
		state?.responses?.map((value, key) => {
			// Alert Messsages
			const responseTitle = value?.responseTitle ?? null;
			const responseText = value?.responseText ?? null;
			const isSuccess = value?.isSuccess ?? null;

			return <MemoizedLoader key={key} message={responseTitle + ": " + responseText} />;
		})
	);
}

Sites.getLayout = (page) => page;
