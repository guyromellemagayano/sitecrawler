import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedSubscriptionPlansPageLayout } from "@components/layouts/pages/SubscriptionPlans";
import { MemoizedLoader } from "@components/loaders";
import { SiteCrawlerAppContext } from "@pages/_app";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useContext } from "react";

export default function SubscriptionPlans() {
	// Translations
	const { t } = useTranslation("common");
	const subscriptionPlansText = t("subscriptionPlans");

	// Custom context
	const { user, validatingUser } = useContext(SiteCrawlerAppContext);

	return !validatingUser && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
		<MemoizedLayout>
			<NextSeo title={subscriptionPlansText} />
			<MemoizedPageLayout pageTitle={subscriptionPlansText}>
				<MemoizedSubscriptionPlansPageLayout />
			</MemoizedPageLayout>
		</MemoizedLayout>
	) : (
		<MemoizedLoader />
	);
}

SubscriptionPlans.getLayout = (page) => page;
