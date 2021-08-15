// React
import * as React from "react";

// External
import "twin.macro";
import { NextSeo } from "next-seo";

// Enums
import { LoginLink } from "@enums/PageLinks";
import { LogoutApiEndpoint, UserApiEndpoint } from "@enums/ApiEndpoints";

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
		redirectTo: LoginLink
	});

	React.useEffect(() => {
		(async () => {
			const response = await usePostMethod(LogoutApiEndpoint);

			Math.floor(response?.status / 200) === 1
				? (() => {
						response?.data.detail
							? (() => {
									setLogoutDetail(response?.data?.detail);
									mutateUser(UserApiEndpoint, false);

									response?.data.detail !== undefined ? (window.location.href = LoginLink) : null;
							  })()
							: null;
				  })()
				: null;
		})();
	}, []);

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
