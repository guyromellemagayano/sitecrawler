import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedComingSoonPageLayout } from "@components/layouts/pages/ComingSoon";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";

export default function AuditLogs() {
	// Translations
	const { t } = useTranslation("auditLogs");
	const auditLogs = t("auditLogs");

	return (
		<MemoizedLayout>
			<NextSeo title={auditLogs} />
			<MemoizedPageLayout pageTitle={auditLogs}>
				<MemoizedComingSoonPageLayout />
			</MemoizedPageLayout>
		</MemoizedLayout>
	);
}

AuditLogs.getLayout = (page) => page;
