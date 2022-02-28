import { MemoizedLayout } from "@components/layouts";
import { MemoizedLoader } from "@components/loaders";
import { LogoutApiEndpoint, UserApiEndpoint } from "@constants/ApiEndpoints";
import { RedirectInterval } from "@constants/GlobalValues";
import { LoginLink } from "@constants/PageLinks";
import { SSR_SITE_URL } from "@constants/ServerEnv";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import AppAxiosInstance from "@utils/axios";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSWRConfig } from "swr";

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
		userData !== null &&
		!userData?.detail &&
		Object.keys(userData)?.length > 0 &&
		Math.round(userStatus / 200) === 1
	) {
		const logoutResponse = await AppAxiosInstance.post(`${SSR_SITE_URL + LogoutApiEndpoint}`, {
			headers: {
				cookie: req.headers.cookie ?? null
			}
		});
		const logoutData = logoutResponse?.data ?? null;
		const logoutStatus = logoutResponse?.status ?? null;

		if (
			logoutData !== null &&
			logoutData.detail &&
			Object.keys(logoutData)?.length > 0 &&
			Math.round(logoutStatus / 200) === 1
		) {
			return {
				props: {
					data: logoutData.detail
				},
				redirect: {
					destination: LoginLink,
					permanent: false
				}
			};
		}
	} else {
		return {
			redirect: {
				destination: LoginLink,
				permanent: false
			}
		};
	}
}

export default function Logout({ data }) {
	// Translations
	const { t } = useTranslation("logout");
	const logout = t("logout");

	// Router
	const { asPath, push } = useRouter();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	useEffect(() => {
		let isMounted = true;

		(async () => {
			if (!isMounted) return;

			const logoutResponse = await handlePostMethod(LogoutApiEndpoint);
			const logoutResponseData = logoutResponse?.data ?? null;
			const logoutResponseStatus = logoutResponse?.status ?? null;
			const logoutResponseMethod = logoutResponse?.config?.method ?? null;

			if (logoutResponseData !== null && Math.round(logoutResponseStatus / 200) === 1) {
				// Mutate `user` endpoint after successful 200 OK or 201 Created response is issued
				mutate(UserApiEndpoint);

				// Redirect to sites dashboard page after successful 200 OK response is established
				setTimeout(() => {
					push(LoginLink);
				}, RedirectInterval);
			}
		})();

		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<MemoizedLayout>
			<NextSeo title={logout} />
			<MemoizedLoader message={data} />
		</MemoizedLayout>
	);
}

Logout.getLayout = (page) => page;
