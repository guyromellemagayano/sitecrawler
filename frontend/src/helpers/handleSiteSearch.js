import { useRouter } from "next/router";
import { mutate } from "swr";
import { handleRemoveURLParameter } from "./handleRemoveUrlParameter";

/**
 * Helper function that handles site search
 *
 * @param {object} e
 * @param {string} scanApiEndpoint
 * @param {any} setSearchKey
 */
export const handleSiteSearch = async (e, scanApiEndpoint, setSearchKey) => {
	const { asPath } = useRouter();
	const router = useRouter();

	const searchTargetValue = e?.target?.value || null;

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
	} catch (error) {

	}



	mutate(scanApiEndpoint);
	router.push(newPath);

	return;
};
