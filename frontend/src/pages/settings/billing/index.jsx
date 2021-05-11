// React
import { useState, useEffect } from "react";

// NextJS
// import Link from "next/link";

// External
// import { ChevronRightIcon, HomeIcon } from "@heroicons/react/solid";
import { NextSeo } from "next-seo";
import { withResizeDetector } from "react-resize-detector";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import tw from "twin.macro";

// JSON
// import BillingLabel from "public/labels/pages/settings/billing.json";

// Hooks
import useUser from "src/hooks/useUser";
import { usePaymentMethods } from "src/hooks/useStripePromise";

// Layout
import Layout from "src/components/Layout";

// Components
// const AppLogo = loadable(() => import("src/components/logos/AppLogo"));
// const MainSidebar = loadable(() => import("src/components/sidebar/MainSidebar"));
// const MobileSidebarButton = loadable(() => import("src/components/buttons/MobileSidebarButton"));
// const ProfileSkeleton = loadable(() => import("src/components/skeletons/ProfileSkeleton"));
// const SettingsCard = loadable(() => import("src/components/pages/settings/billing/Card"));
// const SiteFooter = loadable(() => import("src/components/layouts/Footer"));
const ComingSoon = loadable(() => import("src/components/layouts/ComingSoon"));
const Loader = loadable(() => import("src/components/layouts/Loader"));

const Billing = ({ width }) => {
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const [pageLoaded, setPageLoaded] = useState(false);
	// const [paymentMethodData, setPaymentMethodData] = useState([]);
	const [userData, setUserData] = useState([]);

	const pageTitle = "Billing Settings";
	// const homeLabel = "Home";
	// const homePageLink = "/";
	// const paymentMethodApiEndpoint = '/api/stripe/payment-method/'

	const { user: user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
	});

	const { paymentMethods: paymentMethods } = usePaymentMethods({
		refreshInterval: 0
	})

	useEffect(() => {
		if (
			user &&
			user !== undefined &&
			Object.keys(user).length > 0 &&
			paymentMethods &&
			paymentMethods !== undefined
		) {
			setUserData(user);
			// setPaymentMethodData(paymentMethods)

			setTimeout(() => {
				setPageLoaded(true);
			}, 500);
		}
	}, [user, paymentMethods]);

	console.log(width)

	return pageLoaded ? (
		<Layout user={user}>
			<NextSeo title={pageTitle} />

			<section tw="h-screen flex overflow-hidden bg-white">
				<ComingSoon
					width={width}
					user={userData}
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

Billing.propTypes = {};

export default withResizeDetector(Billing);
