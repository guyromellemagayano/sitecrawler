import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedProfileSettingsPageLayout } from "@components/layouts/pages/ProfileSettings";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";

export default function ProfileSettings() {
	// Translations
	const { t } = useTranslation("common");
	const profileSettings = t("profileSettings");

	return (
		<MemoizedLayout>
			<NextSeo title={profileSettings} />
			<MemoizedPageLayout pageTitle={profileSettings}>
				<MemoizedProfileSettingsPageLayout />
			</MemoizedPageLayout>
		</MemoizedLayout>
	);
}

ProfileSettings.getLayout = (page) => page;
