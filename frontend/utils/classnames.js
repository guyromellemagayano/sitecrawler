// Custom clasNames for components with multiple states
export function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}
