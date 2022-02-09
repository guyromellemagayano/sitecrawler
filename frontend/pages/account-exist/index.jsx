import { MemoizedLayout } from "@components/layouts";
import { MemoizedAccountExistPageLayout } from "@components/layouts/pages/AccountExist";
import { MemoizedLoader } from "@components/loaders";
import { SiteCrawlerAppContext } from "@pages/_app";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useContext } from "react";

export default function AccountExist() {
	// Translations
	const { t } = useTranslation("common");
	const isAccountExist = t("isAccountExist");

	// Custom context
	const { user, validatingUser } = useContext(SiteCrawlerAppContext);

	return !validatingUser && user && Math.round(user?.status / 100) === 4 && user?.data?.detail ? (
		<MemoizedLayout>
			<NextSeo title={isAccountExist} />
			<MemoizedAccountExistPageLayout />
		</MemoizedLayout>
	) : (
		<MemoizedLoader />
	);
}

AccountExist.getLayout = (page) => page;
