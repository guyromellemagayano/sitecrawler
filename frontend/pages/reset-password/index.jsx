import { MemoizedLayout } from "@components/layouts";
import { MemoizedResetPasswordPageLayout } from "@components/layouts/pages/ResetPassword";
import { MemoizedLoader } from "@components/loaders";
import { SiteCrawlerAppContext } from "@pages/_app";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useContext } from "react";

export default function ResetPassword() {
	// Translations
	const { t } = useTranslation("common");
	const isResetPasswordText = t("isResetPassword");

	// Custom context
	const { user, validatingUser } = useContext(SiteCrawlerAppContext);

	return !validatingUser && user && Math.round(user?.status / 100) === 4 && user?.data?.detail ? (
		<MemoizedLayout>
			<NextSeo title={isResetPasswordText} />
			<MemoizedResetPasswordPageLayout />
		</MemoizedLayout>
	) : (
		<MemoizedLoader />
	);
}

ResetPassword.getLayout = (page) => page;
