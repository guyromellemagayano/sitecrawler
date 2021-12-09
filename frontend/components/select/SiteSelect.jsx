/* eslint-disable react-hooks/exhaustive-deps */
import { MemoizedAlert } from "@components/alerts";
import { MemoizedSiteSelectDropdown } from "@components/dropdowns/SiteSelectDropdown";
import { MemoizedSiteSelectMenu } from "@components/menus/SiteSelectMenu";
import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { ComponentReadyInterval } from "@constants/GlobalValues";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useSites } from "@hooks/useSites";
import * as Sentry from "@sentry/nextjs";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "twin.macro";

/**
 * Custom function to render the `SiteSelect` component
 */
export function SiteSelect() {
	const [selectedSite, setSelectedSite] = useState(null);
	const [selectedSiteDetails, setSelectedSiteDetails] = useState([]);
	const [selectedSiteId, setSelectedSiteId] = useState(null);
	const [errorMessage, setErrorMessage] = useState([]);
	const [isComponentReady, setIsComponentReady] = useState(false);

	// Router
	const { isReady, pathname } = useRouter();

	useEffect(() => {
		if (isReady && pathname) {
			setTimeout(() => {
				setIsComponentReady(true);
			}, ComponentReadyInterval);
		}

		return () => {
			setIsComponentReady(false);
		};
	}, [isReady, pathname]);

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
	const { asPath, query } = useRouter();

	// SWR hooks
	const { sites, errorSites, validatingSites } = useSites(SitesApiEndpoint);

	// Custom hooks
	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

	// Handle site selection on load
	const handleSiteSelectOnLoad = useCallback(
		async (siteId) => {
			if (typeof sites !== "undefined" && sites !== null && Object.keys(sites).length > 0) {
				if (sites?.results && sites?.results?.length > 0) {
					for (let i = 0; i < sites?.results?.length; i++) {
						if (sites?.results?.[i]?.id == siteId) {
							setSelectedSite(sites?.results?.[i]?.name);
							setIsComponentVisible(!isComponentVisible);
							setSelectedSiteId(siteId);
						}
					}
				}
			}
		},
		[selectedSite, isComponentVisible, setIsComponentVisible, sites]
	);

	// Handle site selection on click
	const handleSiteSelectOnClick = useCallback(async () => {
		if (!validatingSites) {
			if (typeof sites !== "undefined" && sites !== null && Object.keys(sites).length > 0) {
				for (let i = 0; i < sites?.results?.length; i++) {
					if (sites?.results?.[i]?.id === query?.siteId) {
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
		return handleSiteSelectOnClick();
	}, [handleSiteSelectOnClick]);

	// Handle site selection on change
	const handleSiteSelectOnChange = useCallback(async () => {
		if (!validatingSites) {
			if (typeof sites !== "undefined" && sites !== null && Object.keys(sites).length > 0) {
				if (typeof selectedSite !== "undefined" && selectedSite !== null) {
					sites?.results
						.filter((result) => result.name === selectedSite)
						.map((val) => {
							setSelectedSiteDetails(val);
						});

					let currentSite = sites?.results?.find((result) => result.id === parseInt(query?.siteId)) ?? null;

					if (currentSite !== undefined) {
						setSelectedSite(currentSite?.name);
					}
				}
			}
		}
	}, [selectedSite, sites, query, selectedSiteDetails, validatingSites]);

	useEffect(() => {
		return handleSiteSelectOnChange();
	}, [handleSiteSelectOnChange]);

	return (
		<>
			{errorMessage !== [] && errorMessage.length > 0 ? (
				<div tw="fixed right-6 bottom-6 grid grid-flow-row gap-4">
					{errorMessage.map((value, key) => (
						<MemoizedAlert key={key} message={value} isError />
					))}
				</div>
			) : null}

			<div tw="relative space-y-1">
				<span ref={ref} tw="inline-block w-full rounded-md shadow-sm">
					{isComponentReady ? (
						<MemoizedSiteSelectMenu
							selectedSite={selectedSite}
							selectedSiteId={selectedSiteId}
							selectedSiteDetails={selectedSiteDetails}
							isComponentVisible={isComponentVisible}
							setIsComponentVisible={setIsComponentVisible}
						/>
					) : (
						<Skeleton width={224} height={38} tw="cursor-default relative w-full pl-3 pr-10 py-2" />
					)}
				</span>

				<MemoizedSiteSelectDropdown
					selectedSiteId={selectedSiteId}
					handleSiteSelectOnLoad={handleSiteSelectOnLoad}
					isComponentVisible={isComponentVisible}
				/>
			</div>
		</>
	);
}

/**
 * Memoized custom `SiteSelect` component
 */
export const MemoizedSiteSelect = memo(SiteSelect);
