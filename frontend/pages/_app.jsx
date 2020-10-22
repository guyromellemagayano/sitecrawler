import { useEffect } from 'react';
// import dynamic from 'next/dynamic';
import { SWRConfig } from 'swr';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import fetchJson from 'hooks/fetchJson';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';

import 'css/styles.css';
import 'nprogress/nprogress.css';

library.add(fab);

// const TopProgressBar = dynamic(
// 	() => {
// 		return import('components/utils/TopProgressBar');
// 	},
// 	{ ssr: false }
// );

const App = ({ Component, pageProps }) => {
	const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY);

	useEffect(() => {
		'use strict';

		// Beacon
		!(function (e, t, n) {
			function a() {
				var e = t.getElementsByTagName('script')[0],
					n = t.createElement('script');
				(n.type = 'text/javascript'),
					(n.async = !0),
					(n.src = 'https://beacon-v2.helpscout.net'),
					e.parentNode.insertBefore(n, e);
			}

			if (
				((e.Beacon = n = function (t, n, a) {
					e.Beacon.readyQueue.push({
						method: t,
						options: n,
						data: a
					});
				}),
				(n.readyQueue = []),
				'complete' === t.readyState)
			)
				return a();
			e.attachEvent
				? e.attachEvent('onload', a)
				: e.addEventListener('load', a, !1);
		})(window, document, window.Beacon || function () {});

		window.Beacon('init', '94d0425a-cb40-4582-909a-2175532bbfa9');
	}, []);

	useEffect(() => {
		'use strict';

		// Usetiful
		(function (w, d, s) {
			var a = d.getElementsByTagName('head')[0];
			var r = d.createElement('script');
			r.async = 1;
			r.src = s;
			r.setAttribute('id', 'usetifulScript');
			r.dataset.token = '4b8863eaef435adc652a9d86eb33cbf9';
			a.appendChild(r);
		})(window, document, 'https://www.usetiful.com/dist/usetiful.js');
	}, []);

	return (
		<SWRConfig
			value={{
				fetcher: fetchJson,
				revalidateOnFocus: true
			}}
		>
			{/* <TopProgressBar /> */}
			<Elements stripe={stripePromise}>
				<Component {...pageProps} />
			</Elements>
		</SWRConfig>
	);
};

export default App;
