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

const ImageFilter = ({ filterQueryString, scanApiEndpoint, setPagePath }) => {
	const [allFilter, setAllFilter] = React.useState(false);
	const [unsecuredImagesFilter, setUnsecuredImagesFilter] = React.useState(false);
	const [missingAltsFilter, setMissingAltsFilter] = React.useState(false);
	const [brokenImagesFilter, setBrokenImagesFilter] = React.useState(false);
	const [noIssueFilter, setNoIssueFilter] = React.useState(false);

	const { asPath } = useRouter();
	const router = useRouter();

	const ImageFilters = [
		{
			label: "All Images",
			checked: allFilter,
			value: "all"
		},
		{
			label: "Broken Images",
			checked: brokenImagesFilter,
			value: "brokenImages"
		},
		{
			label: "Unsecured Images",
			checked: unsecuredImagesFilter,
			value: "unsecuredImages"
		},
		{
			label: "Missing Alts",
			checked: missingAltsFilter,
			value: "missingAlts"
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

		if (filterType === "brokenImages" && filterStatus) {
			setBrokenImagesFilter(true);
			setUnsecuredImagesFilter(false);
			setMissingAltsFilter(false);
			setNoIssueFilter(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "status");
			newPath = removeURLParameter(newPath, "tls_status");
			newPath = removeURLParameter(newPath, "tls_status__neq");
			newPath = removeURLParameter(newPath, "missing_alts__gt");
			newPath = removeURLParameter(newPath, "missing_alts__iszero");

			if (newPath.includes("?")) newPath += `&status__neq=OK`;
			else newPath += `?status__neq=OK`;
		} else if (filterType === "brokenImages" && !filterStatus) {
			filterQueryString && filterQueryString.delete("status__neq");
			filterQueryString && filterQueryString.delete("page");

			if (newPath.includes("status__neq")) {
				newPath = removeURLParameter(newPath, "status__neq");
			}

			setBrokenImagesFilter(false);
		}

		if (filterType === "noIssues" && filterStatus) {
			setBrokenImagesFilter(false);
			setUnsecuredImagesFilter(false);
			setMissingAltsFilter(false);
			setNoIssueFilter(true);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "status__neq");
			newPath = removeURLParameter(newPath, "tls_status__neq");
			newPath = removeURLParameter(newPath, "missing_alts__gt");

			if (newPath.includes("?")) newPath += `&status=OK&tls_status=OK&missing_alts__iszero=true`;
			else newPath += `?status=OK&tls_status=OK&missing_alts__iszero=true`;
		} else if (filterType === "noIssues" && !filterStatus) {
			filterQueryString && filterQueryString.delete("status");
			filterQueryString && filterQueryString.delete("tls_status");
			filterQueryString && filterQueryString.delete("missing_alts__iszero");
			filterQueryString && filterQueryString.delete("page");

			if (
				newPath.includes("status") &&
				newPath.includes("missing_alts__iszero") &&
				newPath.includes("tls_status")
			) {
				newPath = removeURLParameter(newPath, "missing_alts__iszero");
				newPath = removeURLParameter(newPath, "status");
				newPath = removeURLParameter(newPath, "tls_status");
			}

			setNoIssueFilter(false);
		}

		if (filterType === "unsecuredImages" && filterStatus) {
			setBrokenImagesFilter(false);
			setUnsecuredImagesFilter(true);
			setMissingAltsFilter(false);
			setNoIssueFilter(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "status");
			newPath = removeURLParameter(newPath, "status__neq");
			newPath = removeURLParameter(newPath, "tls_status");
			newPath = removeURLParameter(newPath, "missing_alts__gt");
			newPath = removeURLParameter(newPath, "missing_alts__iszero");

			if (newPath.includes("?")) newPath += `&tls_status__neq=OK`;
			else newPath += `?tls_status__neq=OK`;
		} else if (filterType === "unsecuredImages" && !filterStatus) {
			filterQueryString && filterQueryString.delete("tls_status__neq");
			filterQueryString && filterQueryString.delete("page");

			if (newPath.includes("tls_status__neq")) {
				newPath = removeURLParameter(newPath, "tls_status__neq");
			}

			setUnsecuredImagesFilter(false);
		}

		if (filterType === "missingAlts" && filterStatus) {
			setBrokenImagesFilter(false);
			setUnsecuredImagesFilter(false);
			setMissingAltsFilter(true);
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
			filterQueryString && filterQueryString.delete("missing_alts__gt");
			filterQueryString && filterQueryString.delete("page");

			if (newPath.includes("missing_alts__gt")) {
				newPath = removeURLParameter(newPath, "missing_alts__gt");
			}

			setMissingAltsFilter(false);
		}

		if (filterType == "all" && filterStatus) {
			setBrokenImagesFilter(false);
			setUnsecuredImagesFilter(false);
			setMissingAltsFilter(false);
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
			setBrokenImagesFilter(true);
		} else {
			setBrokenImagesFilter(false);
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
			setUnsecuredImagesFilter(true);
		} else {
			setUnsecuredImagesFilter(false);
		}

		if (filterQueryString.get("missing_alts__gt") === "0") {
			setMissingAltsFilter(true);
		} else {
			setMissingAltsFilter(false);
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
			brokenImagesFilter,
			unsecuredImagesFilter,
			missingAltsFilter,
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
					{ImageFilters.filter((e) => e.value !== "noIssues").map((value, key) => {
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
					{ImageFilters.filter((e) => e.value === "noIssues").map((value, key) => {
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

ImageFilter.propTypes = {
	filterQueryString: PropTypes.object,
	scanApiEndpoint: PropTypes.string,
	setPagePath: PropTypes.func
};

ImageFilter.defaultProps = {
	filterQueryString: null,
	scanApiEndpoint: null,
	setPagePath: null
};

export default ImageFilter;