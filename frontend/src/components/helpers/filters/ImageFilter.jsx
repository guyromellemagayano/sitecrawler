// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";

// External
import "twin.macro";

// Helpers
import { removeURLParameter } from "src/helpers/functions";

const ImageFilter = ({ result, loadQueryString, setLoadQueryString, mutateImages, setPagePath }) => {
	const [allFilter, setAllFilter] = React.useState(false);
	const [imageBrokenSecurityFilter, setImageBrokenSecurityFilter] = React.useState(false);
	const [imageMissingAltsFilter, setImageMissingAltsFilter] = React.useState(false);
	const [imageNotWorkingFilter, setImageNotWorkingFilter] = React.useState(false);
	const [noIssueFilter, setNoIssueFilter] = React.useState(false);

	const { asPath } = useRouter();
	const router = useRouter();

	const handleFilter = async (e) => {
		const filterType = e.target.value;
		const filterStatus = e.target.checked;

		let newPath = asPath;
		newPath = removeURLParameter(newPath, "page");

		if (filterType === "notWorking" && filterStatus == true) {
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
		} else if (filterType === "notWorking" && filterStatus == false) {
			loadQueryString && loadQueryString.delete("status__neq");
			loadQueryString && loadQueryString.delete("page");

			if (newPath.includes("status__neq")) {
				newPath = removeURLParameter(newPath, "status__neq");
			}

			setImageNotWorkingFilter(false);
		}

		if (filterType === "no-issues" && filterStatus == true) {
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
		} else if (filterType === "no-issues" && filterStatus == false) {
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

		if (filterType === "brokenSecurity" && filterStatus == true) {
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
		} else if (filterType === "brokenSecurity" && filterStatus == false) {
			loadQueryString && loadQueryString.delete("tls_status__neq");
			loadQueryString && loadQueryString.delete("page");

			if (newPath.includes("tls_status__neq")) {
				newPath = removeURLParameter(newPath, "tls_status__neq");
			}

			setImageBrokenSecurityFilter(false);
		}

		if (filterType === "missingAlts" && filterStatus == true) {
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
		} else if (filterType === "missingAlts" && filterStatus == false) {
			loadQueryString && loadQueryString.delete("missing_alts__gt");
			loadQueryString && loadQueryString.delete("page");

			if (newPath.includes("missing_alts__gt")) {
				newPath = removeURLParameter(newPath, "missing_alts__gt");
			}

			setImageMissingAltsFilter(false);
		}

		if (filterType === "all" && filterStatus == true) {
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
		mutateImages;
	};

	React.useEffect(() => {
		setLoadQueryString(new URLSearchParams(window.location.search));

		let loadQueryStringValue = new URLSearchParams(window.location.search);

		if (loadQueryStringValue.get("status__neq") === "OK") {
			setImageNotWorkingFilter(true);
			setImageBrokenSecurityFilter(false);
			setImageMissingAltsFilter(false);
			setAllFilter(false);
			setNoIssueFilter(false);
		}

		if (
			loadQueryStringValue.get("status") === "OK" &&
			loadQueryStringValue.get("tls_status") === "OK" &&
			loadQueryStringValue.get("missing_alts__iszero") === "true"
		) {
			setImageNotWorkingFilter(false);
			setImageBrokenSecurityFilter(false);
			setImageMissingAltsFilter(false);
			setAllFilter(false);
			setNoIssueFilter(true);
		}

		if (loadQueryStringValue.get("tls_status__neq") === "OK") {
			setImageNotWorkingFilter(false);
			setImageBrokenSecurityFilter(true);
			setImageMissingAltsFilter(false);
			setAllFilter(false);
			setNoIssueFilter(false);
		}

		if (loadQueryStringValue.get("missing_alts__gt") === "0") {
			setImageNotWorkingFilter(false);
			setImageBrokenSecurityFilter(false);
			setImageMissingAltsFilter(true);
			setAllFilter(false);
			setNoIssueFilter(false);
		}

		if (
			!loadQueryStringValue.has("status") &&
			!loadQueryStringValue.has("status__neq") &&
			!loadQueryStringValue.has("tls_status") &&
			!loadQueryStringValue.has("tls_status__neq") &&
			!loadQueryStringValue.has("missing_alts__gt") &&
			!loadQueryStringValue.has("missing_alts__iszero")
		) {
			setImageNotWorkingFilter(false);
			setImageBrokenSecurityFilter(false);
			setImageMissingAltsFilter(false);
			setAllFilter(true);
			setNoIssueFilter(false);
		}
	}, []);

	React.useEffect(() => {
		if (
			result.status__neq !== undefined &&
			result.status == undefined &&
			result.tls_status == undefined &&
			result.tls_status__neq == undefined &&
			result.missing_alts__iszero == undefined &&
			result.missing_alts__gt == undefined
		) {
			setImageNotWorkingFilter(true);
			setImageBrokenSecurityFilter(false);
			setImageMissingAltsFilter(false);
			setNoIssueFilter(false);
			setAllFilter(false);
		}

		if (
			result.status__neq == undefined &&
			result.status === undefined &&
			result.tls_status == undefined &&
			result.tls_status__neq !== undefined &&
			result.missing_alts__iszero == undefined &&
			result.missing_alts__gt == undefined
		) {
			setImageNotWorkingFilter(false);
			setImageBrokenSecurityFilter(true);
			setImageMissingAltsFilter(false);
			setNoIssueFilter(false);
			setAllFilter(false);
		}

		if (
			result.status__neq == undefined &&
			result.status == undefined &&
			result.tls_status == undefined &&
			result.tls_status__neq == undefined &&
			result.missing_alts__iszero == undefined &&
			result.missing_alts__gt !== undefined
		) {
			setImageNotWorkingFilter(false);
			setImageBrokenSecurityFilter(false);
			setImageMissingAltsFilter(true);
			setNoIssueFilter(false);
			setAllFilter(false);
		}

		if (
			result.status__neq == undefined &&
			result.status !== undefined &&
			result.tls_status !== undefined &&
			result.tls_status__neq == undefined &&
			result.missing_alts__iszero !== undefined &&
			result.missing_alts__gt == undefined
		) {
			setImageNotWorkingFilter(false);
			setImageBrokenSecurityFilter(false);
			setImageMissingAltsFilter(false);
			setNoIssueFilter(true);
			setAllFilter(false);
		}

		if (loadQueryString && loadQueryString !== undefined && loadQueryString.toString().length === 0) {
			if (
				result.status == undefined &&
				result.status__neq == undefined &&
				result.tls_status == undefined &&
				result.tls_status__neq == undefined &&
				result.missing_alts__iszero == undefined &&
				result.missing_alts__gt == undefined
			) {
				setImageNotWorkingFilter(false);
				setImageBrokenSecurityFilter(false);
				setImageMissingAltsFilter(false);
				setNoIssueFilter(false);
				setAllFilter(true);
			}
		}
	}, [handleFilter, loadQueryString]);

	return (
		<div tw="lg:sticky z-10 top-0 pb-4 bg-white">
			<div tw="px-4 py-5 border border-gray-300 sm:px-6 bg-white rounded-lg lg:flex lg:justify-between">
				<div tw="-ml-4 lg:-mt-2 lg:flex items-center flex-wrap sm:flex-nowrap">
					<h4 tw="ml-4 mb-4 lg:mb-0 mt-2 mr-1 text-base leading-4 font-semibold text-gray-600">Filter</h4>
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
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">All Images</span>
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
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">Broken Images</span>
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
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">Broken Security</span>
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
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">Missing Alts</span>
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
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">No Issues</span>
							</label>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

ImageFilter.propTypes = {};

export default ImageFilter;
