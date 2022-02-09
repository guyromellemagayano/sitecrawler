import { handleRemoveUrlParameter } from "@helpers/handleRemoveUrlParameter";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useCallback, useEffect, useState } from "react";
import { mutate } from "swr";
import "twin.macro";

/**
 * Custom function to render the `LinkFilter` component
 *
 * @param {string} filterQueryString
 * @param {string} scanApiEndpoint
 * @param {function} setPagePath
 */
const LinkFilter = ({ filterQueryString = null, scanApiEndpoint = null, setPagePath }) => {
	const [allFilter, setAllFilter] = useState(false);
	const [externalLinksFilter, setExternalLinksFilter] = useState(false);
	const [internalLinksFilter, setInternalLinksFilter] = useState(false);
	const [linksWithIssuesFilter, setLinksWithIssuesFilter] = useState(false);
	const [noIssueFilter, setNoIssueFilter] = useState(false);

	// Translations
	const { t } = useTranslation();
	const filter = t("sites:filter");

	// Router
	const { asPath, push } = useRouter();

	// Custom filters
	const LinkFilters = [
		{
			label: "All Links",
			checked: allFilter,
			value: "all"
		},
		{
			label: "Links with Issues",
			checked: linksWithIssuesFilter,
			value: "linksWithIssues"
		},
		{
			label: "Internal Links",
			checked: internalLinksFilter,
			value: "internalLinks"
		},
		{
			label: "External Links",
			checked: externalLinksFilter,
			value: "externalLinks"
		},
		{
			label: "No Issues",
			checked: noIssueFilter,
			value: "noIssues"
		}
	];

	// Handle filter URLs
	const handleFilterUrl = useCallback(
		async (e) => {
			const filterType = e.target.value;
			const filterStatus = e.target.checked;

			let newPath = asPath;
			newPath = handleRemoveUrlParameter(newPath, "page");

			if (filterType === "linksWithIssues" && filterStatus) {
				setLinksWithIssuesFilter(true);
				setNoIssueFilter(false);
				setAllFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "status");

				if (newPath.includes("?")) newPath += `&status__neq=OK`;
				else newPath += `?status__neq=OK`;
			} else if (filterType === "linksWithIssues" && !filterStatus) {
				filterQueryString?.delete("status__neq") ?? null;

				if (newPath.includes("status__neq")) newPath = handleRemoveUrlParameter(newPath, "status__neq");

				setLinksWithIssuesFilter(false);
			}

			if (filterType === "noIssues" && filterStatus) {
				setLinksWithIssuesFilter(false);
				setNoIssueFilter(true);
				setAllFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "status__neq");

				if (newPath.includes("?")) newPath += `&status=OK`;
				else newPath += `?status=OK`;
			} else if (filterType === "noIssues" && !filterStatus) {
				filterQueryString?.delete("status") ?? null;

				if (newPath.includes("status")) newPath = handleRemoveUrlParameter(newPath, "status");

				setNoIssueFilter(false);
			}

			if (filterType === "internalLinks" && filterStatus) {
				setInternalLinksFilter(true);
				setExternalLinksFilter(false);
				setAllFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "type");

				if (newPath.includes("?")) newPath += `&type=PAGE`;
				else newPath += `?type=PAGE`;
			} else if (filterType === "internalLinks" && !filterStatus) {
				filterQueryString?.delete("type") ?? null;

				if (newPath.includes("type")) newPath = handleRemoveUrlParameter(newPath, "type");

				setInternalLinksFilter(false);
			}

			if (filterType === "externalLinks" && filterStatus) {
				setExternalLinksFilter(true);
				setInternalLinksFilter(false);
				setAllFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "type");

				if (newPath.includes("?")) newPath += `&type=EXTERNAL`;
				else newPath += `?type=EXTERNAL`;
			} else if (filterType === "externalLinks" && !filterStatus) {
				filterQueryString?.delete("type") ?? null;

				if (newPath.includes("type")) newPath = handleRemoveUrlParameter(newPath, "type");

				setExternalLinksFilter(false);
			}

			if (filterType === "all" && filterStatus) {
				setAllFilter(true);
				setLinksWithIssuesFilter(false);
				setNoIssueFilter(false);
				setExternalLinksFilter(false);
				setInternalLinksFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "status");
				newPath = handleRemoveUrlParameter(newPath, "status__neq");
				newPath = handleRemoveUrlParameter(newPath, "type");
			}

			if (newPath.includes("?")) setPagePath(`${newPath}&`);
			else setPagePath(`${newPath}?`);

			push(newPath);

			await mutate(scanApiEndpoint, false);
		},
		[asPath, filterQueryString, scanApiEndpoint]
	);

	useEffect(() => {
		handleFilterUrl();
	}, [handleFilterUrl]);

	// Handle filters
	const handleFilters = useCallback(async () => {
		if (filterQueryString?.has("status__neq")) {
			setLinksWithIssuesFilter(true);
		} else {
			setLinksWithIssuesFilter(false);
		}

		if (filterQueryString?.has("status")) {
			setNoIssueFilter(true);
		} else {
			setNoIssueFilter(false);
		}

		if (filterQueryString?.has("type")) {
			if (filterQueryString?.get("type") === "PAGE") {
				setInternalLinksFilter(true);
				setExternalLinksFilter(false);
			} else if (filterQueryString?.get("type") === "EXTERNAL") {
				setExternalLinksFilter(true);
				setInternalLinksFilter(false);
			} else if (filterQueryString?.get("type") === "EXTERNALOTHER") {
				setExternalLinksFilter(true);
				setInternalLinksFilter(false);
			}
		} else {
			setInternalLinksFilter(false);
			setExternalLinksFilter(false);
		}

		if (
			!filterQueryString?.has("type") &&
			!filterQueryString?.has("status") &&
			!filterQueryString?.has("status__neq")
		) {
			setAllFilter(true);
		} else {
			setAllFilter(false);
		}

		return {
			noIssueFilter,
			linksWithIssuesFilter,
			internalLinksFilter,
			externalLinksFilter,
			allFilter
		};
	}, [filterQueryString, noIssueFilter, linksWithIssuesFilter, internalLinksFilter, externalLinksFilter, allFilter]);

	useEffect(() => {
		handleFilters();
	}, [handleFilters]);

	return (
		<div tw="pb-4 bg-white">
			<div tw="px-4 py-5 border border-gray-300 sm:px-6 bg-white rounded-lg lg:flex lg:justify-between">
				<div tw="-ml-4 lg:-mt-2 lg:flex items-center flex-wrap sm:flex-nowrap">
					<h4 tw="ml-4 mb-4 lg:mb-0 mt-2 mr-1 text-base leading-4 font-semibold text-gray-600">{filter}</h4>
					{LinkFilters.filter((e) => e.value !== "noIssues").map((value, key) => {
						return (
							<div key={key} tw="ml-4 mt-2 mr-2">
								<div>
									<label tw="flex items-center">
										<input
											type="checkbox"
											tw="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
											onChange={handleFilterUrl}
											checked={value.checked}
											value={value.value}
										/>
										<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">{value.label}</span>
									</label>
								</div>
							</div>
						);
					})}
				</div>
				<div tw="lg:-mt-2 lg:flex items-center justify-end flex-wrap sm:flex-nowrap">
					{LinkFilters.filter((e) => e.value === "noIssues").map((value, key) => {
						return (
							<div key={key} tw="mt-2">
								<div>
									<label tw="flex items-center">
										<input
											type="checkbox"
											tw="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
											onChange={handleFilterUrl}
											checked={value.checked}
											value={value.value}
										/>
										<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">{value.label}</span>
									</label>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

LinkFilter.propTypes = {
	filterQueryString: PropTypes.object,
	scanApiEndpoint: PropTypes.string,
	setPagePath: PropTypes.func
};

/**
 * Memoized custom `LinkFilter` component
 */
export const MemoizedLinkFilter = memo(LinkFilter);
