import { Layout } from "@components/layouts";
import { MemoizedResetPasswordPageLayout } from "@components/layouts/pages/ResetPassword";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";

export default function ResetPassword() {
	// Translations
	const { t } = useTranslation("common");
	const isResetPassword = t("isResetPassword");

	return (
		<>
			<NextSeo title={isResetPassword} />
			<MemoizedResetPasswordPageLayout />
		</>
	);
}

ResetPassword.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};
