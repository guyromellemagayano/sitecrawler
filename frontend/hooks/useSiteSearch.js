import { handleRemoveUrlParameter } from "@helpers/handleRemoveUrlParameter";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";

/**
 * Custom hook that handles site search
 *
 * @param {object} event
 * @param {string} scanApiEndpoint
 * @param {function} setSearchKey
 * @param {function} setPagePath
 */
export const useSiteSearch = async (event, scanApiEndpoint = null, setSearchKey, setPagePath) => {
	// Router
	const { asPath } = useRouter();
	const router = useRouter();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	const searchTargetValue = event.target.value;

	if (event.keyCode !== 13) return false;

	let newPath = asPath;
	newPath = handleRemoveUrlParameter(newPath, "search");
	newPath = handleRemoveUrlParameter(newPath, "page");

	if (!/\S/.test(searchTargetValue)) {
		setSearchKey(searchTargetValue);
	} else {
		if (newPath.includes("?")) newPath += `&search=${searchTargetValue}`;
		else newPath += `?search=${searchTargetValue}`;

		setSearchKey(searchTargetValue);
	}

	if (newPath.includes("?")) setPagePath(`${newPath}&`);
	else setPagePath(`${newPath}?`);

	await mutate(scanApiEndpoint, false);
	router.push(newPath);
};
