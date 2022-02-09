import { MemoizedLayout } from "@components/layouts";
import { MemoizedResetPasswordFormPageLayout } from "@components/layouts/pages/ResetPasswordForm";
import { MemoizedLoader } from "@components/loaders";
import { SiteCrawlerAppContext } from "@pages/_app";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useContext } from "react";

export default function ResetPasswordForm() {
	// Translations
	const { t } = useTranslation("common");
	const isResetPasswordFormText = t("isResetPasswordForm");

	// Custom context
	const { user, validatingUser } = useContext(SiteCrawlerAppContext);

	return !validatingUser && user && Math.round(user?.status / 100) === 4 && user?.data?.detail ? (
		<MemoizedLayout>
			<NextSeo title={isResetPasswordFormText} />
			<MemoizedResetPasswordFormPageLayout />
		</MemoizedLayout>
	) : (
		<MemoizedLoader />
	);
}

ResetPasswordForm.getLayout = (page) => page;
