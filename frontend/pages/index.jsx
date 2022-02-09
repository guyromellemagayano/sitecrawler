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
	const { user, state } = useContext(SiteCrawlerAppContext);

	return user && Math.round(user?.status / 100) === 4 && user?.data?.detail ? (
		<MemoizedLayout>
			<NextSeo title={loginText} />
			<MemoizedLoginPageLayout />
		</MemoizedLayout>
	) : !state?.responses?.length ? (
		<MemoizedLoader />
	) : (
		state?.responses?.map((value, key) => {
			// Alert Messsages
			const responseTitle = value?.responseTitle ?? null;
			const responseText = value?.responseText ?? null;
			const isSuccess = value?.isSuccess ?? null;

			return <MemoizedLoader key={key} message={responseTitle + ": " + responseText} />;
		})
	);
}

Home.getLayout = (page) => page;
