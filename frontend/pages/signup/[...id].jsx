import { MemoizedLayout } from "@components/layouts";
import { MemoizedSignupPageLayout } from "@components/layouts/pages/Signup";
import { MemoizedLoader } from "@components/loaders";
import { DashboardSitesLink } from "@constants/PageLinks";
import { SiteCrawlerAppContext } from "@pages/_app";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

export default function Signup() {
	// Translations
	const { t } = useTranslation("signup");
	const completeSignupText = t("completeSignup");

	// Router
	const router = useRouter();

	useEffect(() => {
		router.prefetch(DashboardSitesLink);
	}, []);

	// Custom context
	const { user, validatingUser } = useContext(SiteCrawlerAppContext);

	return !validatingUser && user && Math.round(user?.status / 100) === 4 && user?.data?.detail ? (
		<MemoizedLayout>
			<NextSeo title={completeSignupText} />
			<MemoizedSignupPageLayout />
		</MemoizedLayout>
	) : (
		<MemoizedLoader />
	);
}

Signup.getLayout = (page) => page;
