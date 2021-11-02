import { useRouter } from "next/router";
import { mutate } from "swr";
import { handleRemoveURLParameter } from "./handleRemoveUrlParameter";

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
