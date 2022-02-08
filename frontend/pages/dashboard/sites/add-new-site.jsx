import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedAddNewSitePageLayout } from "@components/layouts/pages/AddNewSite";
import { MemoizedLoader } from "@components/loaders";
import { SitesApiEndpoint, UserApiEndpoint } from "@constants/ApiEndpoints";
import { DashboardSitesLink, LoginLink } from "@constants/PageLinks";
import { SSR_SITE_URL } from "@constants/ServerEnv";
import { SiteCrawlerAppContext } from "@pages/_app";
import AppAxiosInstance from "@utils/axios";
import { handleConversionStringToBoolean, handleConversionStringToNumber } from "@utils/convertCase";
import axios from "axios";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useContext } from "react";

// Pre-render `user` data with NextJS SSR. Redirect to a login page if current user is not allowed to access that page (403 Forbidden) or redirect to the sites dashboard page if the user is still currently logged in (200 OK).
export async function getServerSideProps({ req, query }) {
	// User response
	const userResponse = await AppAxiosInstance.get(`${SSR_SITE_URL + UserApiEndpoint}`, {
		headers: {
			cookie: req?.headers?.cookie ?? null
		}
	});
	const userData = userResponse?.data ?? null;
	const userStatus = userResponse?.status ?? null;

	// Sites response
	const sitesResponse = await axios.get(`${SSR_SITE_URL + SitesApiEndpoint}`, {
		headers: {
			cookie: req?.headers?.cookie ?? null
		}
	});
	const sitesResponseData = sitesResponse?.data ?? null;
	const sitesResponseStatus = sitesResponse?.status ?? null;

	if (
		userData !== null &&
		!userData?.detail &&
		!Object.keys(userData).find((key) => key === "detail") &&
		Math.round(userStatus / 200) === 1
	) {
		const sid = query?.sid ? parseInt(query?.sid) : null;
		const step = query?.step ? parseInt(query?.step) : null;
		const verified = query?.verified ? (query?.verified === "true" ? true : false) : null;
		const edit = query?.edit ? (query?.edit === "true" ? true : false) : null;

		if (
			sitesResponseData !== null &&
			!sitesResponseData?.detail &&
			Object.keys(sitesResponseData)?.length > 0 &&
			Math.round(sitesResponseStatus / 200) === 1
		) {
			const sidMatch =
				sitesResponseData?.results?.find((site) => site.id === sid && site.verified === verified) ?? null;

			if (
				edit !== null &&
				verified !== null &&
				step !== null &&
				((edit && !verified && step === 1 && sid !== null && sidMatch !== null) ||
					(!edit && !verified && step === 2 && sid !== null && sidMatch !== null) ||
					(!edit && !verified && step === 1 && sid === null && sidMatch === null) ||
					(!edit && verified && step === 3 && sid !== null && sidMatch !== null))
			) {
				return {
					props: {}
				};
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
	const addNewSiteText = t("addNewSite");

	// Router
	const { query } = useRouter();

	// Custom context
	const { user, state, setConfig } = useContext(SiteCrawlerAppContext);

	let step = query.step ?? null;
	let sid = query.sid ?? null;
	let edit = query.edit ?? null;
	let verified = query.verified ?? null;

	const sanitizedStep = handleConversionStringToNumber(step);
	const sanitizedSid = handleConversionStringToNumber(sid);
	const sanitizedEdit = handleConversionStringToBoolean(edit);
	const sanitizedVerified = handleConversionStringToBoolean(verified);

	return user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
		<MemoizedLayout>
			<NextSeo title={addNewSiteText} />
			<MemoizedPageLayout pageTitle={addNewSiteText}>
				<MemoizedAddNewSitePageLayout
					step={sanitizedStep}
					sid={sanitizedSid}
					edit={sanitizedEdit}
					verified={sanitizedVerified}
				/>
			</MemoizedPageLayout>
		</MemoizedLayout>
	) : !state?.responses?.length ? (
		<MemoizedLoader />
	) : (
		state?.responses?.map((value, key) => {
			// Alert Messsages
			const responseTitle = value?.responseTitle ?? null;
			const responseText = value?.responseText ?? null;
			const isSuccess = value?.isSuccess ?? null;

			return <MemoizedLoader key={key} message={responseTitle + ": " + responseText} />;
		})
	);
}

AddNewSite.getLayout = (page) => page;
