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

const ImageFilter = ({ loadQueryString, scanApiEndpoint, setPagePath }) => {
	const [allFilter, setAllFilter] = React.useState(false);
	const [imageBrokenSecurityFilter, setImageBrokenSecurityFilter] = React.useState(false);
	const [imageMissingAltsFilter, setImageMissingAltsFilter] = React.useState(false);
	const [imageNotWorkingFilter, setImageNotWorkingFilter] = React.useState(false);
	const [noIssueFilter, setNoIssueFilter] = React.useState(false);

	const filterQueryString = new URLSearchParams(window.location.search);

	const { asPath } = useRouter();
	const router = useRouter();

	const handleFilter = async (e) => {
		const filterType = e.target.value;
		const filterStatus = e.target.checked;

		let newPath = asPath;
		newPath = removeURLParameter(newPath, "page");

		if (filterType === "notWorking" && filterStatus) {
			setImageNotWorkingFilter(true);
			setImageBrokenSecurityFilter(false);
			setImageMissingAltsFilter(false);
			setNoIssueFilter(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "status");
			newPath = removeURLParameter(newPath, "tls_status");
			newPath = removeURLParameter(newPath, "tls_status__neq");
			newPath = removeURLParameter(newPath, "missing_alts__gt");
			newPath = removeURLParameter(newPath, "missing_alts__iszero");

			if (newPath.includes("?")) newPath += `&status__neq=OK`;
			else newPath += `?status__neq=OK`;
		} else if (filterType === "notWorking" && !filterStatus) {
			loadQueryString && loadQueryString.delete("status__neq");
			loadQueryString && loadQueryString.delete("page");

			if (newPath.includes("status__neq")) {
				newPath = removeURLParameter(newPath, "status__neq");
			}

			setImageNotWorkingFilter(false);
		}

		if (filterType === "no-issues" && filterStatus) {
			setImageNotWorkingFilter(false);
			setImageBrokenSecurityFilter(false);
			setImageMissingAltsFilter(false);
			setNoIssueFilter(true);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "status__neq");
			newPath = removeURLParameter(newPath, "tls_status__neq");
			newPath = removeURLParameter(newPath, "missing_alts__gt");

			if (newPath.includes("?")) newPath += `&status=OK&tls_status=OK&missing_alts__iszero=true`;
			else newPath += `?status=OK&tls_status=OK&missing_alts__iszero=true`;
		} else if (filterType === "no-issues" && !filterStatus) {
			loadQueryString && loadQueryString.delete("status");
			loadQueryString && loadQueryString.delete("missing_alts__iszero");
			loadQueryString && loadQueryString.delete("tls_status");
			loadQueryString && loadQueryString.delete("page");

			if (newPath.includes("status")) {
				newPath = removeURLParameter(newPath, "status");
			}

			if (newPath.includes("missing_alts__iszero")) {
				newPath = removeURLParameter(newPath, "missing_alts__iszero");
			}

			if (newPath.includes("tls_status")) {
				newPath = removeURLParameter(newPath, "tls_status");
			}

			setNoIssueFilter(false);
		}

		if (filterType === "brokenSecurity" && filterStatus) {
			setImageNotWorkingFilter(false);
			setImageBrokenSecurityFilter(true);
			setImageMissingAltsFilter(false);
			setNoIssueFilter(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "status");
			newPath = removeURLParameter(newPath, "status__neq");
			newPath = removeURLParameter(newPath, "tls_status");
			newPath = removeURLParameter(newPath, "missing_alts__gt");
			newPath = removeURLParameter(newPath, "missing_alts__iszero");

			if (newPath.includes("?")) newPath += `&tls_status__neq=OK`;
			else newPath += `?tls_status__neq=OK`;
		} else if (filterType === "brokenSecurity" && !filterStatus) {
			loadQueryString && loadQueryString.delete("tls_status__neq");
			loadQueryString && loadQueryString.delete("page");

			if (newPath.includes("tls_status__neq")) {
				newPath = removeURLParameter(newPath, "tls_status__neq");
			}

			setImageBrokenSecurityFilter(false);
		}

		if (filterType === "missingAlts" && filterStatus) {
			setImageNotWorkingFilter(false);
			setImageBrokenSecurityFilter(false);
			setImageMissingAltsFilter(true);
			setNoIssueFilter(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "status");
			newPath = removeURLParameter(newPath, "status__neq");
			newPath = removeURLParameter(newPath, "tls_status");
			newPath = removeURLParameter(newPath, "tls_status__neq");
			newPath = removeURLParameter(newPath, "missing_alts__iszero");

			if (newPath.includes("?")) newPath += `&missing_alts__gt=0`;
			else newPath += `?missing_alts__gt=0`;
		} else if (filterType === "missingAlts" && !filterStatus) {
			loadQueryString && loadQueryString.delete("missing_alts__gt");
			loadQueryString && loadQueryString.delete("page");

			if (newPath.includes("missing_alts__gt")) {
				newPath = removeURLParameter(newPath, "missing_alts__gt");
			}

			setImageMissingAltsFilter(false);
		}

		if (filterType == "all" && filterStatus) {
			setImageNotWorkingFilter(false);
			setImageBrokenSecurityFilter(false);
			setImageMissingAltsFilter(false);
			setNoIssueFilter(false);
			setAllFilter(true);

			newPath = removeURLParameter(newPath, "status");
			newPath = removeURLParameter(newPath, "status__neq");
			newPath = removeURLParameter(newPath, "tls_status");
			newPath = removeURLParameter(newPath, "tls_status__neq");
			newPath = removeURLParameter(newPath, "missing_alts__gt");
			newPath = removeURLParameter(newPath, "missing_alts__iszero");
		}

		if (newPath.includes("?")) setPagePath(`${newPath}&`);
		else setPagePath(`${newPath}?`);

		router.push(newPath);

		mutate(scanApiEndpoint);
	};

	React.useEffect(() => {
		if (filterQueryString.get("status__neq") === "OK") {
			setImageNotWorkingFilter(true);
		} else {
			setImageNotWorkingFilter(false);
		}

		if (
			filterQueryString.get("status") === "OK" &&
			filterQueryString.get("tls_status") === "OK" &&
			filterQueryString.get("missing_alts__iszero") === "true"
		) {
			setNoIssueFilter(true);
		} else {
			setNoIssueFilter(false);
		}

		if (filterQueryString.get("tls_status__neq") === "OK") {
			setImageBrokenSecurityFilter(true);
		} else {
			setImageBrokenSecurityFilter(false);
		}

		if (filterQueryString.get("missing_alts__gt") === "0") {
			setImageMissingAltsFilter(true);
		} else {
			setImageMissingAltsFilter(false);
		}

		if (
			!filterQueryString.has("status") &&
			!filterQueryString.has("status__neq") &&
			!filterQueryString.has("tls_status") &&
			!filterQueryString.has("tls_status__neq") &&
			!filterQueryString.has("missing_alts__gt") &&
			!filterQueryString.has("missing_alts__iszero")
		) {
			setAllFilter(true);
		} else {
			setAllFilter(false);
		}

		return {
			imageNotWorkingFilter,
			imageBrokenSecurityFilter,
			imageMissingAltsFilter,
			noIssueFilter,
			allFilter
		};
	});

	return (
		<div tw="lg:pb-4 bg-white">
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
									All Images
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
									checked={imageNotWorkingFilter}
									value="notWorking"
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">
									Broken Images
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
									checked={imageBrokenSecurityFilter}
									value="brokenSecurity"
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">
									Broken Security
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
									checked={imageMissingAltsFilter}
									value="missingAlts"
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">
									Missing Alts
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

ImageFilter.propTypes = {
	loadQueryString: PropTypes.string,
	scanApiEndpoint: PropTypes.string,
	setPagePath: PropTypes.func
};

ImageFilter.defaultProps = {
	loadQueryString: null,
	scanApiEndpoint: null,
	setPagePath: null
};

export default ImageFilter;
