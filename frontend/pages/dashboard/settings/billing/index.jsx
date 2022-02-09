import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedBillingSettingsPageLayout } from "@components/layouts/pages/BillingSettings";
import { MemoizedLoader } from "@components/loaders";
import { SiteCrawlerAppContext } from "@pages/_app";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useContext } from "react";

export default function BillingSettings() {
	// Translations
	const { t } = useTranslation("common");
	const billingSettings = t("billingSettings");

	// Custom context
	const { user, validatingUser } = useContext(SiteCrawlerAppContext);

	return !validatingUser && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
		<MemoizedLayout>
			<NextSeo title={billingSettings} />
			<MemoizedPageLayout pageTitle={billingSettings}>
				<MemoizedBillingSettingsPageLayout />
			</MemoizedPageLayout>
		</MemoizedLayout>
	) : (
		<MemoizedLoader />
	);
}

BillingSettings.getLayout = (page) => page;
