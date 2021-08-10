// React
import * as React from "react";

// External
import "twin.macro";
import { NextSeo } from "next-seo";

// Enums
import { LogoutApiEndpoint } from "@enums/ApiEndpoints";

// Hooks
import { usePostMethod } from "@hooks/useHttpMethod";
import useUser from "@hooks/useUser";

// Components
import Layout from "@components/layouts";

const Logout = () => {
	const [logoutDetail, setLogoutDetail] = React.useState(null);

	const pageTitle = "Logout";

	const { mutateUser } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
	});

	React.useEffect(() => {
		(async () => {
			const { response, error } = await usePostMethod(LogoutApiEndpoint);

			return Math.floor(response?.status / 200) === 1
				? (() => {
						response?.data?.detail
							? (() => {
									setLogoutDetail(response?.data?.detail);
									mutateUser;

									response?.data?.detail !== undefined ? (window.location.href = "/login") : null;
							  })()
							: null;
				  })()
				: error;
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

export default Logout;
