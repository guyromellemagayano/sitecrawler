// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";

// External
import "twin.macro";
import { mutate } from "swr";
import PropTypes from "prop-types";

// Utils
import { removeURLParameter } from "@utils/functions";

const SeoFilter = ({ loadQueryString, scanApiEndpoint, setPagePath }) => {
	const [allFilter, setAllFilter] = React.useState(false);
	const [noDescription, setNoDescription] = React.useState(false);
	const [noH1First, setNoH1First] = React.useState(false);
	const [noH1Second, setNoH1Second] = React.useState(false);
	const [noH2First, setNoH2First] = React.useState(false);
	const [noH2Second, setNoH2Second] = React.useState(false);
	const [noIssueFilter, setNoIssueFilter] = React.useState(false);
	const [noTitle, setNoTitle] = React.useState(false);

	const filterQueryString = new URLSearchParams(window.location.search);

	const { asPath } = useRouter();
	const router = useRouter();

	const handleFilter = async (e) => {
		const filterType = e.target.value;
		const filterStatus = e.target.checked;

		let newPath = asPath;
		newPath = removeURLParameter(newPath, "page");

		if (filterType === "no-issues" && filterStatus) {
			setNoTitle(false);
			setNoIssueFilter(true);
			setNoDescription(false);
			setNoH1First(false);
			setNoH1Second(false);
			setNoH2First(false);
			setNoH2Second(false);
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
		} else if (filterType === "no-issues" && !filterStatus) {
			loadQueryString && loadQueryString.delete("has_title");
			loadQueryString && loadQueryString.delete("has_description");
			loadQueryString && loadQueryString.delete("has_h1_first");
			loadQueryString && loadQueryString.delete("has_h2_first");
			loadQueryString && loadQueryString.delete("page");

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

		if (filterType === "noTitle" && filterStatus) {
			setNoTitle(true);
			setNoIssueFilter(false);
			setNoDescription(false);
			setNoH1First(false);
			setNoH1Second(false);
			setNoH2First(false);
			setNoH2Second(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "has_description");
			newPath = removeURLParameter(newPath, "has_h1_first");
			newPath = removeURLParameter(newPath, "has_h1_second");
			newPath = removeURLParameter(newPath, "has_h2_first");
			newPath = removeURLParameter(newPath, "has_h2_second");

			if (newPath.includes("?")) newPath += `&has_title=false`;
			else newPath += `?has_title=false`;
		} else if (filterType === "noTitle" && !filterStatus) {
			loadQueryString && loadQueryString.delete("has_title");
			loadQueryString && loadQueryString.delete("page");

			if (newPath.includes("has_title")) {
				newPath = removeURLParameter(newPath, "has_title");
			}

			setNoTitle(false);
		}

		if (filterType === "noDescription" && filterStatus) {
			setNoTitle(false);
			setNoIssueFilter(false);
			setNoDescription(true);
			setNoH1First(false);
			setNoH1Second(false);
			setNoH2First(false);
			setNoH2Second(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "has_title");
			newPath = removeURLParameter(newPath, "has_h1_first");
			newPath = removeURLParameter(newPath, "has_h1_second");
			newPath = removeURLParameter(newPath, "has_h2_first");
			newPath = removeURLParameter(newPath, "has_h2_second");

			if (newPath.includes("?")) newPath += `&has_description=false`;
			else newPath += `?has_description=false`;
		} else if (filterType === "noDescription" && !filterStatus) {
			loadQueryString && loadQueryString.delete("has_description");
			loadQueryString && loadQueryString.delete("page");

			if (newPath.includes("has_description")) {
				newPath = removeURLParameter(newPath, "has_description");
			}

			setNoDescription(false);
		}

		if (filterType === "noH1First" && filterStatus) {
			setNoTitle(false);
			setNoIssueFilter(false);
			setNoDescription(false);
			setNoH1First(true);
			setNoH1Second(false);
			setNoH2First(false);
			setNoH2Second(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "has_title");
			newPath = removeURLParameter(newPath, "has_description");
			newPath = removeURLParameter(newPath, "has_h1_second");
			newPath = removeURLParameter(newPath, "has_h2_first");
			newPath = removeURLParameter(newPath, "has_h2_second");

			if (newPath.includes("?")) newPath += `&has_h1_first=false`;
			else newPath += `?has_h1_first=false`;
		} else if (filterType === "noH1First" && !filterStatus) {
			loadQueryString && loadQueryString.delete("has_h1_first");
			loadQueryString && loadQueryString.delete("page");

			if (newPath.includes("has_h1_first")) {
				newPath = removeURLParameter(newPath, "has_h1_first");
			}

			setNoH1First(false);
		}

		if (filterType === "noH1Second" && filterStatus) {
			setNoTitle(false);
			setNoIssueFilter(false);
			setNoDescription(false);
			setNoH1First(false);
			setNoH1Second(true);
			setNoH2First(false);
			setNoH2Second(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "has_title");
			newPath = removeURLParameter(newPath, "has_description");
			newPath = removeURLParameter(newPath, "has_h1_first");
			newPath = removeURLParameter(newPath, "has_h2_first");
			newPath = removeURLParameter(newPath, "has_h2_second");

			if (newPath.includes("?")) newPath += `&has_h1_second=false`;
			else newPath += `?has_h1_second=false`;
		} else if (filterType === "noH1Second" && !filterStatus) {
			loadQueryString && loadQueryString.delete("has_h1_second");
			loadQueryString && loadQueryString.delete("page");

			if (newPath.includes("has_h1_second")) {
				newPath = removeURLParameter(newPath, "has_h1_second");
			}

			setNoH1Second(false);
		}

		if (filterType === "noH2First" && filterStatus) {
			setNoTitle(false);
			setNoIssueFilter(false);
			setNoDescription(false);
			setNoH1First(false);
			setNoH1Second(false);
			setNoH2First(true);
			setNoH2Second(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "has_title");
			newPath = removeURLParameter(newPath, "has_description");
			newPath = removeURLParameter(newPath, "has_h1_first");
			newPath = removeURLParameter(newPath, "has_h1_second");
			newPath = removeURLParameter(newPath, "has_h2_second");

			if (newPath.includes("?")) newPath += `&has_h2_first=false`;
			else newPath += `?has_h2_first=false`;
		} else if (filterType === "noH2First" && !filterStatus) {
			loadQueryString && loadQueryString.delete("has_h2_first");
			loadQueryString && loadQueryString.delete("page");

			if (newPath.includes("has_h2_first")) {
				newPath = removeURLParameter(newPath, "has_h2_first");
			}

			setNoH2First(false);
		}

		if (filterType === "noH2Second" && filterStatus) {
			setNoTitle(false);
			setNoIssueFilter(false);
			setNoDescription(false);
			setNoH1First(false);
			setNoH1Second(false);
			setNoH2First(false);
			setNoH2Second(true);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "has_title");
			newPath = removeURLParameter(newPath, "has_description");
			newPath = removeURLParameter(newPath, "has_h1_first");
			newPath = removeURLParameter(newPath, "has_h1_second");
			newPath = removeURLParameter(newPath, "has_h2_first");

			if (newPath.includes("?")) newPath += `&has_h2_second=false`;
			else newPath += `?has_h2_second=false`;
		} else if (filterType === "noH2Second" && !filterStatus) {
			loadQueryString && loadQueryString.delete("has_h2_second");
			loadQueryString && loadQueryString.delete("page");

			if (newPath.includes("has_h2_second")) {
				newPath = removeURLParameter(newPath, "has_h2_second");
			}

			setNoH2Second(false);
		}

		if (filterType === "all" && filterStatus) {
			setNoTitle(false);
			setNoIssueFilter(false);
			setNoDescription(false);
			setNoH1First(false);
			setNoH1Second(false);
			setNoH2First(false);
			setNoH2Second(false);
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
			setNoTitle(true);
		} else {
			setNoTitle(false);
		}

		if (filterQueryString.get("has_description") === "false") {
			setNoDescription(true);
		} else {
			setNoDescription(false);
		}

		if (filterQueryString.get("has_h1_first") === "false") {
			setNoH1First(true);
		} else {
			setNoH1First(false);
		}

		if (filterQueryString.get("has_h1_second") === "false") {
			setNoH1Second(true);
		} else {
			setNoH1Second(false);
		}

		if (filterQueryString.get("has_h2_first") === "false") {
			setNoH2First(true);
		} else {
			setNoH2First(false);
		}

		if (filterQueryString.get("has_h2_second") === "false") {
			setNoH2Second(true);
		} else {
			setNoH2Second(false);
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
			noTitle,
			noDescription,
			noH1First,
			noH1Second,
			noH2First,
			noH2Second,
			allFilter
		};
	});

	return (
		<div tw="pb-4 bg-white">
			<div tw="px-4 py-5 border border-gray-300 sm:px-6 bg-white rounded-lg lg:flex lg:justify-between">
				<div tw="-ml-4 lg:-mt-2 lg:flex items-center flex-wrap sm:flex-nowrap">
					<h4 tw="ml-4 mb-4 lg:mb-0 mt-2 mr-1 text-base leading-4 font-semibold text-gray-600">
						Filter
					</h4>
					<div tw="ml-4 mt-2 mr-2">
						<div>
							<label tw="flex items-center">
								<input
									type="checkbox"
									tw="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
									onChange={handleFilter}
									checked={allFilter}
									value="all"
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">
									All Pages
								</span>
							</label>
						</div>
					</div>
					<div tw="ml-4 mt-2 mr-2">
						<div>
							<label tw="flex items-center">
								<input
									type="checkbox"
									tw="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
									onChange={handleFilter}
									checked={noTitle}
									value="noTitle"
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">
									Without Title
								</span>
							</label>
						</div>
					</div>
					<div tw="ml-4 mt-2 mr-2">
						<div>
							<label tw="flex items-center">
								<input
									type="checkbox"
									tw="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
									onChange={handleFilter}
									checked={noDescription}
									value="noDescription"
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">
									Without Description
								</span>
							</label>
						</div>
					</div>
					<div tw="ml-4 mt-2 mr-2">
						<div>
							<label tw="flex items-center">
								<input
									type="checkbox"
									tw="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
									onChange={handleFilter}
									checked={noH1First}
									value="noH1First"
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">
									Without First H1
								</span>
							</label>
						</div>
					</div>
					<div tw="ml-4 mt-2 mr-2">
						<div>
							<label tw="flex items-center">
								<input
									type="checkbox"
									tw="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
									onChange={handleFilter}
									checked={noH1Second}
									value="noH1Second"
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">
									Without Second H1
								</span>
							</label>
						</div>
					</div>
					<div tw="ml-4 mt-2 mr-2">
						<div>
							<label tw="flex items-center">
								<input
									type="checkbox"
									tw="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
									onChange={handleFilter}
									checked={noH2First}
									value="noH2First"
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">
									Without First H2
								</span>
							</label>
						</div>
					</div>
					<div tw="ml-4 mt-2 mr-2">
						<div>
							<label tw="flex items-center">
								<input
									type="checkbox"
									tw="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
									onChange={handleFilter}
									checked={noH2Second}
									value="noH2Second"
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">
									Without Second H2
								</span>
							</label>
						</div>
					</div>
				</div>
				<div
					className={`lg:-mt-2 lg:flex items-center align-end justify-end flex-end flex-wrap sm:flex-nowrap`}
				>
					<div className={`mt-2`}>
						<div>
							<label tw="flex items-center">
								<input
									type="checkbox"
									tw="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
									onChange={handleFilter}
									checked={noIssueFilter}
									value="no-issues"
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">
									No Issues
								</span>
							</label>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

SeoFilter.propTypes = {
	loadQueryString: PropTypes.string,
	scanApiEndpoint: PropTypes.string,
	setPagePath: PropTypes.func
};

SeoFilter.defaultProps = {
	loadQueryString: null,
	scanApiEndpoint: null,
	setPagePath: null
};

export default SeoFilter;
