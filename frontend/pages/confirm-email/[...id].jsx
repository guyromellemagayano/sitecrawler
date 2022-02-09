import { MemoizedLayout } from "@components/layouts";
import { MemoizedConfirmEmailPageLayout } from "@components/layouts/pages/ConfirmEmail";
import { MemoizedLoader } from "@components/loaders";
import { SiteCrawlerAppContext } from "@pages/_app";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useContext } from "react";

export default function ConfirmEmail() {
	// Translations
	const { t } = useTranslation("confirmEmail");
	const emailConfirmation = t("emailConfirmation");

	// Custom context
	const { user, state } = useContext(SiteCrawlerAppContext);

	return user && Math.round(user?.status / 100) === 4 && user?.data?.detail ? (
		<MemoizedLayout>
			<NextSeo title={emailConfirmation} />
			<MemoizedConfirmEmailPageLayout />
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

ConfirmEmail.getLayout = (page) => page;
