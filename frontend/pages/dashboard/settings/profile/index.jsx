import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedProfileSettingsPageLayout } from "@components/layouts/pages/ProfileSettings";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { SWRConfig } from "swr";

const ProfileSettingsAuth = () => {
	// Translations
	const { t } = useTranslation("common");
	const profileSettingsText = t("profileSettings");

	return (
		<MemoizedLayout>
			<NextSeo title={profileSettingsText} />
			<MemoizedPageLayout pageTitle={profileSettingsText}>
				<MemoizedProfileSettingsPageLayout />
			</MemoizedPageLayout>
		</MemoizedLayout>
	);
};

export default function ProfileSettings() {
	return (
		<SWRConfig>
			<ProfileSettingsAuth />
		</SWRConfig>
	);
}

ProfileSettings.getLayout = (page) => page;
