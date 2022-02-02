import { MaxSitesPerPage } from "@constants/GlobalValues";
import { handleRemoveUrlParameter } from "@helpers/handleRemoveUrlParameter";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

/**
 * Custom hook that handles the site queries
 *
 * @returns {object} linksPerPage, setLinksPerPage, pagePath, setPagePath, searchKey, setSearchKey
 */
export const useSiteQueries = () => {
	const [pagePath, setPagePath] = useState(null);
	const [searchKey, setSearchKey] = useState(null);
	const [linksPerPage, setLinksPerPage] = useState(MaxSitesPerPage);

	// Router
	const { asPath, query } = useRouter();

	useEffect(() => {
		handleRemoveUrlParameter(asPath, "page").includes("?")
			? setPagePath(`${handleRemoveUrlParameter(asPath, "page")}&`)
			: setPagePath(`${handleRemoveUrlParameter(asPath, "page")}?`);

		query?.search ? setSearchKey(query?.search) : null;
		query?.per_page ? setLinksPerPage(query?.per_page) : null;
	}, [query, asPath]);

	return { linksPerPage, setLinksPerPage, pagePath, setPagePath, searchKey, setSearchKey };
};
