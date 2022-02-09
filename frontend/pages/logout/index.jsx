import { MemoizedLayout } from "@components/layouts";
import { MemoizedLoader } from "@components/loaders";
import { LogoutApiEndpoint, UserApiEndpoint } from "@constants/ApiEndpoints";
import { RedirectInterval } from "@constants/GlobalValues";
import { LoginLink } from "@constants/PageLinks";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import { SiteCrawlerAppContext } from "@pages/_app";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useContext, useMemo } from "react";
import { useSWRConfig } from "swr";
import "twin.macro";

export default function Logout() {
	// Router
	const { asPath } = useRouter();
	const router = useRouter();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	useMemo(() => {
		let isMounted = true;

		(async () => {
			if (!isMounted) return;

			const logoutResponse = await handlePostMethod(LogoutApiEndpoint);
			const logoutResponseData = logoutResponse?.data ?? null;
			const logoutResponseStatus = logoutResponse?.status ?? null;
			const logoutResponseMethod = logoutResponse?.config?.method ?? null;

			if (logoutResponseData !== null && Math.round(logoutResponseStatus / 200) === 1) {
				// Mutate `user` endpoint after successful 200 OK or 201 Created response is issued
				await mutate(UserApiEndpoint, false);

				// Redirect to sites dashboard page after successful 200 OK response is established
				setTimeout(() => {
					router.push(LoginLink);
				}, RedirectInterval);
			}
		})();

		return () => {
			isMounted = false;
		};
	}, []);

	// Translations
	const { t } = useTranslation("logout");
	const logout = t("logout");

	// Custom context
	const { user, validatingUser } = useContext(SiteCrawlerAppContext);

	return !validatingUser && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
		<MemoizedLayout>
			<NextSeo title={logout} />
			<MemoizedLoader />
		</MemoizedLayout>
	) : (
		<MemoizedLoader />
	);
}

Logout.getLayout = (page) => page;
