export const removeURLParameter = (url, parameter) => {
	//prefer to use l.search if you have a location/link object
	const urlparts = url.split('?');
	if (urlparts.length >= 2) {
		const prefix = encodeURIComponent(parameter) + '=';
		const pars = urlparts[1].split(/[&;]/g);

		//reverse iteration as may be destructive
		for (var i = pars.length; i-- > 0; ) {
			//idiom for string.startsWith
			if (pars[i].lastIndexOf(prefix, 0) !== -1) {
				pars.splice(i, 1);
			}
		}

		return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
	}

	return url;
};

export const slugToCamelcase = (slug) => {
	return slug.replace(/(\-\w)/g, function (m) {
		return m[1].toUpperCase();
	});
};

export const getSortKeyFromSlug = (content, slug) => {
	let sortKey = '';

	content.forEach((val, index) => {
		if (val.slug == slug) sortKey = val.key;
	});

	return sortKey;
};

export const getSlugFromSortKey = (content, sortKey) => {
	let slug = '';

	content.forEach((val, index) => {
		if (val.key == sortKey) slug = val.slug;
	});

	return slug;
};
