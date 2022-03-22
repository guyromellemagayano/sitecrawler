import { useSiteSelection } from "@hooks/useSiteSelection";
import useTranslation from "next-translate/useTranslation";
import PropTypes from "prop-types";
import { memo } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import "react-loading-skeleton/dist/skeleton.css";
import { MemoizedSiteList } from "./SiteList";

/**
 * Custom function to render the `SitesList` component
 *
 * @param {object} sites
 */
const SitesList = ({ sites = null }) => {
	// Translations
	const { t } = useTranslation();
	const noAvailableSites = t("sites:noAvailableSites");
	const loaderMessage = t("common:loaderMessage");

	// Custom hooks
	const {
		siteSelectRef,
		isSiteSelectComponentVisible,
		setIsSiteSelectComponentVisible,
		selectedSite,
		selectedSiteDetails
	} = useSiteSelection();

	// Custom variables
	const sitesCount = sites?.data?.count ?? null;
	const sitesResults = sites?.data?.results ?? null;

	return sitesCount > 0 ? (
		<ul
			tabIndex="-1"
			role="listbox"
			aria-labelledby="listbox-label"
			className="h-48 overflow-auto pt-2 text-base leading-6 focus:outline-none sm:text-sm sm:leading-5"
		>
			<Scrollbars autoHide universal>
				{sitesResults?.map((value) => <MemoizedSiteList key={value.id} data={value} />) ?? null}
			</Scrollbars>
		</ul>
	) : sitesCount === 0 ? (
		// Show message if no sites are available
		<span className="flex h-48 w-full items-center justify-center">
			<p className="pt-6 pb-2 text-sm font-medium leading-6 text-gray-500">{noAvailableSites}</p>
		</span>
	) : (
		// Show message if sites are being loaded
		<span className="flex h-48 w-full items-center justify-center">
			<p className="pt-6 pb-2 text-sm font-medium leading-6 text-gray-500">{loaderMessage}</p>
		</span>
	);
};

SitesList.propTypes = {
	sites: PropTypes.shape({
		data: PropTypes.shape({
			count: PropTypes.any,
			results: PropTypes.any
		})
	})
};

/**
 * Memoized custom `SitesList` component
 */
export const MemoizedSitesList = memo(SitesList);
