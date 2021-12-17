/* eslint-disable react-hooks/exhaustive-deps */
import { MemoizedAlert } from "@components/alerts";
import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { useAlertMessage } from "@hooks/useAlertMessage";
import { useSites } from "@hooks/useSites";
import { memo, useCallback, useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import "react-loading-skeleton/dist/skeleton.css";
import { useSWRConfig } from "swr";
import { MemoizedSiteList } from "./SiteList";

/**
 * Custom function to render the `SitesList` component
 */
export function SitesList(handleSiteSelectOnLoad) {
	// SWR hooks
	const { sites, errorSites, validatingSites } = useSites();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Custom hooks
	const { state, setConfig } = useAlertMessage();

	// Handle site selection errors
	const handleSiteSelectResponse = useCallback(async () => {
		if (!validatingSites) {
			if (!errorSites) {
				const sitesSelectResponse = await sites;
				const sitesSelectResponseData = sitesSelectResponse?.data ?? null;
				const sitesSelectResponseStatus = sitesSelectResponse?.status ?? null;
				const sitesSelectResponseMethod = sitesSelectResponse?.config?.method ?? null;

				if (sitesSelectResponseData !== null && Math.round(sitesSelectResponseStatus / 200) === 1) {
					if (Object.keys(sitesSelectResponseData)?.length > 0) {
						// Mutate `user` endpoint after successful 200 OK or 201 Created response is issued
						await mutate(SitesApiEndpoint, null, false);

						// Show alert message after successful 200 OK or 201 Created response is issued
						setConfig({
							isSites: true,
							method: sitesSelectResponseMethod,
							status: sitesSelectResponseStatus
						});
					}
				} else {
					// Show alert message after failed response is issued
					setConfig({
						isSites: true,
						method: sitesSelectResponseMethod,
						status: sitesSelectResponseStatus
					});
				}
			}
		}
	}, [sites, errorSites, validatingSites]);

	useEffect(() => {
		handleSiteSelectResponse();
	}, [handleSiteSelectResponse]);

	return (
		<>
			{state?.responses !== [] && state?.responses?.length > 0 ? (
				<div tw="fixed right-6 bottom-6 grid grid-flow-row gap-4">
					{state?.responses?.map((value, key) => {
						// Alert Messsages
						const responseText = value?.responseText ?? null;
						const isSuccess = value?.isSuccess ?? null;

						return <MemoizedAlert key={key} responseText={responseText} isSuccess={isSuccess} />;
					}) ?? null}
				</div>
			) : null}

			{!validatingSites ? (
				!errorSites && typeof sites !== "undefined" && sites !== null && Object.keys(sites).length > 0 ? (
					sites?.results && sites?.results?.length > 0 ? (
						<ul
							tabIndex="-1"
							role="listbox"
							aria-labelledby="listbox-label"
							tw="pt-2 h-48 text-base leading-6 overflow-auto focus:outline-none sm:text-sm sm:leading-5"
						>
							<Scrollbars universal>
								{sites?.results?.map((value, index) => (
									<MemoizedSiteList key={index} data={value} handleSiteSelectOnLoad={handleSiteSelectOnLoad} />
								)) ?? null}
							</Scrollbars>
						</ul>
					) : null
				) : null
			) : null}
		</>
	);
}

/**
 * Memoized custom `SitesList` component
 */
export const MemoizedSitesList = memo(SitesList);
