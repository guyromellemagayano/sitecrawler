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

const LinkFilter = ({ scanApiEndpoint, setPagePath }) => {
	const [allFilter, setAllFilter] = React.useState(false);
	const [externalFilter, setExternalFilter] = React.useState(false);
	const [internalFilter, setInternalFilter] = React.useState(false);
	const [issueFilter, setIssueFilter] = React.useState(false);
	const [noIssueFilter, setNoIssueFilter] = React.useState(false);

	const filterQueryString = new URLSearchParams(window.location.search);

	const { asPath } = useRouter();
	const router = useRouter();

	const handleFilter = async (e) => {
		const filterType = e.target.value;
		const filterStatus = e.target.checked;

		let newPath = asPath;
		newPath = removeURLParameter(newPath, "page");

		if (filterType === "issues" && filterStatus) {
			setIssueFilter(true);
			setNoIssueFilter(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "status");

			if (newPath.includes("?")) newPath += `&status__neq=OK`;
			else newPath += `?status__neq=OK`;
		} else if (filterType === "issues" && !filterStatus) {
			if (newPath.includes("status__neq")) newPath = removeURLParameter(newPath, "status__neq");

			setIssueFilter(false);
		}

		if (filterType === "no-issues" && filterStatus) {
			setIssueFilter(false);
			setNoIssueFilter(true);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "status__neq");

			if (newPath.includes("?")) newPath += `&status=OK`;
			else newPath += `?status=OK`;
		} else if (filterType === "no-issues" && !filterStatus) {
			if (newPath.includes("status")) newPath = removeURLParameter(newPath, "status");

			setNoIssueFilter(false);
		}

		if (filterType === "internal" && filterStatus) {
			setInternalFilter(true);
			setExternalFilter(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "type");

			if (newPath.includes("?")) newPath += `&type=PAGE`;
			else newPath += `?type=PAGE`;
		} else if (filterType === "internal" && !filterStatus) {
			if (newPath.includes("type=PAGE")) newPath = removeURLParameter(newPath, "type");

			setInternalFilter(false);
		}

		if (filterType === "external" && filterStatus) {
			setExternalFilter(true);
			setInternalFilter(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "type");

			if (newPath.includes("?")) newPath += `&type=EXTERNAL`;
			else newPath += `?type=EXTERNAL`;
		} else if (filterType === "external" && !filterStatus) {
			if (newPath.includes("type=EXTERNAL")) newPath = removeURLParameter(newPath, "type");

			setExternalFilter(false);
		}

		if (filterType === "all" && filterStatus) {
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

		mutate(scanApiEndpoint);
	};

	React.useEffect(() => {
		if (filterQueryString.has("status__neq")) {
			setIssueFilter(true);
		} else {
			setIssueFilter(false);
		}

		if (filterQueryString.has("status")) {
			setNoIssueFilter(true);
		} else {
			setNoIssueFilter(false);
		}

		if (filterQueryString.has("type")) {
			if (filterQueryString.get("type") === "PAGE") {
				setInternalFilter(true);
				setExternalFilter(false);
			} else if (filterQueryString.get("type") === "EXTERNAL") {
				setExternalFilter(true);
				setInternalFilter(false);
			} else if (filterQueryString.get("type") === "EXTERNALOTHER") {
				setExternalFilter(true);
				setInternalFilter(false);
			}
		} else {
			setInternalFilter(false);
			setExternalFilter(false);
		}

		if (
			!filterQueryString.has("type") &&
			!filterQueryString.has("status") &&
			!filterQueryString.has("status__neq")
		) {
			setAllFilter(true);
		} else {
			setAllFilter(false);
		}

		return { noIssueFilter, issueFilter, internalFilter, externalFilter, allFilter };
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
									All Links
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
									checked={issueFilter}
									value="issues"
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">
									Links with Issues
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
									checked={internalFilter}
									value="internal"
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">
									Internal Links
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
									checked={externalFilter}
									value="external"
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">
									External Links
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

LinkFilter.propTypes = {
	scanApiEndpoint: PropTypes.string,
	setPagePath: PropTypes.func
};

LinkFilter.defaultProps = {
	scanApiEndpoint: null,
	setPagePath: null
};

export default LinkFilter;
