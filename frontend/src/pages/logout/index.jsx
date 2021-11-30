import Layout from "@components/layouts";
import { Loader } from "@components/loaders";
import { LogoutApiEndpoint, UserApiEndpoint } from "@configs/ApiEndpoints";
import { DashboardSitesLink, LoginLink } from "@configs/PageLinks";
import { server } from "@configs/ServerEnv";
import { useGetMethod, usePostMethod } from "@hooks/useHttpMethod";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSWRConfig } from "swr";
import "twin.macro";

// Pre-render `user` data with NextJS SSR. Redirect to a login page if current user is not allowed to access that page (403 Forbidden) or redirect to the sites dashboard page if the user is still currently logged in (200 OK).
export async function getServerSideProps({ req }) {
	const userResponse = await useGetMethod(`${server + UserApiEndpoint}`, req.headers);
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
			redirect: {
				destination: DashboardSitesLink,
				permanent: false
			}
		};
	} else {
		return {
			props: {}
		};
	}
}

const Logout = () => {
	// Router
	const router = useRouter();

	// Translations
	const { t } = useTranslation("common");
	const logout = t("logout");

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	useEffect(() => {
		(async () => {
			const logoutResponse = await usePostMethod(LogoutApiEndpoint);
			const logoutData = logoutResponse?.data ?? null;
			const logoutStatus = logoutResponse?.status ?? null;

			if (
				typeof logoutData !== "undefined" &&
				logoutData !== null &&
				logoutData?.detail &&
				Object.keys(logoutData)?.length > 0 &&
				Math.round(logoutStatus / 200 === 1)
			) {
				// Mutate `user` endpoint after successful 200 OK or 201 Created response is issued
				mutate(UserApiEndpoint, false);

				// Redirect to login page after data mutation is completed
				router.push(LoginLink);
			}
		})();
	}, []);

	return (
		<>
			<NextSeo title={logout} />
			<Loader />
		</>
	);
};

Logout.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};

export default Logout;
