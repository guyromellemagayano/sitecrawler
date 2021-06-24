// React
import { useState, useEffect } from "react";

// External
import "twin.macro";
import { NextSeo } from "next-seo";
import { withResizeDetector } from "react-resize-detector";
import loadable from "@loadable/component";
import PropTypes from "prop-types";

// Hooks
import { useSite } from "src/hooks/useSite";
import useUser from "src/hooks/useUser";

// Layout
import Layout from "src/components/Layout";

// Components
const ComingSoon = loadable(() => import("src/components/layouts/ComingSoon"));
const Loader = loadable(() => import("src/components/layouts/Loader"));

const Reports = ({ width }) => {
	const [componentReady, setComponentReady] = React.useState(false);
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);

	const pageTitle = "Audit Logs";
	const sitesApiEndpoint = "/api/site/?ordering=name";

	const { user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
	});

	const { site } = useSite({
		endpoint: sitesApiEndpoint
	});

	React.useEffect(() => {
		setTimeout(() => {
			setComponentReady(true);
		}, 500);

		return setComponentReady(false);
	}, []);

	return (
		<Layout user={user}>
			<NextSeo title={pageTitle} />

			<section tw="h-screen flex overflow-hidden bg-white">
				<ComingSoon
					width={width}
					user={user}
					pageTitle={pageTitle}
					openMobileSidebar={openMobileSidebar}
					setOpenMobileSidebar={setOpenMobileSidebar}
				/>
			</section>
		</Layout>
	);
};

Reports.propTypes = {};

export default withResizeDetector(Reports);
