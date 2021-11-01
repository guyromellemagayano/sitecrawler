/**
 * Helper function that handles removing URL parameters.
 *
 * @param {*} url
 * @param {*} parameter
 * @returns {string} url
 */
export const handleRemoveURLParameter = (url, parameter) => {
	const urlparts = url.split("?");

	if (urlparts.length >= 2) {
		const prefix = encodeURIComponent(parameter) + "=";
		const pars = urlparts[1].split(/[&;]/g);

		for (var i = pars.length; i-- > 0; ) {
			if (pars[i].lastIndexOf(prefix, 0) !== -1) {
				pars.splice(i, 1);
			}
		}

		return urlparts[0] + (pars.length > 0 ? "?" + pars.join("&") : "");
	}

	return url;
};
