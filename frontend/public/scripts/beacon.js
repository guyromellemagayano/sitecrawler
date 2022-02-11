// Beacon
!(function (e, t, n) {
	function a() {
		const e = t.getElementsByTagName("script")[0];
		const n = t.createElement("script");
		(n.type = "text/javascript"),
			(n.async = !0),
			(n.src = "https://beacon-v2.helpscout.net"),
			e.parentNode.insertBefore(n, e);
	}

	if (
		((e.Beacon = n = function (t, n, a) {
			e.Beacon.readyQueue.push({
				method: t,
				options: n,
				data: a,
			});
		}),
		(n.readyQueue = []),
		t.readyState === "complete")
	)
		return a();
	e.attachEvent ? e.attachEvent("onload", a) : e.addEventListener("load", a, !1);
})(window, document, window.Beacon || (() => {}));

window.Beacon("init", "94d0425a-cb40-4582-909a-2175532bbfa9");
