// Usetiful
(function (w, d, s) {
	const a = d.getElementsByTagName('head')[0];
	const r = d.createElement('script');
	r.async = 1;
	r.src = s;
	r.setAttribute('id', 'usetifulScript');
	r.dataset.token = process.env.USETIFUL_DATASET_TOKEN;
	a.appendChild(r);
})(window, document, 'https://www.usetiful.com/dist/usetiful.js');
