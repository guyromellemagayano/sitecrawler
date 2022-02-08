import { MemoizedLayout } from "@components/layouts";
import { MemoizedSignupPageLayout } from "@components/layouts/pages/Signup";
import { DashboardSitesLink } from "@constants/PageLinks";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Signup() {
	// Translations
	const { t } = useTranslation("signup");
	const completeSignup = t("completeSignup");

	// Router
	const router = useRouter();

	useEffect(() => {
		router.prefetch(DashboardSitesLink);
	}, []);

	return (
		<MemoizedLayout>
			<NextSeo title={completeSignup} />
			<MemoizedSignupPageLayout />
		</MemoizedLayout>
	);
}

Signup.getLayout = (page) => page;
