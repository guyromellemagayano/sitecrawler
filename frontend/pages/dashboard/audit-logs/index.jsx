import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedComingSoonPageLayout } from "@components/layouts/pages/ComingSoon";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { SWRConfig } from "swr";

const AuditLogsAuth = () => {
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
};

export default function AuditLogs() {
	return (
		<SWRConfig>
			<AuditLogsAuth />
		</SWRConfig>
	);
}

AuditLogs.getLayout = (page) => page;
