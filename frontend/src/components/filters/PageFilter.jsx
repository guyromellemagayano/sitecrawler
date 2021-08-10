// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";

// External
import "twin.macro";
import { mutate } from "swr";
import PropTypes from "prop-types";

// Helpers
import { removeURLParameter } from "@utils/functions";

const PageFilter = ({
	result,
	loadQueryString,
	handleLoadQueryString,
	scanApiEndpoint,
	setPagePath
}) => {
	const [allFilter, setAllFilter] = React.useState(false);
	const [brokenSecurityFilter, setBrokenSecurityFilter] = React.useState(false);
	const [largePageSizeFilter, setLargePageSizeFilter] = React.useState(false);
	const [noIssueFilter, setNoIssueFilter] = React.useState(false);

	const { asPath } = useRouter();
	const router = useRouter();

	const handleFilter = async (e) => {
		const filterType = e.target.value;
		const filterStatus = e.target.checked;

		let newPath = asPath;
		newPath = removeURLParameter(newPath, "page");

		if (filterType == "no-issues" && filterStatus == true) {
			setNoIssueFilter(true);
			setLargePageSizeFilter(false);
			setBrokenSecurityFilter(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "size_total_max");
			newPath = removeURLParameter(newPath, "size_total_min");
			newPath = removeURLParameter(newPath, "tls_total");

			if (newPath.includes("?")) newPath += `&size_total_max=1048575&tls_total=true`;
			else newPath += `?size_total_max=1048575&tls_total=true`;
		} else if (filterType == "no-issues" && filterStatus == false) {
			loadQueryString && loadQueryString.delete("size_total_max");
			// loadQueryString && loadQueryString.delete('size_total_min');
			loadQueryString && loadQueryString.delete("tls_total");
			loadQueryString && loadQueryString.delete("page");

			if (
				newPath.includes("size_total_max") &&
				newPath.includes("tls_total")
				// newPath.includes('size_total_min')
			) {
				newPath = removeURLParameter(newPath, "size_total_max");
				// newPath = removeURLParameter(newPath, 'size_total_min');
				newPath = removeURLParameter(newPath, "tls_total");
			}

			setNoIssueFilter(false);
		}

		if (filterType == "pageLargePages" && filterStatus == true) {
			setLargePageSizeFilter(true);
			setNoIssueFilter(false);
			setBrokenSecurityFilter(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "size_total_max");
			newPath = removeURLParameter(newPath, "size_total_min");
			newPath = removeURLParameter(newPath, "tls_total");

			if (newPath.includes("?")) newPath += `&size_total_min=1048576`;
			else newPath += `?size_total_min=1048576`;
		} else if (filterType == "pageLargePages" && filterStatus == false) {
			loadQueryString && loadQueryString.delete("size_total_min");
			loadQueryString && loadQueryString.delete("page");

			if (newPath.includes("size_total_min")) {
				newPath = removeURLParameter(newPath, "size_total_min");
			}

			setLargePageSizeFilter(false);
		}

		if (filterType == "pageBrokenSecurity" && filterStatus == true) {
			setBrokenSecurityFilter(true);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "size_total_min");
			newPath = removeURLParameter(newPath, "size_total_max");
			newPath = removeURLParameter(newPath, "tls_total");

			if (newPath.includes("?")) newPath += `&tls_total=false`;
			else newPath += `?tls_total=false`;
		} else if (filterType == "pageBrokenSecurity" && filterStatus == false) {
			loadQueryString && loadQueryString.delete("tls_total");
			loadQueryString && loadQueryString.delete("size_total_min");
			loadQueryString && loadQueryString.delete("size_total_max");
			loadQueryString && loadQueryString.delete("page");

			if (newPath.includes("tls_total")) {
				newPath = removeURLParameter(newPath, "size_total_max");
				newPath = removeURLParameter(newPath, "size_total_min");
				newPath = removeURLParameter(newPath, "tls_total");
			}

			setBrokenSecurityFilter(false);
		}

		if (filterType == "all" && filterStatus == true) {
			setNoIssueFilter(false);
			setLargePageSizeFilter(false);
			setBrokenSecurityFilter(false);
			setAllFilter(true);

			newPath = removeURLParameter(newPath, "size_total_min");
			newPath = removeURLParameter(newPath, "size_total_max");
			newPath = removeURLParameter(newPath, "tls_total");
		}

		if (newPath.includes("?")) setPagePath(`${newPath}&`);
		else setPagePath(`${newPath}?`);

		router.push(newPath);
		mutate(scanApiEndpoint);
	};

	React.useEffect(() => {
		let loadQueryStringValue = new URLSearchParams(window.location.search);

		handleLoadQueryString;

		if (loadQueryStringValue.has("size_total_min")) {
			setLargePageSizeFilter(true);
			setAllFilter(false);
			setNoIssueFilter(false);
			setBrokenSecurityFilter(false);
		}

		if (loadQueryStringValue.get("tls_total") === "false") {
			setBrokenSecurityFilter(true);
			setLargePageSizeFilter(false);
			setAllFilter(false);
			setNoIssueFilter(false);
		}

		if (
			loadQueryStringValue.has("size_total_max") &&
			loadQueryStringValue.get("tls_total") === "true"
		) {
			setBrokenSecurityFilter(false);
			setLargePageSizeFilter(false);
			setAllFilter(false);
			setNoIssueFilter(true);
		}

		if (
			!loadQueryStringValue.has("size_total_max") &&
			!loadQueryStringValue.has("size_total_min") &&
			!loadQueryStringValue.has("tls_total")
		) {
			setLargePageSizeFilter(false);
			setBrokenSecurityFilter(false);
			setNoIssueFilter(false);
			setAllFilter(true);
		}
	}, []);

	React.useEffect(() => {
		if (
			result.size_total_max !== undefined &&
			result.tls_total !== undefined &&
			result.tls_total == "true"
		) {
			loadQueryString && loadQueryString.delete("size_total_min");

			setNoIssueFilter(true);
			setBrokenSecurityFilter(false);
			setLargePageSizeFilter(false);
			setAllFilter(false);
		}

		if (result.size_total_min !== undefined) {
			loadQueryString && loadQueryString.delete("size_total_max");
			loadQueryString && loadQueryString.delete("tls_total");

			setNoIssueFilter(false);
			setBrokenSecurityFilter(false);
			setLargePageSizeFilter(true);
			setAllFilter(false);
		}

		if (result.tls_total !== undefined && result.tls_total == "false") {
			setNoIssueFilter(false);
			setBrokenSecurityFilter(true);
			setLargePageSizeFilter(false);
			setAllFilter(false);
		}

		if (
			loadQueryString &&
			loadQueryString !== undefined &&
			loadQueryString.toString().length === 0
		) {
			if (
				result.size_total_max == undefined &&
				result.size_total_min == undefined &&
				result.tls_total == undefined
			) {
				setLargePageSizeFilter(false);
				setNoIssueFilter(false);
				setBrokenSecurityFilter(false);
				setAllFilter(true);
			}
		}
	}, [handleFilter, loadQueryString]);

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
									checked={largePageSizeFilter}
									value="pageLargePages"
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">
									Large Page Size
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
									checked={brokenSecurityFilter}
									value="pageBrokenSecurity"
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">
									Broken Security
								</span>
							</label>
						</div>
					</div>
				</div>
				<div tw="lg:-mt-2 lg:flex items-center justify-end flex-wrap sm:flex-nowrap">
					<div tw="mt-2">
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

PageFilter.propTypes = {
	handleLoadQueryString: PropTypes.func,
	result: PropTypes.shape({
		size_total_max: PropTypes.number,
		size_total_min: PropTypes.number,
		tls_total: PropTypes.string
	}),
	scanApiEndpoint: PropTypes.string,
	setPagePath: PropTypes.func
};

PageFilter.defaultProps = {
	handleLoadQueryString: null,
	result: {
		size_total_max: null,
		size_total_min: null,
		tls_total: null
	},
	scanApiEndpoint: null,
	setPagePath: null
};

export default PageFilter;
