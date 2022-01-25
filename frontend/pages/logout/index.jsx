import { MemoizedAlert } from "@components/alerts";
import { MemoizedLayout } from "@components/layouts";
import { MemoizedLoader } from "@components/loaders";
import { LogoutApiEndpoint, UserApiEndpoint } from "@constants/ApiEndpoints";
import { RedirectInterval } from "@constants/GlobalValues";
import { HomeLink } from "@constants/PageLinks";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import { useAlertMessage } from "@hooks/useAlertMessage";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSWRConfig } from "swr";
import "twin.macro";

export default function Logout() {
	// Router
	const { asPath } = useRouter();
	const router = useRouter();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Custom hooks
	const { state, setConfig } = useAlertMessage();

	useEffect(() => {
		(async () => {
			const logoutResponse = await handlePostMethod(LogoutApiEndpoint);
			const logoutResponseData = logoutResponse?.data ?? null;
			const logoutResponseStatus = logoutResponse?.status ?? null;
			const logoutResponseMethod = logoutResponse?.config?.method ?? null;

			if (logoutResponseData !== null && Math.round(logoutResponseStatus / 200) === 1) {
				// Mutate `user` endpoint after successful 200 OK or 201 Created response is issued
				await mutate(UserApiEndpoint, false);

				// Show alert message after failed response is issued
				setConfig({
					isLogout: true,
					method: logoutResponseMethod,
					status: logoutResponseStatus
				});

				// Redirect to sites dashboard page after successful 200 OK response is established
				setTimeout(() => {
					router.push(HomeLink);
				}, RedirectInterval);
			} else {
				// Show alert message after failed response is issued
				setConfig({
					isLogout: true,
					method: logoutResponseMethod,
					status: logoutResponseStatus
				});
			}
		})();
	}, [asPath]);

	// Translations
	const { t } = useTranslation("logout");
	const logout = t("logout");

	return (
		<>
			{state?.responses !== [] && state?.responses?.length > 0 ? (
				<div tw="fixed z-9999 right-2 top-4 bottom-4 flex flex-col justify-start items-end gap-4 overflow-y-auto">
					{state?.responses?.map((value, key) => {
						// Alert Messsages
						const responseText = value?.responseText ?? null;
						const isSuccess = value?.isSuccess ?? null;

						return <MemoizedAlert key={key} responseText={responseText} isSuccess={isSuccess} />;
					}) ?? null}
				</div>
			) : null}

			<NextSeo title={logout} />
			<MemoizedLoader />
		</>
	);
}

Logout.getLayout = function getLayout(page) {
	return <MemoizedLayout>{page}</MemoizedLayout>;
};
