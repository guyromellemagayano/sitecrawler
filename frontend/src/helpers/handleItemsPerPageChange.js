import { useRouter } from "next/router";
import { mutate } from "swr";
import { handleRemoveURLParameter } from "./handleRemoveUrlParameter";

/**
 * Helper function that handles pagination items per page change
 *
 * @param {*} scanApiEndpoint
 * @param {*} count
 * @param {*} setLinksPerPage
 */
export const handleItemsPerPageChange = (scanApiEndpoint, count, setLinksPerPage) => {
	const countValue = count?.target?.value ? parseInt(count?.target?.value) : null;

	let newPath = asPath;
	newPath = handleRemoveURLParameter(newPath, "page");

	const router = useRouter();

	countValue
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

				mutate(scanApiEndpoint);
				router.push(newPath);
		  })()
		: null;
};
