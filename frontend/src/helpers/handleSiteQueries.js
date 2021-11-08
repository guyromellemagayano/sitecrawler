import { SiteApiEndpoint } from "@configs/ApiEndpoints";
import { useRouter } from "next/router";
import * as React from "react";
import { mutate } from "swr";
import { handleRemoveURLParameter } from "./handleRemoveUrlParameter";

export const handleSiteQueries = ({ result = null }) => {
	const [linksPerPage, setLinksPerPage] = React.useState(20);
	const [pagePath, setPagePath] = React.useState("");
	const [searchKey, setSearchKey] = React.useState("");

	const { asPath } = useRouter();

	React.useEffect(() => {
		handleRemoveURLParameter(asPath, "page").includes("?")
			? setPagePath(`${handleRemoveURLParameter(asPath, "page")}&`)
			: setPagePath(`${handleRemoveURLParameter(asPath, "page")}?`);

		result?.search ? setSearchKey(result?.search) : null;
		result?.per_page ? setLinksPerPage(result?.per_page) : null;
	}, [result, asPath]);

	return { linksPerPage, setLinksPerPage, pagePath, setPagePath, searchKey, setSearchKey };
};

/**
 * Helper function that handle the scan API endpoint changes
 *
 * @param {object} result The result query if there is any
 * @param {number} linksPerPage The number of links per page
 * @returns {string} The updated scan API endpoint
 */
export const handleScanApiEndpoint = (result = null, linksPerPage = null) => {
	let perPageQuery = "&per_page";
	let orderingByNameQuery = "&ordering=name";
	let scanApiEndpoint = SiteApiEndpoint + perPageQuery + linksPerPage + orderingByNameQuery;
	let queryString = "";

	queryString +=
		typeof result?.page !== "undefined"
			? scanApiEndpoint.includes("?")
				? `&page=${result?.page}`
				: `?page=${result?.page}`
			: "";

	queryString += result?.search
		? scanApiEndpoint.includes("?")
			? `&search=${result?.search}`
			: `?search=${result?.search}`
		: "";

	queryString += result?.ordering
		? scanApiEndpoint.includes("?")
			? `&ordering=${result?.ordering}`
			: `?ordering=${result?.ordering}`
		: "";

	scanApiEndpoint += queryString;

	return { scanApiEndpoint };
};

/**
 * Helper function that handles pagination items per page change
 *
 * @param {string} scanApiEndpoint
 * @param {number} count
 * @param {any} setLinksPerPage
 */
export const handleItemsPerPageChange = async (scanApiEndpoint, count, setLinksPerPage) => {
	const router = useRouter();

	const countValue = count?.target?.value ? parseInt(count?.target?.value) : null;

	let newPath = asPath;

	newPath = handleRemoveURLParameter(newPath, "page");

	countValue !== null
		? (() => {
				newPath.includes("per_page") ? (newPath = handleRemoveURLParameter(newPath, "per_page")) : null;
				newPath.includes("?")
					? (() => {
							newPath += `&per_page=${countValue}`;
							setPagePath(`${newPath}&`);
					  })()
					: (() => {
							newPath += `?per_page=${countValue}`;
							setPagePath(`${newPath}?`);
					  })();

				setLinksPerPage(countValue);
		  })()
		: null;

	mutate(scanApiEndpoint);
	router.push(newPath);

	return;
};

/**
 * Helper function that handles site search
 *
 * @param {object} event
 * @param {string} scanApiEndpoint
 * @param {any} setSearchKey
 */
export const handleSiteSearch = async (event, scanApiEndpoint, setSearchKey) => {
	const { asPath } = useRouter();
	const router = useRouter();

	const searchTargetValue = event?.target?.value || null;

	if (e.keyCode !== 13) return false;

	let newPath = asPath;

	newPath = handleRemoveURLParameter(newPath, "search");
	newPath = handleRemoveURLParameter(newPath, "page");

	try {
		searchTargetValue !== null
			? (() => {
					!/\S/.test(searchTargetValue)
						? setSearchKey(searchTargetValue)
						: (() => {
								newPath.includes("?")
									? (newPath += `&search=${searchTargetValue}`)
									: (newPath += `?search=${searchTargetValue}`);

								setSearchKey(searchTargetValue);
						  })();

					newPath.includes("?") ? setPagePath(`${newPath}&`) : setPagePath(`${newPath}?`);
			  })()
			: null;
	} catch (error) {}

	mutate(scanApiEndpoint);
	router.push(newPath);

	return;
};
