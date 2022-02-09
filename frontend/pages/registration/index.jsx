import { MemoizedLayout } from "@components/layouts";
import { MemoizedRegistrationPageLayout } from "@components/layouts/pages/Registration";
import { MemoizedLoader } from "@components/loaders";
import { SiteCrawlerAppContext } from "@pages/_app";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useContext } from "react";

export default function Registration() {
	// Translations
	const { t } = useTranslation("registration");
	const registrationText = t("registration");

	// Custom context
	const { user, validatingUser } = useContext(SiteCrawlerAppContext);

	return !validatingUser && user && Math.round(user?.status / 100) === 4 && user?.data?.detail ? (
		<MemoizedLayout>
			<NextSeo title={registrationText} />
			<MemoizedRegistrationPageLayout />
		</MemoizedLayout>
	) : (
		<MemoizedLoader />
	);
}

Registration.getLayout = (page) => page;
