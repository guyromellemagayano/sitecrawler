import { MemoizedLayout } from "@components/layouts";
import { MemoizedLoginPageLayout } from "@components/layouts/pages/Login";
import { MemoizedLoader } from "@components/loaders";
import { SiteCrawlerAppContext } from "@pages/_app";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useContext } from "react";
import { SWRConfig } from "swr";

const LoginAuth = () => {
	// Translations
	const { t } = useTranslation();
	const loginText = t("login:login");

	// SWR hooks
	const { isComponentReady, user } = useContext(SiteCrawlerAppContext);

	// Custom variables
	const isUserNotLoaded =
		user && Object.keys(user)?.length > 0 && Math.round(user?.status / 100) === 4 && user?.data?.detail;

	return (
		<MemoizedLayout>
			<NextSeo title={loginText} />
			{isComponentReady && isUserNotLoaded ? <MemoizedLoginPageLayout /> : <MemoizedLoader />}
		</MemoizedLayout>
	);
};

export default function Login() {
	return (
		<SWRConfig>
			<LoginAuth />
		</SWRConfig>
	);
}

Login.getLayout = (page) => page;
