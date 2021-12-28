/* eslint-disable react-hooks/exhaustive-deps */
import { MemoizedDashboardLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedAddNewSitePageLayout } from "@components/layouts/pages/AddNewSite";
import { SitesApiEndpoint, UserApiEndpoint } from "@constants/ApiEndpoints";
import { customAxiosHeaders } from "@constants/CustomAxiosHeaders";
import { DashboardSitesLink, LoginLink } from "@constants/PageLinks";
import { SSR_SITE_URL } from "@constants/ServerEnv";
import { handleStringToBooleanSanitation, handleStringToNumberSanitation } from "@helpers/handleStringSanitation";
import axios from "axios";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import "twin.macro";

// Pre-render `user` data with NextJS SSR. Redirect to a login page if current user is not allowed to access that page (403 Forbidden) or redirect to the sites dashboard page if the user is still currently logged in (200 OK).
export async function getServerSideProps({ req, query }) {
	// User response
	const userResponse = await axios.get(`${SSR_SITE_URL + UserApiEndpoint}`, {
		headers: {
			cookie: req?.headers?.cookie ?? null,
			...customAxiosHeaders
		}
	});
	const userData = userResponse?.data ?? null;
	const userStatus = userResponse?.status ?? null;

	// Sites response
	const sitesResponse = await axios.get(`${SSR_SITE_URL + SitesApiEndpoint}`, {
		headers: {
			cookie: req?.headers?.cookie ?? null,
			...customAxiosHeaders
		}
	});
	const sitesData = sitesResponse?.data ?? null;
	const sitesStatus = sitesResponse?.status ?? null;

	if (
		typeof userData !== "undefined" &&
		userData !== null &&
		!userData?.detail &&
		Object.keys(userData)?.length > 0 &&
		Math.round(userStatus / 200) === 1
	) {
		const sid = query?.sid ?? null;

		if (
			typeof sitesData !== "undefined" &&
			sitesData !== null &&
			!sitesData?.detail &&
			Object.keys(sitesData)?.length > 0 &&
			Math.round(sitesStatus / 200) === 1
		) {
			const sidMatch = sitesData?.results?.find((site) => site.id === sid) ?? null;

			if (typeof sidMatch === "undefined" || typeof sid === "undefined") {
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
		} else {
			return {
				redirect: {
					destination: DashboardSitesLink,
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

export default function AddNewSite() {
	// Translations
	const { t } = useTranslation("sites");
	const addNewSite = t("addNewSite");

	// Router
	const { query } = useRouter();

	let step = query.step ?? null;
	let sid = query.sid ?? null;
	let edit = query.edit ?? null;
	let verified = query.verified ?? null;

	const sanitizedStep = handleStringToNumberSanitation(step);
	const sanitizedSid = handleStringToNumberSanitation(sid);
	const sanitizedEdit = handleStringToBooleanSanitation(edit);
	const sanitizedVerified = handleStringToBooleanSanitation(verified);

	return (
		<>
			<NextSeo title={addNewSite} />
			<MemoizedPageLayout pageTitle={addNewSite}>
				<MemoizedAddNewSitePageLayout
					step={sanitizedStep}
					sid={sanitizedSid}
					edit={sanitizedEdit}
					verified={sanitizedVerified}
				/>
			</MemoizedPageLayout>
		</>
	);
}

AddNewSite.getLayout = function getLayout(page) {
	return <MemoizedDashboardLayout>{page}</MemoizedDashboardLayout>;
};
