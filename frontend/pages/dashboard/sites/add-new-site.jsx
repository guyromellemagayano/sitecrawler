import { Layout } from "@components/layouts";
import Dashboard from "@components/layouts/components/Dashboard";
import { UserApiEndpoint } from "@constants/ApiEndpoints";
import { LoginLink } from "@constants/PageLinks";
import { server } from "@constants/ServerEnv";
import { AppAxiosInstance } from "@utils/axios";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import dynamic from "next/dynamic";
import "twin.macro";

// Pre-render `user` data with NextJS SSR. Redirect to a login page if current user is not allowed to access that page (403 Forbidden) or redirect to the sites dashboard page if the user is still currently logged in (200 OK).
export async function getStaticProps() {
	const userResponse = await AppAxiosInstance.get(`${server + UserApiEndpoint}`);
	const userData = userResponse?.data ?? null;
	const userStatus = userResponse?.status ?? null;

	if (
		typeof userData !== "undefined" &&
		userData !== null &&
		!userData?.detail &&
		Object.keys(userData)?.length > 0 &&
		Math.round(userStatus / 200 === 1)
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

/**
 * Dynamic imports
 */
const AddNewSitePageLayout = dynamic(() => import("@components/layouts/pages/AddNewSite"), { ssr: true });

export default function AddNewSite() {
	// Translations
	const { t } = useTranslation("addSite");
	const addNewSite = t("addNewSite");

	return (
		<Dashboard>
			<NextSeo title={addNewSite} />
			<AddNewSitePageLayout />
		</Dashboard>
	);
}

AddNewSite.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};
