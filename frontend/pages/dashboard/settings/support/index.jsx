import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedHelpSupportSettingsPageLayout } from "@components/layouts/pages/HelpSupportSettings";
import { MemoizedLoader } from "@components/loaders";
import { SiteCrawlerAppContext } from "@pages/_app";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useContext } from "react";

export default function HelpSupport() {
	// Translations
	const { t } = useTranslation("common");
	const helpSupportText = t("helpSupport");

	// Custom context
	const { user, validatingUser } = useContext(SiteCrawlerAppContext);

	return !validatingUser && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
		<MemoizedLayout>
			<NextSeo title={helpSupportText} />
			<MemoizedPageLayout pageTitle={helpSupportText}>
				<MemoizedHelpSupportSettingsPageLayout />
			</MemoizedPageLayout>
		</MemoizedLayout>
	) : (
		<MemoizedLoader />
	);
}

HelpSupport.getLayout = (page) => page;
