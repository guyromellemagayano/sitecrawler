import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedSiteLinksPageLayout } from "@components/layouts/pages/SiteLinks";
import { SiteCrawlerAppContext } from "@pages/_app";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useContext } from "react";
import { SWRConfig } from "swr";

const SiteLinksAuth = () => {
	// Translations
	const { t } = useTranslation("sites");
	const sitesLinksText = t("sitesLinks");

	// Custom context
	const { isComponentReady, siteId } = useContext(SiteCrawlerAppContext);

	// Custom variables
	const siteName = siteId?.data?.name ?? null;
	const sitesLinksPageTitle = siteName ? sitesLinksText + " - " + siteName : "";

	return (
		<MemoizedLayout>
			<NextSeo title={sitesLinksPageTitle} />
			<MemoizedPageLayout pageTitle={sitesLinksText}>
				<MemoizedSiteLinksPageLayout />
			</MemoizedPageLayout>
		</MemoizedLayout>
	);
};

export default function SiteLinks() {
	return (
		<SWRConfig>
			<SiteLinksAuth />
		</SWRConfig>
	);
}

SiteLinks.getLayout = (page) => page;
