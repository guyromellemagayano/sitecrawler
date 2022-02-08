import { useNotificationMessage } from "@hooks/useNotificationMessage";
import { useSites } from "@hooks/useSites";
import useTranslation from "next-translate/useTranslation";
import PropTypes from "prop-types";
import { memo, useMemo } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import "react-loading-skeleton/dist/skeleton.css";
import "twin.macro";
import { MemoizedSiteList } from "./SiteList";

/**
 * Custom function to render the `SitesList` component
 *
 * @param {function} handleSiteSelectOnClick
 * @param {boolean} isOpen
 */
const SitesList = ({ isOpen = false }) => {
	// Translations
	const { t } = useTranslation();
	const noAvailableSites = t("sites:noAvailableSites");
	const loaderMessage = t("common:loaderMessage");

	// Custom hooks
	const { setConfig } = useNotificationMessage();

	// `sites` SWR hook
	const { sites, errorSites, validatingSites } = useSites();

	useMemo(() => {
		// Show alert message after failed `sites` SWR hook fetch
		errorSites
			? setConfig({
					isSites: true,
					method: errorSites?.config?.method ?? null,
					status: errorSites?.status ?? null
			  })
			: null;
	}, [errorSites]);

	return !validatingSites ? (
		sites?.data?.count > 0 && sites?.data?.results?.length > 0 ? (
			<ul
				tabIndex="-1"
				role="listbox"
				aria-labelledby="listbox-label"
				tw="pt-2 h-48 text-base leading-6 overflow-auto focus:outline-none sm:text-sm sm:leading-5"
			>
				<Scrollbars universal>
					{sites.data.results.map((value) => (
						<MemoizedSiteList key={value.id} data={value} />
					))}
				</Scrollbars>
			</ul>
		) : (
			// Show message if no sites are available
			<span tw="w-full h-48 flex items-center justify-center">
				<p tw="text-sm pt-6 pb-2 leading-6 font-medium text-gray-500">{noAvailableSites}</p>
			</span>
		)
	) : (
		// Show message if no sites are available
		<span tw="w-full h-48 flex items-center justify-center">
			<p tw="text-sm pt-6 pb-2 leading-6 font-medium text-gray-500">{loaderMessage}</p>
		</span>
	);
};

SitesList.propTypes = {
	isOpen: PropTypes.bool
};

/**
 * Memoized custom `SitesList` component
 */
export const MemoizedSitesList = memo(SitesList);
