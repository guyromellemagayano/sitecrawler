import Alert from "@components/alerts";
import SiteSelectDropdown from "@components/dropdowns/SiteSelectDropdown";
// import SiteSelectDropdown from "@components/dropdowns/SiteSelectDropdown";
import SiteSelectMenu from "@components/menus/SiteSelectMenu";
import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useSites } from "@hooks/useSites";
import * as Sentry from "@sentry/nextjs";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { memo, useEffect, useState } from "react";
import "twin.macro";

/**
 * Memoized function to render the `SiteSelect` component.
 */
const SiteSelect = memo(() => {
	const [selectedSite, setSelectedSite] = useState(null);
	const [selectedSiteDetails, setSelectedSiteDetails] = useState([]);
	const [selectedSiteId, setSelectedSiteId] = useState(null);
	const [errorMessage, setErrorMessage] = useState([]);

	// Translations
	const { t } = useTranslation("alerts");
	const siteBadGatewayGetError = t("siteBadGatewayGetError");
	const siteBadRequestGetError = t("siteBadRequestGetError");
	const siteForbiddenGetError = t("siteForbiddenGetError");
	const siteGatewayTimeoutGetError = t("siteGatewayTimeoutGetError");
	const siteInternalServerGetError = t("siteInternalServerGetError");
	const siteNotFoundGetError = t("siteNotFoundGetError");
	const siteServiceUnavailableGetError = t("siteServiceUnavailableGetError");
	const siteTooManyRequestsError = t("siteTooManyRequestsError");
	const siteUnknownError = t("siteUnknownError");

	// Router
	const { query } = useRouter();

	// SWR hooks
	const { sites, errorSites, validatingSites } = useSites(SitesApiEndpoint);

	// Custom hooks
	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

	// Custom functions
	const handleSiteSelectOnLoad = async (siteId) => {
		typeof sites !== "undefined" && sites !== null && Object.keys(sites).length > 0
			? sites?.results && sites?.results?.length > 0
				? (() => {
						for (let i = 0; i < sites?.results?.length; i++) {
							if (sites?.results?.[i]?.id == siteId) {
								setSelectedSite(sites?.results?.[i]?.name);
								setIsComponentVisible(!isComponentVisible);
								setSelectedSiteId(siteId);
							}
						}
				  })()
				: null
			: null;
	};

	useEffect(() => {
		if (!validatingSites) {
			if (typeof sites !== "undefined" && sites !== null && Object.keys(sites).length > 0) {
				for (let i = 0; i < sites?.results?.length; i++) {
					if (sites?.results?.[i]?.id === query.siteId) {
						setSelectedSite(sites?.results?.[i]?.name);
					}
				}
			} else {
				let errorStatusCodeMessage = "";

				switch (errorSites.status) {
					case 400:
						errorStatusCodeMessage = siteBadRequestGetError;
						break;
					case 403:
						errorStatusCodeMessage = siteForbiddenGetError;
						break;
					case 404:
						errorStatusCodeMessage = siteNotFoundGetError;
						break;
					case 408:
						errorStatusCodeMessage = siteGatewayTimeoutGetError;
						break;
					case 500:
						errorStatusCodeMessage = siteInternalServerGetError;
						break;
					case 502:
						errorStatusCodeMessage = siteBadGatewayGetError;
						break;
					case 503:
						errorStatusCodeMessage = siteServiceUnavailableGetError;
						break;
					case 504:
						errorStatusCodeMessage = siteGatewayTimeoutGetError;
						break;
					case 429:
						errorStatusCodeMessage = siteTooManyRequestsError;
						break;
					default:
						errorStatusCodeMessage = siteUnknownError;
						break;
				}

				setErrorMessage((prevState) => [
					...prevState,
					prevState.indexOf(errorStatusCodeMessage) !== -1
						? prevState.find((prevState) => prevState === errorStatusCodeMessage)
						: errorStatusCodeMessage
				]);

				// Capture unknown errors and send to Sentry
				Sentry.configureScope((scope) => {
					scope.setTag("route", asPath);
					scope.setTag("status", errorSites.status);
					scope.setTag(
						"message",
						errorMessage.find((message) => message === errorStatusCodeMessage)
					);
					Sentry.captureException(new Error(errorSites));
				});
			}
		}
	}, [sites, query, validatingSites]);

	useEffect(() => {
		if (!validatingSites) {
			if (typeof sites !== "undefined" && sites !== null && Object.keys(sites).length > 0) {
				if (typeof selectedSite !== "undefined" && selectedSite !== null) {
					sites?.results
						.filter((result) => result.name === selectedSite)
						.map((val) => {
							setSelectedSiteDetails(val);
						});

					let currentSite = sites?.results?.find((result) => result.id === parseInt(query.siteId));

					if (currentSite !== undefined) {
						setSelectedSite(currentSite.name);
					}
				}
			}
		}
	}, [selectedSite, sites, query, selectedSiteDetails, validatingSites]);

	return (
		<>
			{errorMessage !== [] && errorMessage.length > 0 ? (
				<div tw="fixed right-6 bottom-6 grid grid-flow-row gap-4">
					{errorMessage.map((value, key) => (
						<Alert key={key} message={value} isError />
					))}
				</div>
			) : null}

			<div tw="space-y-1">
				<div tw="relative">
					<div tw="relative">
						<span ref={ref} tw="inline-block w-full rounded-md shadow-sm">
							<SiteSelectMenu
								selectedSite={selectedSite}
								selectedSiteId={selectedSiteId}
								selectedSiteDetails={selectedSiteDetails}
								isComponentVisible={isComponentVisible}
								setIsComponentVisible={setIsComponentVisible}
							/>
						</span>

						<SiteSelectDropdown
							selectedSiteId={selectedSiteId}
							handleSiteSelectOnLoad={handleSiteSelectOnLoad}
							isComponentVisible={isComponentVisible}
						/>
					</div>
				</div>
			</div>
		</>
	);
});

export default SiteSelect;
