import { MemoizedLayout } from "@components/layouts";
import { MemoizedRegistrationPageLayout } from "@components/layouts/pages/Registration";
import { MemoizedLoader } from "@components/loaders";
import { SiteCrawlerAppContext } from "@pages/_app";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useContext } from "react";
import { SWRConfig } from "swr";

const RegistrationAuth = () => {
	// Translations
	const { t } = useTranslation("registration");
	const registrationText = t("registration");

	// Custom context
	const { isComponentReady, user } = useContext(SiteCrawlerAppContext);

	// Custom variables
	const isUserNotLoaded =
		user && Object.keys(user)?.length > 0 && Math.round(user?.status / 100) === 4 && user?.data?.detail;

	return (
		<MemoizedLayout>
			<NextSeo title={registrationText} />
			{isComponentReady ? <MemoizedRegistrationPageLayout /> : <MemoizedLoader />}
		</MemoizedLayout>
	);
};

export default function Registration() {
	return (
		<SWRConfig>
			<RegistrationAuth />
		</SWRConfig>
	);
}

Registration.getLayout = (page) => page;
