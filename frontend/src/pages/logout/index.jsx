import Layout from "@components/layouts";
import Loader from "@components/loader";
import { LogoutApiEndpoint, UserApiEndpoint } from "@configs/ApiEndpoints";
import { LoginLink } from "@configs/PageLinks";
import { usePostMethod } from "@hooks/useHttpMethod";
import { useUser } from "@hooks/useUser";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import * as React from "react";
import "twin.macro";

const Logout = () => {
	const [logoutDetail, setLogoutDetail] = React.useState(null);

	const pageTitle = "Logout";

	const router = useRouter();
	const { user, mutateUser, validatingUser } = useUser();

	React.useEffect(() => {
		!validatingUser ? (!user ? router.push(LoginLink) : null) : null;
	}, [user]);

	return !validatingUser && typeof user !== undefined ? (
		(async () => {
			const response = await usePostMethod(LogoutApiEndpoint);
			const data = response?.data || null;
			const status = response?.status || null;

			Math.floor(status / 200) === 1 &&
				(() => {
					data?.detail
						? (() => {
								setLogoutDetail(data?.detail);
								mutateUser(UserApiEndpoint);

								data?.detail ? (window.location.href = LoginLink) : null;
						  })()
						: null;
				})();

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
		})()
	) : (
		<Loader />
	);
};

export default Logout;
