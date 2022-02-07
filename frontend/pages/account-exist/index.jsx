import { MemoizedLayout } from "@components/layouts";
import { MemoizedAccountExistPageLayout } from "@components/layouts/pages/AccountExist";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";

export default function AccountExist() {
	// Translations
	const { t } = useTranslation("common");
	const isAccountExist = t("isAccountExist");

	return (
		<>
			<NextSeo title={isAccountExist} />
			<MemoizedAccountExistPageLayout />
		</>
	);
}

AccountExist.getLayout = function getLayout(page) {
	return <MemoizedLayout>{page}</MemoizedLayout>;
};
