import { handleRemoveUrlParameter } from "@helpers/handleRemoveUrlParameter";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";

/**
 * Custom hook that handles pagination items per page change
 *
 * @param {string} scanApiEndpoint
 * @param {number} count
 * @param {any} setLinksPerPage
 * @param {any} setPagePath
 */
export const useItemsPerPageChange = async (scanApiEndpoint = null, count = 0, setLinksPerPage, setPagePath) => {
	// Router
	const { asPath } = useRouter();
	const router = useRouter();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	const countValue = count?.target?.value ? parseInt(count?.target?.value) : null;

	let newPath = asPath;
	newPath = handleRemoveUrlParameter(newPath, "page");

	countValue !== null
		? (() => {
				newPath.includes("per_page") ? (newPath = handleRemoveUrlParameter(newPath, "per_page")) : null;
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

	await mutate(scanApiEndpoint, false);
	router.push(newPath);
};
