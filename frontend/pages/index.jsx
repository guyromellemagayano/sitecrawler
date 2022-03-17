import { MemoizedLayout } from "@components/layouts";
import { MemoizedLoader } from "@components/loaders";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useContext } from "react";
import { SWRConfig } from "swr";
import { SiteCrawlerAppContext } from "./_app";

const HomeAuth = () => {
	// Translations
	const { t } = useTranslation();
	const homeText = t("common:home");

	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	return (
		<MemoizedLayout>
			<NextSeo title={homeText} />
			{isComponentReady ? null : <MemoizedLoader />}
		</MemoizedLayout>
	);
};

export default function Home() {
	return (
		<SWRConfig>
			<HomeAuth />
		</SWRConfig>
	);
}

Home.getLayout = (page) => page;
