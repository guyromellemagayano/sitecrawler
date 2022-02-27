import { MinSitesPerPage } from "@constants/GlobalValues";
import { handleRemoveUrlParameter } from "@helpers/handleRemoveUrlParameter";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

/**
 * Custom hook that handles the site queries
 *
 * @returns {object} linksPerPage, setLinksPerPage, pagePath, setPagePath, searchKey, setSearchKey
 */
export const useSiteQueries = () => {
	const [pagePath, setPagePath] = useState("");
	const [searchKey, setSearchKey] = useState("");
	const [linksPerPage, setLinksPerPage] = useState(MinSitesPerPage);

	// Router
	const { asPath, query } = useRouter();

	useMemo(() => {
		let isMounted = true;

		// Handle the queries
		(async () => {
			handleRemoveUrlParameter(asPath, "page").includes("?")
				? setPagePath(`${handleRemoveUrlParameter(asPath, "page")}&`)
				: setPagePath(`${handleRemoveUrlParameter(asPath, "page")}?`);

			query?.search ? setSearchKey(query.search) : null;
			query?.per_page ? setLinksPerPage(parseInt(query.per_page)) : null;
		})();

		return () => {
			isMounted = false;
		};
	}, [query, pagePath]);

	return { linksPerPage, setLinksPerPage, pagePath, setPagePath, searchKey, setSearchKey };
};
