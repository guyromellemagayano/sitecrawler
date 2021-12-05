import { Layout } from "@components/layouts";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import dynamic from "next/dynamic";

/**
 * Dynamic imports
 */
const MemoizedLoginPageLayout = dynamic(
	() => import("@components/layouts/pages/Login").then((mod) => mod.MemoizedLoginPageLayout),
	{ ssr: true }
);

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
