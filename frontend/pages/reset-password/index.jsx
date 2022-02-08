import { MemoizedLayout } from "@components/layouts";
import { MemoizedResetPasswordPageLayout } from "@components/layouts/pages/ResetPassword";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";

export default function ResetPassword() {
	// Translations
	const { t } = useTranslation("common");
	const isResetPassword = t("isResetPassword");

	return (
		<MemoizedLayout>
			<NextSeo title={isResetPassword} />
			<MemoizedResetPasswordPageLayout />
		</MemoizedLayout>
	);
}

ResetPassword.getLayout = (page) => page;
