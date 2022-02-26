// Custom classnames for components with multiple states
export const classnames = (...classes) => {
	return classes.filter(Boolean).join(" ");
};
