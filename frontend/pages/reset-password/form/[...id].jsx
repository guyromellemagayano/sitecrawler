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
	const { user, state, setConfig } = useContext(SiteCrawlerAppContext);

	return user && Math.round(user?.status / 100) === 4 && user?.data?.detail ? (
		<MemoizedLayout>
			<NextSeo title={isResetPasswordFormText} />
			<MemoizedResetPasswordFormPageLayout />
		</MemoizedLayout>
	) : !state?.responses?.length ? (
		<MemoizedLoader />
	) : (
		state?.responses?.map((value, key) => {
			// Alert Messsages
			const responseTitle = value?.responseTitle ?? null;
			const responseText = value?.responseText ?? null;
			const isSuccess = value?.isSuccess ?? null;

			return <MemoizedLoader key={key} message={responseTitle + ": " + responseText} />;
		})
	);
}

ResetPasswordForm.getLayout = (page) => page;
