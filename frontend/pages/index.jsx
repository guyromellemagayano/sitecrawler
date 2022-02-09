import { MemoizedLayout } from "@components/layouts";
import { MemoizedLoginPageLayout } from "@components/layouts/pages/Login";
import { MemoizedLoader } from "@components/loaders";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useContext } from "react";
import "twin.macro";
import { SiteCrawlerAppContext } from "./_app";

export default function Home() {
	// Translations
	const { t } = useTranslation("login");
	const loginText = t("login");

	// Custom context
	const { user, validatingUser } = useContext(SiteCrawlerAppContext);

	return !validatingUser && user && Math.round(user?.status / 100) === 4 && user?.data?.detail ? (
		<MemoizedLayout>
			<NextSeo title={loginText} />
			<MemoizedLoginPageLayout />
		</MemoizedLayout>
	) : (
		<MemoizedLoader />
	);
}

Home.getLayout = (page) => page;
