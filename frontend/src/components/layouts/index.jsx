import { DashboardSlug } from "@configs/PageLinks";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import "twin.macro";

/**
 * Dynamic imports
 */
const GlobalStyles = dynamic(() => import("@styles/GlobalStyles"), { ssr: true });
const TopProgressBar = dynamic(() => import("@components/top-progress-bar"), { ssr: true });
const Dashboard = dynamic(() => import("./components/Dashboard"), { ssr: true });

const Layout = ({ children }) => {
	const [isDashboard, setIsDashboard] = useState(false);

	// Router
	const { pathname } = useRouter();

	useEffect(() => {
		pathname.includes(DashboardSlug) ? setIsDashboard(true) : setIsDashboard(false);
	}, []);

	return (
		<>
			<GlobalStyles />
			<TopProgressBar />
			<main tw="h-screen">{isDashboard ? <Dashboard /> : children}</main>
		</>
	);
};

Layout.propTypes = {
	children: PropTypes.any
};

export default Layout;
