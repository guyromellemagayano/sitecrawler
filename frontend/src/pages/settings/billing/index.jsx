// React
import * as React from "react";

// NextJS
// import Link from "next/link";

// External
// import { ChevronRightIcon, HomeIcon } from "@heroicons/react/solid";
import "twin.macro";
import { NextSeo } from "next-seo";
import { withResizeDetector } from "react-resize-detector";
import loadable from "@loadable/component";
import PropTypes from "prop-types";

// JSON
import BillingLabel from "public/labels/pages/settings/billing.json";

// Hooks
import useUser from "src/hooks/useUser";
// import { usePaymentMethods } from "src/hooks/useStripePromise";

// Layout
import Layout from "src/components/Layout";

// Components
import MainSidebar from "src/components/sidebar/MainSidebar";

// const AppLogo = loadable(() => import("src/components/logos/AppLogo"));
// const MainSidebar = loadable(() => import("src/components/sidebar/MainSidebar"));
// const MobileSidebarButton = loadable(() => import("src/components/buttons/MobileSidebarButton"));
// const ProfileSkeleton = loadable(() => import("src/components/skeletons/ProfileSkeleton"));
// const SettingsCard = loadable(() => import("src/components/pages/settings/billing/Card"));
// const SiteFooter = loadable(() => import("src/components/layouts/Footer"));

// Loadable
const ComingSoon = loadable(() => import("src/components/layouts/ComingSoon"));
const Loader = loadable(() => import("src/components/layouts/Loader"));

const Billing = ({ width }) => {
	// const [paymentMethodData, setPaymentMethodData] = React.useState([]);
	const [componentReady, setComponentReady] = React.useState(false);
	const [openMobileSidebar, setOpenMobileSidebar] = React.useState(false);

	const pageTitle = BillingLabel[0].label;
	// const homeLabel = "Home";
	// const homePageLink = "/sites";
	// const paymentMethodApiEndpoint = '/api/stripe/payment-method/'

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

	// const { paymentMethods } = usePaymentMethods();

	return (
		<Layout user={componentReady ? user : null}>
			<NextSeo title={componentReady ? pageTitle : null} />

			<section tw="h-screen flex overflow-hidden bg-white">
				<MainSidebar
					width={width}
					user={componentReady ? user : null}
					openMobileSidebar={openMobileSidebar}
					setOpenMobileSidebar={setOpenMobileSidebar}
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

Billing.propTypes = {};

export default withResizeDetector(Billing);
