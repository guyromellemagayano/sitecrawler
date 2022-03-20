import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedAddNewSitePageLayout } from "@components/layouts/pages/AddNewSite";
import { AddNewSiteLink } from "@constants/PageLinks";
import { handleConversionStringToBoolean, handleConversionStringToNumber } from "@utils/convertCase";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { SWRConfig } from "swr";

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
