import { handleRemoveURLParameter } from "@helpers/handleRemoveUrlParameter";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";

/**
 * Custom hook that handles site search
 *
 * @param {object} event
 * @param {string} scanApiEndpoint
 * @param {any} setSearchKey
 */
export const useSiteSearch = async (event, scanApiEndpoint = null, setSearchKey, setPagePath) => {
	// Router
	const { asPath } = useRouter();
	const router = useRouter();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	const searchTargetValue = event?.target?.value || null;

	if (event.keyCode !== 13) return false;

	let newPath = asPath;
	newPath = handleRemoveURLParameter(newPath, "search");
	newPath = handleRemoveURLParameter(newPath, "page");

	if (!/\S/.test(searchTargetValue)) {
		setSearchKey(searchTargetValue);
	} else {
		if (newPath.includes("?")) newPath += `&search=${searchTargetValue}`;
		else newPath += `?search=${searchTargetValue}`;

		setSearchKey(searchTargetValue);
	}

	if (newPath.includes("?")) setPagePath(`${newPath}&`);
	else setPagePath(`${newPath}?`);

	mutate(scanApiEndpoint, false);
	router.push(newPath);
};
