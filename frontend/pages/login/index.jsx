import { Layout } from "@components/layouts";
import { MemoizedLoginPageLayout } from "@components/layouts/pages/Login";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";

export default function Login() {
	// Translations
	const { t } = useTranslation("login");
	const login = t("login");

	return (
		<>
			<NextSeo title={login} />
			<MemoizedLoginPageLayout />
		</>
	);
}

Login.getLayout = function getLayout(page) {
	return (
		<>
			<Layout>{page}</Layout>
		</>
	);
};

Login.requiresAuth = false;
