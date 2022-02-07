import { MemoizedLayout } from "@components/layouts";
import { MemoizedResetPasswordFormPageLayout } from "@components/layouts/pages/ResetPasswordForm";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";

export default function ResetPasswordForm() {
	// Translations
	const { t } = useTranslation("common");
	const isResetPasswordForm = t("isResetPasswordForm");

	return (
		<>
			<NextSeo title={isResetPasswordForm} />
			<MemoizedResetPasswordFormPageLayout />
		</>
	);
}

ResetPasswordForm.getLayout = function getLayout(page) {
	return <MemoizedLayout>{page}</MemoizedLayout>;
};
