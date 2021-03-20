// React
import { useState, useEffect } from "react";

// External
import { NextSeo } from "next-seo";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import tw from "twin.macro";

// Layout
import Layout from "src/components/Layout";

// Components
const MainSidebar = loadable(() => import("src/components/sidebar/MainSidebar"));
const MobileSidebar = loadable(() => import("src/components/sidebar/MobileSidebar"));
const ComingSoon = loadable(() => import("src/components/layout/ComingSoon"));

const Reports = () => {
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const [pageLoaded, setPageLoaded] = useState(false);

	const pageTitle = "Audit Logs";

	const { user } = useAuth();

	useEffect(() => {
		if (user && user !== undefined) {
			setTimeout(() => {
				setPageLoaded(true);
			}, 500);
		}
	}, [user]);

	return (
		<Layout>
			<NextSeo title={pageTitle} />

			<section tw="h-screen flex overflow-hidden bg-white">
				{/* FIXME: fix mobile sidebar */}
				{/* <MobileSidebar show={openMobileSidebar} setShow={setOpenMobileSidebar} /> */}
				<MainSidebar />

				<ComingSoon
					pageTitle={pageTitle}
					pageLoaded={pageLoaded}
					openMobileSidebar={openMobileSidebar}
					setOpenMobileSidebar={setOpenMobileSidebar}
				/>
			</section>
		</Layout>
	);
};

Reports.propTypes = {};

export default Reports;
