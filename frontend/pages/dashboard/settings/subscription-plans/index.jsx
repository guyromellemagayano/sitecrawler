import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedSubscriptionPlansPageLayout } from "@components/layouts/pages/SubscriptionPlans";
import { MemoizedLoader } from "@components/loaders";
import { SiteCrawlerAppContext } from "@pages/_app";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useContext } from "react";
import { SWRConfig } from "swr";

const SubscriptionPlansAuth = () => {
	// Translations
	const { t } = useTranslation("common");
	const subscriptionPlansText = t("subscriptionPlans");

	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	return isComponentReady ? (
		<MemoizedLayout>
			<NextSeo title={subscriptionPlansText} />
			<MemoizedPageLayout pageTitle={subscriptionPlansText}>
				<MemoizedSubscriptionPlansPageLayout />
			</MemoizedPageLayout>
		</MemoizedLayout>
	) : (
		<MemoizedLoader />
	);
};

export default function SubscriptionPlans() {
	return (
		<SWRConfig>
			<SubscriptionPlansAuth />
		</SWRConfig>
	);
}

SubscriptionPlans.getLayout = (page) => page;
