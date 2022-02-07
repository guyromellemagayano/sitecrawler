import { Layout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedHelpSupportSettingsPageLayout } from "@components/layouts/pages/HelpSupportSettings";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import "twin.macro";

export default function HelpSupport() {
	// Translations
	const { t } = useTranslation("common");
	const helpSupport = t("helpSupport");

	return (
		<>
			<NextSeo title={helpSupport} />
			<MemoizedPageLayout pageTitle={helpSupport}>
				<MemoizedHelpSupportSettingsPageLayout />
			</MemoizedPageLayout>
		</>
	);
}

HelpSupport.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};
