import { DashboardLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedHelpSupportPageLayout } from "@components/layouts/pages/HelpSupport";
// import HelpSupportPageLayout from "@components/layouts/pages/HelpSupport";
import { UserApiEndpoint } from "@constants/ApiEndpoints";
import { customAxiosHeaders } from "@constants/CustomAxiosHeaders";
import { LoginLink } from "@constants/PageLinks";
import { SSR_SITE_URL } from "@constants/ServerEnv";
import axios from "axios";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import "twin.macro";

// Pre-render `user` data with NextJS SSR. Redirect to a login page if current user is not allowed to access that page (403 Forbidden) or redirect to the sites dashboard page if the user is still currently logged in (200 OK).
export async function getServerSideProps({ req }) {
	const userResponse = await axios.get(`${SSR_SITE_URL + UserApiEndpoint}`, {
		headers: {
			cookie: req.headers.cookie ?? null,
			...customAxiosHeaders
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

export default function HelpSupport() {
	// Translations
	const { t } = useTranslation("common");
	const helpSupport = t("helpSupport");

	return (
		<>
			<NextSeo title={helpSupport} />
			<MemoizedPageLayout pageTitle={helpSupport}>
				<MemoizedHelpSupportPageLayout />
			</MemoizedPageLayout>
		</>
	);
}

HelpSupport.getLayout = function getLayout(page) {
	return <DashboardLayout>{page}</DashboardLayout>;
};
