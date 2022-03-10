import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedBillingSettingsPageLayout } from "@components/layouts/pages/BillingSettings";
import { MemoizedLoader } from "@components/loaders";
import { SiteCrawlerAppContext } from "@pages/_app";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useContext } from "react";
import { SWRConfig } from "swr";

const BillingSettingsAuth = () => {
	// Translations
	const { t } = useTranslation("common");
	const billingSettings = t("billingSettings");

	// Custom context
	const { isComponentReady, user } = useContext(SiteCrawlerAppContext);

	return isComponentReady ? (
		<MemoizedLayout>
			<NextSeo title={billingSettings} />
			<MemoizedPageLayout pageTitle={billingSettings}>
				<MemoizedBillingSettingsPageLayout />
			</MemoizedPageLayout>
		</MemoizedLayout>
	) : (
		<MemoizedLoader />
	);
};

export default function BillingSettings({ fallback }) {
	return (
		<SWRConfig>
			<BillingSettingsAuth />
		</SWRConfig>
	);
}

BillingSettings.getLayout = (page) => page;
