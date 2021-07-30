// React
import { useState, useEffect } from "react";

// External
import "twin.macro";
import { NextSeo } from "next-seo";
import { withResizeDetector } from "react-resize-detector";
import loadable from "@loadable/component";
import PropTypes from "prop-types";

// Hooks
import useUser from "src/hooks/useUser";

// Layout
import Layout from "src/components/Layout";

// Components
import MainSidebar from "src/components/sidebar/MainSidebar";

// Loadable
const ComingSoon = loadable(() => import("src/components/layouts/ComingSoon"));
const Loader = loadable(() => import("src/components/layouts/Loader"));

const Reports = ({ width }) => {
	const [componentReady, setComponentReady] = React.useState(false);
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);

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

		return { user };
	}, [user]);

	return (
		<Layout user={componentReady ? user : null}>
			<NextSeo title={componentReady ? pageTitle : null} />

			<section tw="h-screen flex overflow-hidden bg-white">
				<MainSidebar
					width={width}
					user={componentReady ? user : null}
					openMobileSidebar={openMobileSidebar}
					handleOpenMobileSidebar={() => setOpenMobileSidebar(!openMobileSidebar)}
				/>

				{componentReady ? (
					<ComingSoon
						width={width}
						user={componentReady ? user : null}
						pageTitle={pageTitle}
						openMobileSidebar={openMobileSidebar}
						setOpenMobileSidebar={setOpenMobileSidebar}
					/>
				) : (
					<div tw="mx-auto">
						<Loader />
					</div>
				)}
			</section>
		</Layout>
	);
};

Reports.propTypes = {};

export default withResizeDetector(Reports);
