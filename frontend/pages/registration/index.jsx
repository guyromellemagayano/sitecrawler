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
	const { user, state, setConfig } = useContext(SiteCrawlerAppContext);

	return user && Math.round(user?.status / 100) === 4 && user?.data?.detail ? (
		<MemoizedLayout>
			<NextSeo title={registrationText} />
			<MemoizedRegistrationPageLayout />
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

Registration.getLayout = (page) => page;
