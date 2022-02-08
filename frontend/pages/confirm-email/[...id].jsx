import { MemoizedLayout } from "@components/layouts";
import { MemoizedConfirmEmailPageLayout } from "@components/layouts/pages/ConfirmEmail";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";

export default function ConfirmEmail() {
	// Translations
	const { t } = useTranslation("confirmEmail");
	const emailConfirmation = t("emailConfirmation");

	return (
		<MemoizedLayout>
			<NextSeo title={emailConfirmation} />
			<MemoizedConfirmEmailPageLayout />
		</MemoizedLayout>
	);
}

ConfirmEmail.getLayout = (page) => page;
