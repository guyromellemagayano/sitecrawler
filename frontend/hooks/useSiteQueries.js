import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { handleRemoveURLParameter } from "../helpers/handleRemoveUrlParameter";

/**
 * Custom hook that handles the site queries
 *
 * @param {object} result
 * @returns {object} linksPerPage, setLinksPerPage, pagePath, setPagePath, searchKey, setSearchKey
 */
export const useSiteQueries = (result = null) => {
	const [linksPerPage, setLinksPerPage] = useState(20);
	const [pagePath, setPagePath] = useState("");
	const [searchKey, setSearchKey] = useState("");

	const { asPath } = useRouter();

	useEffect(() => {
		handleRemoveURLParameter(asPath, "page").includes("?")
			? setPagePath(`${handleRemoveURLParameter(asPath, "page")}&`)
			: setPagePath(`${handleRemoveURLParameter(asPath, "page")}?`);

		result?.search ? setSearchKey(result?.search) : null;
		result?.per_page ? setLinksPerPage(result?.per_page) : null;
	}, [result, asPath]);

	return { linksPerPage, setLinksPerPage, pagePath, setPagePath, searchKey, setSearchKey };
};
