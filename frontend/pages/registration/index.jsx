import { MemoizedLayout } from "@components/layouts";
import { MemoizedRegistrationPageLayout } from "@components/layouts/pages/Registration";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";

export default function Registration() {
	// Translations
	const { t } = useTranslation("registration");
	const registration = t("registration");

	return (
		<MemoizedLayout>
			<NextSeo title={registration} />
			<MemoizedRegistrationPageLayout />
		</MemoizedLayout>
	);
}

Registration.getLayout = (page) => page;
