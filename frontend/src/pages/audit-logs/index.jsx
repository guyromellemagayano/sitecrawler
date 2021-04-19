// React
import { useState, useEffect } from "react";

// NextJS
import Link from "next/link";

// External
import { NextSeo } from "next-seo";
import { withResizeDetector } from "react-resize-detector";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import tw from "twin.macro";

// Hooks
import { useSite } from "src/hooks/useSite";
import useUser from "src/hooks/useUser";

// Layout
import Layout from "src/components/Layout";

// Components
const ComingSoon = loadable(() => import("src/components/layout/ComingSoon"));
const Loader = loadable(() => import("src/components/layout/Loader"));

const Reports = ({ width }) => {
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const [pageLoaded, setPageLoaded] = useState(false);
	const [siteData, setSiteData] = useState([]);
	const [userData, setUserData] = useState([]);

	const pageTitle = "Audit Logs";
	const sitesApiEndpoint = "/api/site/?ordering=name";

	const { user: user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login",
		refreshInterval: 1000
	});

	const { site: site } = useSite({
		endpoint: sitesApiEndpoint,
		refreshInterval: 1000
	});

	useEffect(() => {
		if (
			user &&
			user !== undefined &&
			Object.keys(user).length > 0 &&
			site &&
			site !== undefined &&
			Object.keys(site).length > 0
		) {
			setTimeout(() => {
				setPageLoaded(true);
			}, 500);

			setUserData(user);
			setSiteData(site);
		}
	}, [user, site]);

	useEffect(() => {
		if (
			userData &&
			userData !== undefined &&
			userData !== [] &&
			Object.keys(userData).length > 0 &&
			siteData &&
			siteData !== undefined &&
			siteData !== [] &&
			Object.keys(siteData).length > 0
		) {
			setTimeout(() => {
				setPageLoaded(true);
			}, 500);
		}
	}, [userData, siteData]);

	return pageLoaded ? (
		<Layout user={user}>
			<NextSeo title={pageTitle} />

			<section tw="h-screen flex overflow-hidden bg-white">
				<ComingSoon
					width={width}
					user={userData}
					site={siteData}
					pageTitle={pageTitle}
					pageLoaded={pageLoaded}
					openMobileSidebar={openMobileSidebar}
					setOpenMobileSidebar={setOpenMobileSidebar}
				/>
			</section>
		</Layout>
	) : (
		<Loader />
	);
};

Reports.propTypes = {};

export default withResizeDetector(Reports);
