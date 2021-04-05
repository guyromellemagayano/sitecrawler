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

// Utils
import { getCookie } from "src/utils/cookie";

// Hooks
import { useSite } from "src/hooks/useSite";
import useUser from "src/hooks/useUser";

// Layout
import Layout from "src/components/Layout";

// Components
const ComingSoon = loadable(() => import("src/components/layout/ComingSoon"));

const Reports = ({ width, token }) => {
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const [pageLoaded, setPageLoaded] = useState(false);
	const [siteData, setSiteData] = useState([]);
	const [userData, setUserData] = useState([]);

	const pageTitle = "Audit Logs";
	const siteApiEndpoint = "/api/site/?ordering=name";

	const { user: user, userError: userError } = useUser({ refreshInterval: 1000 });
	const { site: site, siteError: siteError } = useSite({
		endpoint: siteApiEndpoint,
		refreshInterval: 1000,
	});

	useEffect(() => {
		if (
			token &&
			token !== undefined &&
			Object.keys(token).length > 0 &&
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

		if (userError || siteError) {
			// TODO: add generic alert here
			console.log("ERROR: " + userError ? userError : siteError);
		}
	}, [token, user, site]);

	return (
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
	);
};

Reports.propTypes = {};

export default withResizeDetector(Reports);

export async function getServerSideProps({ req }) {
	let token = getCookie("token", req);

	if (!token) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			token: token,
		},
	};
}
