import { Loader } from "@components/loaders";
import { LogoutApiEndpoint } from "@configs/ApiEndpoints";
import { HomeLink } from "@configs/PageLinks";
import { server } from "@configs/ServerEnv";
import { usePostMethod } from "@hooks/useHttpMethod";
import { NextSeo } from "next-seo";
import { memo } from "react";
import "twin.macro";

// Pre-render `logout` data with NextJS SSR. Redirect to a login page for successful `logout` response (200 OK).
export async function getServerSideProps({ req }) {
	const logoutResponse = await usePostMethod(`${server + LogoutApiEndpoint}`, req.headers);
	const logoutData = logoutResponse?.data ?? null;
	const logoutStatus = logoutResponse?.status ?? null;

	if (
		typeof logoutData !== "undefined" &&
		logoutData !== null &&
		logoutData?.detail &&
		Object.keys(logoutData)?.length > 0 &&
		Math.round(logoutStatus / 200 === 1)
	) {
		return {
			redirect: {
				destination: HomeLink,
				permanent: false
			}
		};
	} else {
		return {
			notFound: true
		};
	}
}

const Logout = memo(() => {
	// Translations
	const { t } = useTranslation("common");
	const logout = t("logout");

	return (
        <>
			<NextSeo title={logout} />
			<Loader />
		</>
    );
});

export default Logout;
