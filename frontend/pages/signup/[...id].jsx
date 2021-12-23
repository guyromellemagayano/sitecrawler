/* eslint-disable react-hooks/exhaustive-deps */
import { MemoizedLayout } from "@components/layouts";
import { MemoizedSignupPageLayout } from "@components/layouts/pages/Signup";
import { UserApiEndpoint } from "@constants/ApiEndpoints";
import { customAxiosHeaders } from "@constants/CustomAxiosHeaders";
import { DashboardSitesLink } from "@constants/PageLinks";
import { SSR_SITE_URL } from "@constants/ServerEnv";
import axios from "axios";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect } from "react";

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

export default function Signup() {
	// Translations
	const { t } = useTranslation("signup");
	const completeSignup = t("completeSignup");

	// Router
	const router = useRouter();

	useEffect(() => {
		router.prefetch(DashboardSitesLink);
	}, []);

	return (
		<>
			<NextSeo title={completeSignup} />
			<MemoizedSignupPageLayout />
		</>
	);
}

Signup.getLayout = function getLayout(page) {
	return <MemoizedLayout>{page}</MemoizedLayout>;
};
