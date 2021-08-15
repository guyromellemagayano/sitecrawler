// React
import { useState, useEffect } from "react";

// External
import "twin.macro";
import { NextSeo } from "next-seo";

// Hooks
import { useComponentVisible } from "@hooks/useComponentVisible";
import useUser from "@hooks/useUser";

// Layout
import Layout from "@components/layouts";

// Components
import ComingSoon from "@components/layouts/ComingSoon";
import Sidebar from "@components/layouts/Sidebar";

const Reports = () => {
	const [componentReady, setComponentReady] = React.useState(false);

	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

	const pageTitle = "Audit Logs";

	const { user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
	});

	React.useEffect(() => {
		setTimeout(() => {
			setComponentReady(true);
		}, 500);

		return setComponentReady(false);
	}, []);

	React.useEffect(() => {
		user ? setComponentReady(true) : setComponentReady(false);

		return user;
	}, [user]);

	return (
		<Layout user={componentReady ? user : null}>
			<NextSeo title={componentReady ? pageTitle : null} />

			<section tw="h-screen flex overflow-hidden bg-white">
				<Sidebar
					ref={ref}
					user={componentReady ? user : null}
					openSidebar={isComponentVisible}
					setOpenSidebar={setIsComponentVisible}
				/>

				<ComingSoon
					pageTitle={pageTitle}
					openSidebar={isComponentVisible}
					setOpenSidebar={setIsComponentVisible}
				/>
			</section>
		</Layout>
	);
};

export default Reports;
