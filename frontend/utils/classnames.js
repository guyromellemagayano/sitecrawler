// Custom clasNames for components with multiple states
export const classNames = (...classes) => {
	return classes.filter(Boolean).join(" ");
};
