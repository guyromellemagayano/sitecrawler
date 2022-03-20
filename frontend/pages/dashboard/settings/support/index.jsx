import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedHelpSupportSettingsPageLayout } from "@components/layouts/pages/HelpSupportSettings";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { SWRConfig } from "swr";

const HelpSupportAuth = () => {
	// Translations
	const { t } = useTranslation("common");
	const helpSupportText = t("helpSupport");

	return (
		<MemoizedLayout>
			<NextSeo title={helpSupportText} />
			<MemoizedPageLayout pageTitle={helpSupportText}>
				<MemoizedHelpSupportSettingsPageLayout />
			</MemoizedPageLayout>
		</MemoizedLayout>
	);
};

export default function HelpSupport() {
	return (
		<SWRConfig>
			<HelpSupportAuth />
		</SWRConfig>
	);
}

HelpSupport.getLayout = (page) => page;
