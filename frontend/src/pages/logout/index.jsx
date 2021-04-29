// React
import { useEffect, useState } from "react";

// External
import { NextSeo } from "next-seo";
import PropTypes from "prop-types";
import "twin.macro";

// Hooks
import usePostMethod from "src/hooks/usePostMethod";
import useUser from "src/hooks/useUser";

// Components
import Layout from "src/components/Layout";

const Logout = () => {
	const [logoutDetail, setLogoutDetail] = useState(null);

	const pageTitle = "Logout";
	const logoutApiEndpoint = "/api/auth/logout/";

	const { mutateUser: mutateUser } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
	});

	useEffect(() => {
		(async () => {
			try {
				const response = await usePostMethod(logoutApiEndpoint);

				if (Math.floor(response.status / 200) === 1) {
					if (response.data.detail) {
						setLogoutDetail(response.data.detail);
						mutateUser();

						if (response.data.detail !== undefined) {
							window.location.href = "/login";
						}
					}
				} else {
					return null;
				}
			} catch (error) {
				return null;
			}
		})();
	});

	return (
		<Layout>
			<NextSeo title={pageTitle} />

			<section tw="flex flex-col justify-center min-h-screen bg-white">
				<div tw="px-4 py-5 sm:p-6 flex items-center justify-center">
					<h3 tw="text-lg leading-6 font-medium text-gray-500">{logoutDetail}</h3>
				</div>
			</section>
		</Layout>
	);
};

Logout.propTypes = {};

export default Logout;
