/* eslint-disable react-hooks/exhaustive-deps */
import { MemoizedLayout } from "@components/layouts";
import { MemoizedLoader } from "@components/loaders";
import { LogoutApiEndpoint, UserApiEndpoint } from "@constants/ApiEndpoints";
import { HomeLink } from "@constants/PageLinks";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSWRConfig } from "swr";
import "twin.macro";

export default function Logout() {
	// Router
	const router = useRouter();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	useEffect(() => {
		(async () => {
			const logoutResponse = await handlePostMethod(LogoutApiEndpoint);
			const logoutResponseData = logoutResponse?.data ?? null;
			const logoutResponseStatus = logoutResponse?.status ?? null;

			console.debug(logoutResponse);

			if (logoutResponseData !== null && Math.round(logoutResponseStatus / 200) === 1) {
				// Mutate `user` endpoint after successful 200 OK or 201 Created response is issued
				await mutate(UserApiEndpoint, false);

				// Redirect to sites dashboard page after successful 200 OK response is established
				router.push(HomeLink);
			}
		})();
	}, []);

	// Translations
	const { t } = useTranslation("common");
	const logout = t("logout");

	return (
		<>
			<NextSeo title={logout} />
			<MemoizedLoader />
		</>
	);
}

Logout.getLayout = function getLayout(page) {
	return <MemoizedLayout>{page}</MemoizedLayout>;
};
