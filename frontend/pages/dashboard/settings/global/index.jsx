import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedGlobaSettingsPageLayout } from "@components/layouts/pages/GlobalSettings";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import "twin.macro";

export default function GlobalSettings() {
	// Translations
	const { t } = useTranslation("common");
	const globalSettings = t("globalSettings");

	return (
		<>
			<NextSeo title={globalSettings} />
			<MemoizedPageLayout pageTitle={globalSettings}>
				<MemoizedGlobaSettingsPageLayout />
			</MemoizedPageLayout>
		</>
	);
}

GlobalSettings.getLayout = function getLayout(page) {
	return <MemoizedLayout>{page}</MemoizedLayout>;
};
