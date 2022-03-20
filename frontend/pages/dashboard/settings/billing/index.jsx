import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedBillingSettingsPageLayout } from "@components/layouts/pages/BillingSettings";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { SWRConfig } from "swr";

const BillingSettingsAuth = () => {
	// Translations
	const { t } = useTranslation("common");
	const billingSettings = t("billingSettings");

	return (
		<MemoizedLayout>
			<NextSeo title={billingSettings} />
			<MemoizedPageLayout pageTitle={billingSettings}>
				<MemoizedBillingSettingsPageLayout />
			</MemoizedPageLayout>
		</MemoizedLayout>
	);
};

export default function BillingSettings() {
	return (
		<SWRConfig>
			<BillingSettingsAuth />
		</SWRConfig>
	);
}

BillingSettings.getLayout = (page) => page;
