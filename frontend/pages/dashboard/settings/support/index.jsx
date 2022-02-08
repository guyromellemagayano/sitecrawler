import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedHelpSupportSettingsPageLayout } from "@components/layouts/pages/HelpSupportSettings";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";

export default function HelpSupport() {
	// Translations
	const { t } = useTranslation("common");
	const helpSupport = t("helpSupport");

	return (
		<MemoizedLayout>
			<NextSeo title={helpSupport} />
			<MemoizedPageLayout pageTitle={helpSupport}>
				<MemoizedHelpSupportSettingsPageLayout />
			</MemoizedPageLayout>
		</MemoizedLayout>
	);
}

HelpSupport.getLayout = (page) => page;
