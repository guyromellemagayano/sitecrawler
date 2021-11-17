import useSWR from "swr";

export const usePage = (endpoint = null) => {
	const {
		data: page,
		error: pageError,
		isValidating: validatingPage
	} = useSWR(typeof endpoint !== "undefined" && endpoint !== null && endpoint !== "" ? endpoint : null);

	return { page, validatingPage, pageError };
};
