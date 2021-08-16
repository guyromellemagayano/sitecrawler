// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";

// External
import "twin.macro";
import { mutate } from "swr";
import PropTypes from "prop-types";

// Enums
import { SeoFilterLabels } from "@enums/SeoFilterLabels";

// Utils
import { removeURLParameter } from "@utils/functions";

const SeoFilter = ({ filterQueryString, scanApiEndpoint, setPagePath }) => {
	const [allFilter, setAllFilter] = React.useState(false);
	const [missingDescriptionsFilter, setMissingDescriptionsFilter] = React.useState(false);
	const [missingFirstH1Filter, setMissingFirstH1Filter] = React.useState(false);
	const [missingFirstH2Filter, setMissingFirstH2Filter] = React.useState(false);
	const [missingSecondH1Filter, setMissingSecondH1Filter] = React.useState(false);
	const [missingSecondH2Filter, setMissingSecondH2Filter] = React.useState(false);
	const [noIssueFilter, setNoIssueFilter] = React.useState(false);
	const [missingTitlesFilter, setMissingTitlesFilter] = React.useState(false);

	const { asPath } = useRouter();
	const router = useRouter();

	const SeoFilters = [
		{
			label: "All Pages",
			checked: allFilter,
			value: "all"
		},
		{
			label: "Missing Titles",
			checked: missingTitlesFilter,
			value: "missingTitles"
		},
		{
			label: "Missing Descriptions",
			checked: missingDescriptionsFilter,
			value: "missingDescriptions"
		},
		{
			label: "Missing First H1s",
			checked: missingFirstH1Filter,
			value: "missingFirstH1"
		},
		{
			label: "Missing First H2s",
			checked: missingFirstH2Filter,
			value: "missingFirstH2"
		},
		{
			label: "Missing Second H1s",
			checked: missingSecondH1Filter,
			value: "missingSecondH1"
		},
		{
			label: "Missing Second H2s",
			checked: missingSecondH2Filter,
			value: "missingSecondH2"
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
			setMissingTitlesFilter(false);
			setNoIssueFilter(true);
			setMissingDescriptionsFilter(false);
			setMissingFirstH1Filter(false);
			setMissingSecondH1Filter(false);
			setMissingFirstH2Filter(false);
			setMissingSecondH2Filter(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "has_title");
			newPath = removeURLParameter(newPath, "has_description");
			newPath = removeURLParameter(newPath, "has_h1_first");
			newPath = removeURLParameter(newPath, "has_h1_second");
			newPath = removeURLParameter(newPath, "has_h2_first");
			newPath = removeURLParameter(newPath, "has_h2_second");

			if (newPath.includes("?"))
				newPath += `&has_title=true&has_description=true&has_h1_first=true&has_h2_first=true`;
			else newPath += `?has_title=true&has_description=true&has_h1_first=true&has_h2_first=true`;
		} else if (filterType === "noIssues" && !filterStatus) {
			filterQueryString && filterQueryString.delete("has_title");
			filterQueryString && filterQueryString.delete("has_description");
			filterQueryString && filterQueryString.delete("has_h1_first");
			filterQueryString && filterQueryString.delete("has_h2_first");
			filterQueryString && filterQueryString.delete("page");

			if (
				newPath.includes("has_title") &&
				newPath.includes("has_description") &&
				newPath.includes("has_h1_first") &&
				newPath.includes("has_h2_first")
			) {
				newPath = removeURLParameter(newPath, "has_title");
				newPath = removeURLParameter(newPath, "has_description");
				newPath = removeURLParameter(newPath, "has_h1_first");
				newPath = removeURLParameter(newPath, "has_h2_first");
			}

			setNoIssueFilter(false);
		}

		if (filterType === "missingTitles" && filterStatus) {
			setMissingTitlesFilter(true);
			setNoIssueFilter(false);
			setMissingDescriptionsFilter(false);
			setMissingFirstH1Filter(false);
			setMissingSecondH1Filter(false);
			setMissingFirstH2Filter(false);
			setMissingSecondH2Filter(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "has_description");
			newPath = removeURLParameter(newPath, "has_h1_first");
			newPath = removeURLParameter(newPath, "has_h1_second");
			newPath = removeURLParameter(newPath, "has_h2_first");
			newPath = removeURLParameter(newPath, "has_h2_second");

			if (newPath.includes("?")) newPath += `&has_title=false`;
			else newPath += `?has_title=false`;
		} else if (filterType === "missingTitles" && !filterStatus) {
			filterQueryString && filterQueryString.delete("has_title");
			filterQueryString && filterQueryString.delete("page");

			if (newPath.includes("has_title")) {
				newPath = removeURLParameter(newPath, "has_title");
			}

			setMissingTitlesFilter(false);
		}

		if (filterType === "missingDescriptions" && filterStatus) {
			setMissingTitlesFilter(false);
			setNoIssueFilter(false);
			setMissingDescriptionsFilter(true);
			setMissingFirstH1Filter(false);
			setMissingSecondH1Filter(false);
			setMissingFirstH2Filter(false);
			setMissingSecondH2Filter(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "has_title");
			newPath = removeURLParameter(newPath, "has_h1_first");
			newPath = removeURLParameter(newPath, "has_h1_second");
			newPath = removeURLParameter(newPath, "has_h2_first");
			newPath = removeURLParameter(newPath, "has_h2_second");

			if (newPath.includes("?")) newPath += `&has_description=false`;
			else newPath += `?has_description=false`;
		} else if (filterType === "missingDescriptions" && !filterStatus) {
			filterQueryString && filterQueryString.delete("has_description");
			filterQueryString && filterQueryString.delete("page");

			if (newPath.includes("has_description")) {
				newPath = removeURLParameter(newPath, "has_description");
			}

			setMissingDescriptionsFilter(false);
		}

		if (filterType === "missingFirstH1" && filterStatus) {
			setMissingTitlesFilter(false);
			setNoIssueFilter(false);
			setMissingDescriptionsFilter(false);
			setMissingFirstH1Filter(true);
			setMissingSecondH1Filter(false);
			setMissingFirstH2Filter(false);
			setMissingSecondH2Filter(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "has_title");
			newPath = removeURLParameter(newPath, "has_description");
			newPath = removeURLParameter(newPath, "has_h1_second");
			newPath = removeURLParameter(newPath, "has_h2_first");
			newPath = removeURLParameter(newPath, "has_h2_second");

			if (newPath.includes("?")) newPath += `&has_h1_first=false`;
			else newPath += `?has_h1_first=false`;
		} else if (filterType === "missingFirstH1" && !filterStatus) {
			filterQueryString && filterQueryString.delete("has_h1_first");
			filterQueryString && filterQueryString.delete("page");

			if (newPath.includes("has_h1_first")) {
				newPath = removeURLParameter(newPath, "has_h1_first");
			}

			setMissingFirstH1Filter(false);
		}

		if (filterType === "missingSecondH1" && filterStatus) {
			setMissingTitlesFilter(false);
			setNoIssueFilter(false);
			setMissingDescriptionsFilter(false);
			setMissingFirstH1Filter(false);
			setMissingSecondH1Filter(true);
			setMissingFirstH2Filter(false);
			setMissingSecondH2Filter(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "has_title");
			newPath = removeURLParameter(newPath, "has_description");
			newPath = removeURLParameter(newPath, "has_h1_first");
			newPath = removeURLParameter(newPath, "has_h2_first");
			newPath = removeURLParameter(newPath, "has_h2_second");

			if (newPath.includes("?")) newPath += `&has_h1_second=false`;
			else newPath += `?has_h1_second=false`;
		} else if (filterType === "missingSecondH1" && !filterStatus) {
			filterQueryString && filterQueryString.delete("has_h1_second");
			filterQueryString && filterQueryString.delete("page");

			if (newPath.includes("has_h1_second")) {
				newPath = removeURLParameter(newPath, "has_h1_second");
			}

			setMissingSecondH1Filter(false);
		}

		if (filterType === "missingFirstH2" && filterStatus) {
			setMissingTitlesFilter(false);
			setNoIssueFilter(false);
			setMissingDescriptionsFilter(false);
			setMissingFirstH1Filter(false);
			setMissingSecondH1Filter(false);
			setMissingFirstH2Filter(true);
			setMissingSecondH2Filter(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "has_title");
			newPath = removeURLParameter(newPath, "has_description");
			newPath = removeURLParameter(newPath, "has_h1_first");
			newPath = removeURLParameter(newPath, "has_h1_second");
			newPath = removeURLParameter(newPath, "has_h2_second");

			if (newPath.includes("?")) newPath += `&has_h2_first=false`;
			else newPath += `?has_h2_first=false`;
		} else if (filterType === "missingFirstH2" && !filterStatus) {
			filterQueryString && filterQueryString.delete("has_h2_first");
			filterQueryString && filterQueryString.delete("page");

			if (newPath.includes("has_h2_first")) {
				newPath = removeURLParameter(newPath, "has_h2_first");
			}

			setMissingFirstH2Filter(false);
		}

		if (filterType === "missingSecondH2" && filterStatus) {
			setMissingTitlesFilter(false);
			setNoIssueFilter(false);
			setMissingDescriptionsFilter(false);
			setMissingFirstH1Filter(false);
			setMissingSecondH1Filter(false);
			setMissingFirstH2Filter(false);
			setMissingSecondH2Filter(true);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "has_title");
			newPath = removeURLParameter(newPath, "has_description");
			newPath = removeURLParameter(newPath, "has_h1_first");
			newPath = removeURLParameter(newPath, "has_h1_second");
			newPath = removeURLParameter(newPath, "has_h2_first");

			if (newPath.includes("?")) newPath += `&has_h2_second=false`;
			else newPath += `?has_h2_second=false`;
		} else if (filterType === "missingSecondH2" && !filterStatus) {
			filterQueryString && filterQueryString.delete("has_h2_second");
			filterQueryString && filterQueryString.delete("page");

			if (newPath.includes("has_h2_second")) {
				newPath = removeURLParameter(newPath, "has_h2_second");
			}

			setMissingSecondH2Filter(false);
		}

		if (filterType === "all" && filterStatus) {
			setMissingTitlesFilter(false);
			setNoIssueFilter(false);
			setMissingDescriptionsFilter(false);
			setMissingFirstH1Filter(false);
			setMissingSecondH1Filter(false);
			setMissingFirstH2Filter(false);
			setMissingSecondH2Filter(false);
			setAllFilter(true);

			newPath = removeURLParameter(newPath, "has_title");
			newPath = removeURLParameter(newPath, "has_description");
			newPath = removeURLParameter(newPath, "has_h1_first");
			newPath = removeURLParameter(newPath, "has_h1_second");
			newPath = removeURLParameter(newPath, "has_h2_first");
			newPath = removeURLParameter(newPath, "has_h2_second");
		}

		if (newPath.includes("?")) setPagePath(`${newPath}&`);
		else setPagePath(`${newPath}?`);

		router.push(newPath);

		mutate(scanApiEndpoint);
	};

	React.useEffect(() => {
		if (
			filterQueryString.get("has_title") === "true" &&
			filterQueryString.get("has_description") === "true" &&
			filterQueryString.get("has_h1_first") === "true" &&
			filterQueryString.get("has_h2_first") === "true"
		) {
			setNoIssueFilter(true);
		} else {
			setNoIssueFilter(false);
		}

		if (filterQueryString.get("has_title") === "false") {
			setMissingTitlesFilter(true);
		} else {
			setMissingTitlesFilter(false);
		}

		if (filterQueryString.get("has_description") === "false") {
			setMissingDescriptionsFilter(true);
		} else {
			setMissingDescriptionsFilter(false);
		}

		if (filterQueryString.get("has_h1_first") === "false") {
			setMissingFirstH1Filter(true);
		} else {
			setMissingFirstH1Filter(false);
		}

		if (filterQueryString.get("has_h1_second") === "false") {
			setMissingSecondH1Filter(true);
		} else {
			setMissingSecondH1Filter(false);
		}

		if (filterQueryString.get("has_h2_first") === "false") {
			setMissingFirstH2Filter(true);
		} else {
			setMissingFirstH2Filter(false);
		}

		if (filterQueryString.get("has_h2_second") === "false") {
			setMissingSecondH2Filter(true);
		} else {
			setMissingSecondH2Filter(false);
		}

		if (
			!filterQueryString.has("has_title") &&
			!filterQueryString.has("has_description") &&
			!filterQueryString.has("has_h1_first") &&
			!filterQueryString.has("has_h1_second") &&
			!filterQueryString.has("has_h2_first") &&
			!filterQueryString.has("has_h2_second")
		) {
			setAllFilter(true);
		} else {
			setAllFilter(false);
		}

		return {
			noIssueFilter,
			missingTitlesFilter,
			missingDescriptionsFilter,
			missingFirstH1Filter,
			missingSecondH1Filter,
			missingFirstH2Filter,
			missingSecondH2Filter,
			allFilter
		};
	});

	return (
		<div tw="pb-4 bg-white">
			<div tw="px-4 py-5 border border-gray-300 sm:px-6 bg-white rounded-lg lg:flex lg:justify-between">
				<div tw="-ml-4 lg:-mt-2 lg:flex items-center flex-wrap sm:flex-nowrap">
					<h4 tw="ml-4 mb-4 lg:mb-0 mt-2 mr-1 text-base leading-4 font-semibold text-gray-600">
						{SeoFilterLabels[0].label}
					</h4>
					{SeoFilters.filter((e) => e.value !== "noIssues").map((value, key) => {
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
					{SeoFilters.filter((e) => e.value === "noIssues").map((value, key) => {
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

SeoFilter.propTypes = {
	filterQueryString: PropTypes.object,
	scanApiEndpoint: PropTypes.string,
	setPagePath: PropTypes.func
};

SeoFilter.defaultProps = {
	filterQueryString: null,
	scanApiEndpoint: null,
	setPagePath: null
};

export default SeoFilter;
