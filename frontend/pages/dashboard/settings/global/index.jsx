import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedGlobaSettingsPageLayout } from "@components/layouts/pages/GlobalSettings";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { SWRConfig } from "swr";

const GlobalSettingsAuth = () => {
	// Translations
	const { t } = useTranslation("common");
	const globalSettingsText = t("globalSettings");

	return (
		<MemoizedLayout>
			<NextSeo title={globalSettingsText} />
			<MemoizedPageLayout pageTitle={globalSettingsText}>
				<MemoizedGlobaSettingsPageLayout />
			</MemoizedPageLayout>
		</MemoizedLayout>
	);
};

export default function GlobalSettings() {
	return (
		<SWRConfig>
			<GlobalSettingsAuth />
		</SWRConfig>
	);
}

GlobalSettings.getLayout = (page) => page;
