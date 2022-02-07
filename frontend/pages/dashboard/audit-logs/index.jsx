import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedComingSoonPageLayout } from "@components/layouts/pages/ComingSoon";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import "twin.macro";

export default function Reports() {
	// Translations
	const { t } = useTranslation("auditLogs");
	const auditLogs = t("auditLogs");

	return (
		<>
			<NextSeo title={auditLogs} />
			<MemoizedPageLayout pageTitle={auditLogs}>
				<MemoizedComingSoonPageLayout />
			</MemoizedPageLayout>
		</>
	);
}

Reports.getLayout = function getLayout(page) {
	return <MemoizedLayout>{page}</MemoizedLayout>;
};
