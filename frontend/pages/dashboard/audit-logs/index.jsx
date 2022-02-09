import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedComingSoonPageLayout } from "@components/layouts/pages/ComingSoon";
import { MemoizedLoader } from "@components/loaders";
import { SiteCrawlerAppContext } from "@pages/_app";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useContext } from "react";

export default function AuditLogs() {
	// Translations
	const { t } = useTranslation("auditLogs");
	const auditLogs = t("auditLogs");

	// Custom context
	const { user, validatingUser } = useContext(SiteCrawlerAppContext);

	return !validatingUser && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
		<MemoizedLayout>
			<NextSeo title={auditLogs} />
			<MemoizedPageLayout pageTitle={auditLogs}>
				<MemoizedComingSoonPageLayout />
			</MemoizedPageLayout>
		</MemoizedLayout>
	) : (
		<MemoizedLoader />
	);
}

AuditLogs.getLayout = (page) => page;
