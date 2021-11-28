export const getSortKeyFromSlug = (content, slug) => {
	let sortKey = "";

	content.forEach((val) => {
		if (val.slug == slug) sortKey = val.key;
	});

	return sortKey;
};
