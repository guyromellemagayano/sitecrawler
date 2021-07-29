// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";

// External
import "twin.macro";

// Helpers
import { removeURLParameter } from "src/utils/functions";

const LinkFilter = ({ result, loadQueryString, setLoadQueryString, mutateLinks, setPagePath }) => {
	const [allFilter, setAllFilter] = React.useState(false);
	const [externalFilter, setExternalFilter] = React.useState(false);
	const [internalFilter, setInternalFilter] = React.useState(false);
	const [issueFilter, setIssueFilter] = React.useState(false);
	const [noIssueFilter, setNoIssueFilter] = React.useState(false);

	const { asPath } = useRouter();
	const router = useRouter();

	const handleFilter = async (e) => {
		const filterType = e.target.value;
		const filterStatus = e.target.checked;

		let newPath = asPath;
		newPath = removeURLParameter(newPath, "page");

		if (filterType == "issues" && filterStatus == true) {
			setIssueFilter(true);
			setNoIssueFilter(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "status");

			if (newPath.includes("?")) newPath += `&status__neq=OK`;
			else newPath += `?status__neq=OK`;
		} else if (filterType == "issues" && filterStatus == false) {
			loadQueryString && loadQueryString.delete("status__neq");
			loadQueryString && loadQueryString.delete("page");

			if (newPath.includes("status__neq")) newPath = removeURLParameter(newPath, "status__neq");

			setIssueFilter(false);
		}

		if (filterType == "no-issues" && filterStatus == true) {
			setIssueFilter(false);
			setNoIssueFilter(true);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "type");
			newPath = removeURLParameter(newPath, "status__neq");

			if (newPath.includes("?")) newPath += `&status=OK`;
			else newPath += `?status=OK`;
		} else if (filterType == "no-issues" && filterStatus == false) {
			loadQueryString && loadQueryString.delete("status");
			loadQueryString && loadQueryString.delete("page");

			if (newPath.includes("status")) newPath = removeURLParameter(newPath, "status");

			setNoIssueFilter(false);
		}

		if (filterType == "internal" && filterStatus == true) {
			setInternalFilter(true);
			setExternalFilter(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "type");

			if (newPath.includes("?")) newPath += `&type=PAGE`;
			else newPath += `?type=PAGE`;
		} else if (filterType == "internal" && filterStatus == false) {
			loadQueryString && loadQueryString.delete("type");
			loadQueryString && loadQueryString.delete("page");

			if (newPath.includes("type=PAGE")) newPath = removeURLParameter(newPath, "type");

			setInternalFilter(false);
		}

		if (filterType == "external" && filterStatus == true) {
			setExternalFilter(true);
			setInternalFilter(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "type");

			if (newPath.includes("?")) newPath += `&type=EXTERNAL`;
			else newPath += `?type=EXTERNAL`;
		} else if (filterType == "external" && filterStatus == false) {
			loadQueryString && loadQueryString.delete("type");
			loadQueryString && loadQueryString.delete("page");

			if (newPath.includes("type=EXTERNAL")) newPath = removeURLParameter(newPath, "type");

			setExternalFilter(false);
		}

		if (filterType == "all" && filterStatus == true) {
			setAllFilter(true);
			setIssueFilter(false);
			setNoIssueFilter(false);
			setExternalFilter(false);
			setInternalFilter(false);

			newPath = removeURLParameter(newPath, "status");
			newPath = removeURLParameter(newPath, "status__neq");
			newPath = removeURLParameter(newPath, "type");
			newPath = removeURLParameter(newPath, "page");
		}

		if (newPath.includes("?")) setPagePath(`${newPath}&`);
		else setPagePath(`${newPath}?`);

		router.push(newPath);
		mutateLinks;
	};

	React.useEffect(() => {
		setLoadQueryString(new URLSearchParams(window.location.search));

		let loadQueryStringValue = new URLSearchParams(window.location.search);

		if (loadQueryStringValue.has("status__neq")) {
			if (loadQueryStringValue.get("status__neq") === "OK") {
				setIssueFilter(true);
				setNoIssueFilter(false);
				setAllFilter(false);
				setInternalFilter(false);
				setExternalFilter(false);
			}
		}

		if (loadQueryStringValue.has("status")) {
			if (loadQueryStringValue.get("status") === "OK") {
				setNoIssueFilter(true);
				setIssueFilter(false);
				setAllFilter(false);
				setInternalFilter(false);
				setExternalFilter(false);
			}
		}

		if (loadQueryStringValue.has("type")) {
			if (loadQueryStringValue.get("type") === "PAGE") {
				setInternalFilter(true);
				setExternalFilter(false);
				setAllFilter(false);
			} else if (loadQueryStringValue.get("type") === "EXTERNAL") {
				setExternalFilter(true);
				setInternalFilter(false);
				setAllFilter(false);
			} else if (loadQueryStringValue.get("type") === "EXTERNALOTHER") {
				setExternalFilter(true);
				setInternalFilter(false);
				setAllFilter(false);
			}
		}

		if (
			!loadQueryStringValue.has("type") &&
			!loadQueryStringValue.has("status") &&
			!loadQueryStringValue.has("status__neq")
		) {
			setNoIssueFilter(false);
			setIssueFilter(false);
			setInternalFilter(false);
			setExternalFilter(false);
			setAllFilter(true);
		}
	}, []);

	React.useEffect(() => {
		if (result.status !== undefined && result.status === "OK") {
			setNoIssueFilter(true);
			setIssueFilter(false);
			setAllFilter(false);
			setInternalFilter(false);
			setExternalFilter(false);
		}

		if (result.status__neq !== undefined && result.status__neq === "OK") {
			setIssueFilter(true);
			setNoIssueFilter(false);
			setAllFilter(false);
			setInternalFilter(false);
			setExternalFilter(false);
		}

		if (result.status__neq !== undefined && result.type !== undefined && result.type === "EXTERNAL") {
			setIssueFilter(true);
			setNoIssueFilter(false);
			setAllFilter(false);
			setInternalFilter(false);
			setExternalFilter(true);
		}

		if (result.status__neq !== undefined && result.type !== undefined && result.type === "PAGE") {
			setIssueFilter(true);
			setNoIssueFilter(false);
			setAllFilter(false);
			setInternalFilter(true);
			setExternalFilter(false);
		}

		if (result.type !== undefined && result.type == "PAGE") {
			setInternalFilter(true);
			setExternalFilter(false);
			setAllFilter(false);
		}

		if (Array.isArray(result.type)) {
			if (result.type !== undefined && result.type.join("") == "EXTERNALOTHER") {
				setExternalFilter(true);
				setInternalFilter(false);
				setAllFilter(false);
			}
		} else {
			if (result.type !== undefined && result.type == "EXTERNAL") {
				setExternalFilter(true);
				setInternalFilter(false);
				setAllFilter(false);
			}
		}

		if (loadQueryString && loadQueryString !== undefined && loadQueryString.toString().length === 0) {
			if (result.type == undefined && result.status == undefined && result.status__neq == undefined) {
				setIssueFilter(false);
				setNoIssueFilter(false);
				setInternalFilter(false);
				setExternalFilter(false);
				setAllFilter(true);
			}
		}
	}, [handleFilter, loadQueryString]);

	return (
		<div tw="pb-4 bg-white">
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
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">All Links</span>
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
									checked={issueFilter}
									value="issues"
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">Links with Issues</span>
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
									checked={internalFilter}
									value="internal"
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">Internal Links</span>
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
									checked={externalFilter}
									value="external"
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">External Links</span>
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

LinkFilter.propTypes = {};

export default LinkFilter;
