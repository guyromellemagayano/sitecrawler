export const sleep = (ms, config) =>
	new Promise((resolve) => {
		setTimeout(() => {
			resolve(config);
		}, ms);
	});
