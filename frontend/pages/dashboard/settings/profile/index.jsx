import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedProfileSettingsPageLayout } from "@components/layouts/pages/ProfileSettings";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import "twin.macro";

export default function ProfileSettings() {
	// Translations
	const { t } = useTranslation("common");
	const profileSettings = t("profileSettings");

	return (
		<>
			<NextSeo title={profileSettings} />
			<MemoizedPageLayout pageTitle={profileSettings}>
				<MemoizedProfileSettingsPageLayout />
			</MemoizedPageLayout>
		</>
	);
}

ProfileSettings.getLayout = function getLayout(page) {
	return <MemoizedLayout>{page}</MemoizedLayout>;
};
