/**
 * Handle finding length of given integer
 * @param {number} e
 **/
export const handleIntLength = (e) => {
	let intNumber = "";

	intNumber = e !== null && e !== "" && typeof e === "number" ? Math.ceil(Math.log10(e + 1)) : e;

	return intNumber;
};
