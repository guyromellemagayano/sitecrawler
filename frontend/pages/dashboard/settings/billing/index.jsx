import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { BillingSettingsPageLayout } from "@components/layouts/pages/BillingSettings";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";

export default function BillingSettings() {
	// Translations
	const { t } = useTranslation("common");
	const billingSettings = t("billingSettings");

	return (
		<MemoizedLayout>
			<NextSeo title={billingSettings} />
			<MemoizedPageLayout pageTitle={billingSettings}>
				<BillingSettingsPageLayout />
			</MemoizedPageLayout>
		</MemoizedLayout>
	);
}

BillingSettings.getLayout = (page) => page;
