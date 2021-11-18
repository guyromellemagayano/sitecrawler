import Layout from "@components/layouts";
import { ResetPasswordFormPageLayout } from "@components/layouts/pages/ResetPassword";
import { UserApiEndpoint } from "@configs/ApiEndpoints";
import { SitesLink } from "@configs/PageLinks";
import { server } from "@configs/ServerEnv";
import { useGetMethod } from "@hooks/useHttpMethod";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import * as React from "react";

// Pre-render `user` data with NextJS SSR. Redirect to a login page if current user is not allowed to access that page (403 Forbidden) or if the link already expired; Redirect to the sites dashboard page if the user is still currently logged in (200 OK).
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
 * Memoized `ResetPasswordForm` component.
 *
 * @param {object} result
 * @description Reset password form page
 */
const ResetPasswordForm = React.memo(({ result }) => {
	// Translations
	const { t } = useTranslation("common");
	const isResetPasswordForm = t("isResetPasswordForm");

	return (
		<React.Fragment>
			<NextSeo title={isResetPasswordForm} />
			<ResetPasswordFormPageLayout uid={result.id[0]} token={result.id[1]} />
		</React.Fragment>
	);
});

ResetPasswordForm.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};

export default ResetPasswordForm;
