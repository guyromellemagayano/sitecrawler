import { Layout } from "@components/layouts";
import { MemoizedRegistrationPageLayout } from "@components/layouts/pages/Registration";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";

export default function Registration() {
	// Translations
	const { t } = useTranslation("registration");
	const registration = t("registration");

	return (
		<>
			<NextSeo title={registration} />
			<MemoizedRegistrationPageLayout />
		</>
	);
}

Registration.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};
