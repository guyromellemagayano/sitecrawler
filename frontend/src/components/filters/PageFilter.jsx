// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";

// External
import "twin.macro";
import { mutate } from "swr";
import PropTypes from "prop-types";

// Enums
import { PageFilterLabels } from "@enums/PageFilterLabels";

// Utils
import { removeURLParameter } from "@utils/functions";

const PageFilter = ({ filterQueryString, scanApiEndpoint, setPagePath }) => {
	const [allFilter, setAllFilter] = React.useState(false);
	const [brokenSecurityFilter, setBrokenSecurityFilter] = React.useState(false);
	const [duplicateDescriptionsFilter, setDuplicateDescriptionsFilter] = React.useState(false);
	const [duplicateTitlesFilter, setDuplicateTitlesFilter] = React.useState(false);
	const [largePageSizesFilter, setLargePageSizesFilter] = React.useState(false);
	const [noIssueFilter, setNoIssueFilter] = React.useState(false);

	const { asPath } = useRouter();
	const router = useRouter();

	const PageFilters = [
		{
			label: "All Pages",
			checked: allFilter,
			value: "all"
		},
		{
			label: "Broken Security",
			checked: brokenSecurityFilter,
			value: "brokenSecurity"
		},
		{
			label: "Duplicate Titles",
			checked: duplicateTitlesFilter,
			value: "duplicateTitles"
		},
		{
			label: "Duplicate Descriptions",
			checked: duplicateDescriptionsFilter,
			value: "duplicateDescriptions"
		},
		{
			label: "Large Page Sizes",
			checked: largePageSizesFilter,
			value: "largePageSizes"
		},
		{
			label: "No Issues",
			checked: noIssueFilter,
			value: "noIssues"
		}
	];

	const handleFilter = async (e) => {
		const filterType = e.target.value;
		const filterStatus = e.target.checked;

		let newPath = asPath;
		newPath = removeURLParameter(newPath, "page");

		if (filterType === "noIssues" && filterStatus) {
			setNoIssueFilter(true);
			setLargePageSizesFilter(false);
			setBrokenSecurityFilter(false);
			setDuplicateTitlesFilter(false);
			setDuplicateDescriptionsFilter(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "size_total_min");
			newPath = removeURLParameter(newPath, "tls_total");
			newPath = removeURLParameter(newPath, "has_duplicated_title");
			newPath = removeURLParameter(newPath, "has_duplicated_description");

			if (newPath.includes("?")) newPath += `&size_total_max=1048575&tls_total=true`;
			else newPath += `?size_total_max=1048575&tls_total=true`;
		} else if (filterType === "noIssues" && !filterStatus) {
			filterQueryString && filterQueryString.delete("size_total_max");
			filterQueryString && filterQueryString.delete("tls_total");
			filterQueryString && filterQueryString.delete("page");

			if (newPath.includes("size_total_max") && newPath.includes("tls_total")) {
				newPath = removeURLParameter(newPath, "size_total_max");
				newPath = removeURLParameter(newPath, "tls_total");
			}

			setNoIssueFilter(false);
		}

		if (filterType === "largePageSizes" && filterStatus) {
			setLargePageSizesFilter(true);
			setNoIssueFilter(false);
			setBrokenSecurityFilter(false);
			setDuplicateTitlesFilter(false);
			setDuplicateDescriptionsFilter(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "size_total_max");
			newPath = removeURLParameter(newPath, "tls_total");
			newPath = removeURLParameter(newPath, "has_duplicated_title");
			newPath = removeURLParameter(newPath, "has_duplicated_description");

			if (newPath.includes("?")) newPath += `&size_total_min=1048576`;
			else newPath += `?size_total_min=1048576`;
		} else if (filterType === "largePageSizes" && !filterStatus) {
			filterQueryString && filterQueryString.delete("size_total_min");
			filterQueryString && filterQueryString.delete("page");

			if (newPath.includes("size_total_min")) {
				newPath = removeURLParameter(newPath, "size_total_min");
			}

			setLargePageSizesFilter(false);
		}

		if (filterType === "brokenSecurity" && filterStatus) {
			setLargePageSizesFilter(false);
			setNoIssueFilter(false);
			setBrokenSecurityFilter(true);
			setDuplicateTitlesFilter(false);
			setDuplicateDescriptionsFilter(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "size_total_min");
			newPath = removeURLParameter(newPath, "size_total_max");
			newPath = removeURLParameter(newPath, "tls_total");
			newPath = removeURLParameter(newPath, "has_duplicated_title");
			newPath = removeURLParameter(newPath, "has_duplicated_description");

			if (newPath.includes("?")) newPath += `&tls_total=false`;
			else newPath += `?tls_total=false`;
		} else if (filterType === "brokenSecurity" && !filterStatus) {
			filterQueryString && filterQueryString.delete("tls_total");
			filterQueryString && filterQueryString.delete("page");

			if (newPath.includes("tls_total")) {
				newPath = removeURLParameter(newPath, "size_total_max");
				newPath = removeURLParameter(newPath, "size_total_min");
				newPath = removeURLParameter(newPath, "tls_total");
			}

			setBrokenSecurityFilter(false);
		}

		if (filterType === "duplicateTitles" && filterStatus) {
			setLargePageSizesFilter(false);
			setNoIssueFilter(false);
			setBrokenSecurityFilter(false);
			setDuplicateTitlesFilter(true);
			setDuplicateDescriptionsFilter(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "size_total_min");
			newPath = removeURLParameter(newPath, "size_total_max");
			newPath = removeURLParameter(newPath, "tls_total");
			newPath = removeURLParameter(newPath, "has_duplicated_description");

			if (newPath.includes("?")) newPath += `&has_duplicated_title=true`;
			else newPath += `?has_duplicated_title=true`;
		} else if (filterType === "duplicateTitles" && !filterStatus) {
			filterQueryString && filterQueryString.delete("has_duplicated_title");
			filterQueryString && filterQueryString.delete("page");

			if (newPath.includes("has_duplicated_title")) {
				newPath = removeURLParameter(newPath, "has_duplicated_title");
			}

			setDuplicateTitlesFilter(false);
		}

		if (filterType === "duplicateDescriptions" && filterStatus) {
			setLargePageSizesFilter(false);
			setNoIssueFilter(false);
			setBrokenSecurityFilter(false);
			setDuplicateTitlesFilter(false);
			setDuplicateDescriptionsFilter(true);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "size_total_min");
			newPath = removeURLParameter(newPath, "size_total_max");
			newPath = removeURLParameter(newPath, "tls_total");
			newPath = removeURLParameter(newPath, "has_duplicated_title");

			if (newPath.includes("?")) newPath += `&has_duplicated_description=true`;
			else newPath += `?has_duplicated_description=true`;
		} else if (filterType === "duplicateDescriptions" && !filterStatus) {
			filterQueryString && filterQueryString.delete("has_duplicated_description");
			filterQueryString && filterQueryString.delete("page");

			if (newPath.includes("has_duplicated_description")) {
				newPath = removeURLParameter(newPath, "has_duplicated_description");
			}

			setDuplicateDescriptionsFilter(false);
		}

		if (filterType === "all" && filterStatus) {
			setNoIssueFilter(false);
			setLargePageSizesFilter(false);
			setBrokenSecurityFilter(false);
			setDuplicateTitlesFilter(false);
			setDuplicateDescriptionsFilter(false);
			setAllFilter(true);

			newPath = removeURLParameter(newPath, "size_total_min");
			newPath = removeURLParameter(newPath, "size_total_max");
			newPath = removeURLParameter(newPath, "tls_total");
			newPath = removeURLParameter(newPath, "has_duplicated_title");
			newPath = removeURLParameter(newPath, "has_duplicated_description");
		}

		if (newPath.includes("?")) setPagePath(`${newPath}&`);
		else setPagePath(`${newPath}?`);

		router.push(newPath);

		mutate(scanApiEndpoint);
	};

	React.useEffect(() => {
		if (filterQueryString.has("size_total_min")) {
			setLargePageSizesFilter(true);
		} else {
			setLargePageSizesFilter(false);
		}

		if (filterQueryString.get("tls_total") === "false") {
			setBrokenSecurityFilter(true);
		} else {
			setBrokenSecurityFilter(false);
		}

		if (filterQueryString.get("has_duplicated_title") === "true") {
			setDuplicateTitlesFilter(true);
		} else {
			setDuplicateTitlesFilter(false);
		}

		if (filterQueryString.get("has_duplicated_description") === "true") {
			setDuplicateDescriptionsFilter(true);
		} else {
			setDuplicateDescriptionsFilter(false);
		}

		if (filterQueryString.has("size_total_max") && filterQueryString.get("tls_total") === "true") {
			setNoIssueFilter(true);
		} else {
			setNoIssueFilter(false);
		}

		if (
			!filterQueryString.has("size_total_max") &&
			!filterQueryString.has("size_total_min") &&
			!filterQueryString.has("tls_total") &&
			!filterQueryString.has("has_duplicated_title") &&
			!filterQueryString.has("has_duplicated_description")
		) {
			setAllFilter(true);
		} else {
			setAllFilter(false);
		}

		return {
			filterQueryString,
			noIssueFilter,
			brokenSecurityFilter,
			largePageSizesFilter,
			duplicateTitlesFilter,
			duplicateDescriptionsFilter,
			allFilter
		};
	});

	return (
		<div tw="pb-4 bg-white">
			<div tw="px-4 py-5 border border-gray-300 sm:px-6 bg-white rounded-lg lg:flex lg:justify-between">
				<div tw="-ml-4 lg:-mt-2 lg:flex items-center flex-wrap sm:flex-nowrap">
					<h4 tw="ml-4 mb-4 lg:mb-0 mt-2 mr-1 text-base leading-4 font-semibold text-gray-600">
						{PageFilterLabels[0].label}
					</h4>
					{PageFilters.filter((e) => e.value !== "noIssues").map((value, key) => {
						return (
							<div key={key} tw="ml-4 mt-2 mr-2">
								<div>
									<label tw="flex items-center">
										<input
											type="checkbox"
											tw="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
											onChange={handleFilter}
											checked={value.checked}
											value={value.value}
										/>
										<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">
											{value.label}
										</span>
									</label>
								</div>
							</div>
						);
					})}
				</div>
				<div tw="lg:-mt-2 lg:flex items-center justify-end flex-wrap sm:flex-nowrap">
					{PageFilters.filter((e) => e.value === "noIssues").map((value, key) => {
						return (
							<div key={key} tw="mt-2">
								<div>
									<label tw="flex items-center">
										<input
											type="checkbox"
											tw="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
											onChange={handleFilter}
											checked={value.checked}
											value={value.value}
										/>
										<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">
											{value.label}
										</span>
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

PageFilter.propTypes = {
	filterQueryString: PropTypes.object,
	scanApiEndpoint: PropTypes.string,
	setPagePath: PropTypes.func
};

PageFilter.defaultProps = {
	filterQueryString: null,
	scanApiEndpoint: null,
	setPagePath: null
};

export default PageFilter;
