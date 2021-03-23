// React
import { useEffect, useState } from "react";

// External
import { NextSeo } from "next-seo";
import PropTypes from "prop-types";
import "twin.macro";

// Utils
import { getCookie, removeCookie } from "src/utils/cookie";

// Hooks
import usePostMethod from "src/hooks/usePostMethod";

// Components
import Layout from "src/components/Layout";

const Logout = () => {
	const [logoutDetail, setLogoutDetail] = useState(null);

	const pageTitle = "Logout";
	const logoutApiEndpoint = "/api/auth/logout/";

	useEffect(() => {
		(async () => {
			try {
				const response = await usePostMethod(logoutApiEndpoint);

				if (Math.floor(response.status / 200) === 1) {
					if (response.data.detail) {
						setLogoutDetail(response.data.detail);

						if (response.data.detail !== undefined) {
							removeCookie("token");
							typeof localStorage !== "undefined" && localStorage.removeItem("token");
							window.location.href = "/";
						}
					}
				} else {
					if (response.data.detail) {
						// FIXME: Django exception error in response.data
						console.error(response.data.detail);
					}
				}
			} catch (error) {
				// FIXME: add logging solution here
				return null;
			}
		})();
	});

	return (
		<Layout>
			<NextSeo title={pageTitle} />

			<div tw="bg-white p-3">
				<p tw="text-2xl font-bold leading-7 text-gray-900 sm:text-xl sm:leading-9 sm:truncate">{logoutDetail}</p>
			</div>
		</Layout>
	);
};

Logout.propTypes = {};

export default Logout;

export async function getServerSideProps({ req }) {
	let token = getCookie("token", req);

	if (!token) {
		return {
			redirect: {
				permanent: false,
				destination: "/",
			},
		};
	}

	return {
		props: {},
	};
}
