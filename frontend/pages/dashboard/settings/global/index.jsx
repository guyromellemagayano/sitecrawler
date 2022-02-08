import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedGlobaSettingsPageLayout } from "@components/layouts/pages/GlobalSettings";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";

export default function GlobalSettings() {
	// Translations
	const { t } = useTranslation("common");
	const globalSettings = t("globalSettings");

	return (
		<MemoizedLayout>
			<NextSeo title={globalSettings} />
			<MemoizedPageLayout pageTitle={globalSettings}>
				<MemoizedGlobaSettingsPageLayout />
			</MemoizedPageLayout>
		</MemoizedLayout>
	);
}

GlobalSettings.getLayout = (page) => page;
