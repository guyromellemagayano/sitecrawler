import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedComingSoonPageLayout } from "@components/layouts/pages/ComingSoon";
import { MemoizedLoginPageLayout } from "@components/layouts/pages/Login";
import { MemoizedLoader } from "@components/loaders";
import { useUser } from "@hooks/useUser";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useEffect } from "react";

export default function Sites() {
	// SWR hooks
	const { user } = useUser();

	// Translations
	const { t } = useTranslation("sites");
	const sitesDashboard = t("sitesDashboard");

	useEffect(() => {
		if (Math.round(user?.status / 100) === 4) {
			return <MemoizedLoginPageLayout />;
		} else {
			if (Math.round(user?.status / 100) === 2) {
				<>
					<NextSeo title={sitesDashboard} />
					<MemoizedPageLayout pageTitle={sitesDashboard}>
						<MemoizedComingSoonPageLayout />
						{/* <MemoizedSitesDashboardPageLayout /> */}
					</MemoizedPageLayout>
				</>;
			}
		}
	}, [user]);

	return <MemoizedLoader />;
}

Sites.getLayout = function getLayout(page) {
	return <MemoizedLayout>{page}</MemoizedLayout>;
};
