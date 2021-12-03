import useTranslation from "next-translate/useTranslation";
import dynamic from "next/dynamic";
import "twin.macro";
import Footer from "../components/Footer";

/**
 * Dynamic imports
 */
const Breadcrumbs = dynamic(() => import("@components/breadcrumbs"), { ssr: true });
const HowToSetup = dynamic(() => import("@components/sites/HowToSetup"), { ssr: true });
const AddSiteSteps = dynamic(() => import("@components/steps/AddSiteSteps"), { ssr: true });

export default function AddNewSitePageLayout() {
	// Translations
	const { t } = useTranslation();
	const sites = t("sites:sites");
	const addNewSite = t("addSite:addNewSite");

	return (
		<>
			<div tw="w-full py-6 mx-auto grid gap-16 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12">
				<div tw="lg:col-span-2 xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200">
					<div tw="max-w-full p-4">
						<Breadcrumbs isSites pageTitle={sites} pageDetailTitle={addNewSite} />
					</div>

					<AddSiteSteps />
				</div>

				<div tw="lg:col-span-1">
					<HowToSetup />
				</div>
			</div>

			<div tw="static bottom-0 w-full mx-auto p-4 border-t border-gray-200 bg-white">
				<Footer />
			</div>
		</>
	);
}
