import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedProfileSettingsPageLayout } from "@components/layouts/pages/ProfileSettings";
import { MemoizedLoader } from "@components/loaders";
import { SiteCrawlerAppContext } from "@pages/_app";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useContext } from "react";

export default function ProfileSettings() {
	// Translations
	const { t } = useTranslation("common");
	const profileSettingsText = t("profileSettings");

	// Custom context
	const { user, validatingUser } = useContext(SiteCrawlerAppContext);

	return !validatingUser && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
		<MemoizedLayout>
			<NextSeo title={profileSettingsText} />
			<MemoizedPageLayout pageTitle={profileSettingsText}>
				<MemoizedProfileSettingsPageLayout />
			</MemoizedPageLayout>
		</MemoizedLayout>
	) : (
		<MemoizedLoader />
	);
}

ProfileSettings.getLayout = (page) => page;
