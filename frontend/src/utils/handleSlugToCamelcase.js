export const slugToCamelcase = (slug) => {
	return slug.replace(/(\-\w)/g, function (m) {
		return m[1].toUpperCase();
	});
};
