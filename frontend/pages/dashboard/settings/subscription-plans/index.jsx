import { MemoizedDashboardLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedSubscriptionPlansPageLayout } from "@components/layouts/pages/SubscriptionPlans";
import { UserApiEndpoint } from "@constants/ApiEndpoints";
import { LoginLink } from "@constants/PageLinks";
import { SSR_SITE_URL } from "@constants/ServerEnv";
import AppAxiosInstance from "@utils/axios";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import "twin.macro";

// Pre-render `user` data with NextJS SSR. Redirect to a login page if current user is not allowed to access that page (403 Forbidden) or redirect to the sites dashboard page if the user is still currently logged in (200 OK).
export async function getServerSideProps({ req }) {
	const userResponse = await AppAxiosInstance.get(`${SSR_SITE_URL + UserApiEndpoint}`, {
		headers: {
			cookie: req.headers.cookie ?? null
		}
	});
	const userData = userResponse?.data ?? null;
	const userStatus = userResponse?.status ?? null;

	if (
		typeof userData !== "undefined" &&
		userData !== null &&
		!userData?.detail &&
		Object.keys(userData)?.length > 0 &&
		Math.round(userStatus / 200) === 1
	) {
		return {
			props: {}
		};
	} else {
		return {
			redirect: {
				destination: LoginLink,
				permanent: false
			}
		};
	}
}

export default function SubscriptionPlans() {
	// Translations
	const { t } = useTranslation("common");
	const subscriptionPlans = t("subscriptionPlans");

	return (
		<>
			<NextSeo title={subscriptionPlans} />
			<MemoizedPageLayout pageTitle={subscriptionPlans}>
				<MemoizedSubscriptionPlansPageLayout />
			</MemoizedPageLayout>
		</>
	);
}

SubscriptionPlans.getLayout = function getLayout(page) {
	return <MemoizedDashboardLayout>{page}</MemoizedDashboardLayout>;
};
