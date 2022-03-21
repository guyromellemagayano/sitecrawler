import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedAddNewSitePageLayout } from "@components/layouts/pages/AddNewSite";
import { SitesApiEndpoint, UserApiEndpoint } from "@constants/ApiEndpoints";
import { AddNewSiteLink, DashboardSitesLink, LoginLink } from "@constants/PageLinks";
import { SSR_SITE_URL } from "@constants/ServerEnv";
import AppAxiosInstance from "@utils/axios";
import { handleConversionStringToBoolean, handleConversionStringToNumber } from "@utils/convertCase";
import axios from "axios";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { SWRConfig } from "swr";

// Pre-render `user` data with NextJS SSR. Redirect to a login page if current user is not allowed to access that page (403 Forbidden) or redirect to the sites dashboard page if the user is still currently logged in (200 OK).
export async function getServerSideProps({ req, query }) {
	// User response
	const userResponse = await AppAxiosInstance.get(`${SSR_SITE_URL + UserApiEndpoint}`, {
		headers: {
			cookie: req?.headers?.cookie ?? null
		}
	});
	const userResponseData = userResponse?.data ?? null;
	const userResponseStatus = userResponse?.status ?? null;

	// Sites response
	const sitesResponse = await axios.get(`${SSR_SITE_URL + SitesApiEndpoint}`, {
		headers: {
			cookie: req?.headers?.cookie ?? null
		}
	});
	const sitesResponseData = sitesResponse?.data ?? null;
	const sitesResponseStatus = sitesResponse?.status ?? null;

	if (
		userResponseData !== null &&
		!userResponseData?.detail &&
		!Object.keys(userResponseData).find((key) => key === "detail") &&
		Math.round(userResponseStatus / 200) == 1
	) {
		const sid = query?.sid ? handleConversionStringToNumber(query.sid) : null;
		const step = query?.step ? handleConversionStringToNumber(query.step) : null;
		const verified = query?.verified ? handleConversionStringToBoolean(query.verified) : null;
		const edit = query?.edit ? handleConversionStringToBoolean(query.edit) : null;

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

const AddNewSiteAuth = () => {
	// Translations
	const { t } = useTranslation("sites");
	const addNewSiteText = t("addNewSite");

	// Router
	const { query, push } = useRouter();

	// Custom variables
	let sanitizedSid = query?.sid ? handleConversionStringToNumber(query.sid) : null;
	let sanitizedStep = query?.step ? handleConversionStringToNumber(query.step) : null;
	let sanitizedVerified = query?.verified ? handleConversionStringToBoolean(query.verified) : null;
	let sanitizedEdit = query?.edit ? handleConversionStringToBoolean(query.edit) : null;
	let addNewSitePage = AddNewSiteLink + "?step=1&edit=false&verified=false";

	// Disallow the user to access the page if the `sid` query value is already verified
	useEffect(() => {
		sanitizedSid && sanitizedStep === 1 && sanitizedVerified && !sanitizedEdit ? push(addNewSitePage) : null;
	}, [query]);

	return (
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
	);
};

export default function AddNewSite() {
	return (
		<SWRConfig>
			<AddNewSiteAuth />
		</SWRConfig>
	);
}

AddNewSite.getLayout = (page) => page;
