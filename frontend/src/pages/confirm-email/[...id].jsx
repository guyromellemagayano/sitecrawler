import Layout from "@components/layouts";
import { ConfirmEmailPageLayout } from "@components/layouts/pages/ConfirmEmail";
import { UserApiEndpoint } from "@configs/ApiEndpoints";
import { SitesLink } from "@configs/PageLinks";
import { server } from "@configs/ServerEnv";
import { useGetMethod } from "@hooks/useHttpMethod";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import * as React from "react";
import "twin.macro";

// Pre-render `user` data with NextJS SSR. Redirect to a login page if current user is not allowed to access that page (403 Forbidden) or redirect to the sites dashboard page if the user is still currently logged in (200 OK).
export async function getServerSideProps({ req, query }) {
	const userResponse = await useGetMethod(`${server + UserApiEndpoint}`, req.headers);
	const userData = userResponse.data ?? null;
	const userStatus = userResponse.status ?? null;

	if (
		typeof userData !== "undefined" &&
		userData !== null &&
		!userData.detail &&
		Object.keys(userData).length > 0 &&
		Math.round(userStatus / 200 === 1)
	) {
		return {
			redirect: {
				destination: SitesLink,
				permanent: false
			}
		};
	} else {
		return {
			props: {
				result: query
			}
		};
	}
}

/**
 * Memoized `ConfirmEmail` page.
 *
 * @param {object} result
 */
const ConfirmEmail = React.memo(({ result }) => {
	// Translations
	const { t } = useTranslation("confirmEmail");
	const emailConfirmation = t("emailConfirmation");

	return (
		<React.Fragment>
			<NextSeo title={emailConfirmation} />
			<ConfirmEmailPageLayout uid={result.id[0]} />
		</React.Fragment>
	);
});

ConfirmEmail.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};

export default ConfirmEmail;
