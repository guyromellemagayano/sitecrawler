import { Layout } from "@components/layouts";
import { MemoizedConfirmEmailPageLayout } from "@components/layouts/pages/ConfirmEmail";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";

export default function ConfirmEmail() {
	// Translations
	const { t } = useTranslation("confirmEmail");
	const emailConfirmation = t("emailConfirmation");

	return (
		<>
			<NextSeo title={emailConfirmation} />
			<MemoizedConfirmEmailPageLayout />
		</>
	);
}

ConfirmEmail.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};
