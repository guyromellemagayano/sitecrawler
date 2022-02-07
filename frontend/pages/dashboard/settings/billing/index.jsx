import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { BillingSettingsPageLayout } from "@components/layouts/pages/BillingSettings";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import "twin.macro";

export default function BillingSettings() {
	// Translations
	const { t } = useTranslation("common");
	const billingSettings = t("billingSettings");

	return (
		<>
			<NextSeo title={billingSettings} />
			<MemoizedPageLayout pageTitle={billingSettings}>
				<BillingSettingsPageLayout />
			</MemoizedPageLayout>
		</>
	);
}

BillingSettings.getLayout = function getLayout(page) {
	return <MemoizedLayout>{page}</MemoizedLayout>;
};
