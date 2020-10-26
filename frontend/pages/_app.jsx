import { useEffect, useState } from 'react';
// import dynamic from 'next/dynamic';
import useSWR, { SWRConfig } from 'swr';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import Cookies from 'js-cookie';
import fetch from 'node-fetch';
import fetchJson from 'hooks/fetchJson';

import 'css/styles.css';
import 'nprogress/nprogress.css';

library.add(fab);

// const TopProgressBar = dynamic(
// 	() => {
// 		return import('components/utils/TopProgressBar');
// 	},
// 	{ ssr: false }
// );

const fetcher = async (url) => {
	const res = await fetch(url, {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'X-CSRFToken': Cookies.get('csrftoken')
		}
	});

	const data = await res.json();

	if (res.status !== 200) {
		throw new Error(data.message);
	}

	return data;
};

const App = ({ Component, pageProps }) => {
	const [stripeKey, getStripeKey] = useState(undefined);

	const { data: stripeConfig, error: stripeConfigError } = useSWR(
		() => `/api/stripe/config/`,
		fetcher
	);

	{
		stripeConfigError && <Layout>{stripeConfigError.message}</Layout>;
	}

	useEffect(() => {
		if (stripeConfig && stripeConfig !== undefined) {
			getStripeKey(stripeConfig);
		}
	}, [stripeConfig]);

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
			<Elements stripe={loadStripe(stripeKey?.publishable_key)}>
				<Component {...pageProps} />
			</Elements>
		</SWRConfig>
	);
};

export default App;
