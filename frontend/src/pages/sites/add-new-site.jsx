// React
import * as React from "react";

// NextJS
import Link from "next/link";

// External
import "twin.macro";
import { NextSeo } from "next-seo";
import { Scrollbars } from "react-custom-scrollbars-2";

// Enums
import { GlobalLabels, SiteLogoDark } from "@enums/GlobalValues";
import { LoginLink, SitesLink } from "@enums/PageLinks";

// Hooks
import { useComponentVisible } from "@hooks/useComponentVisible";
import useUser from "@hooks/useUser";

// Components
import AddSiteSteps from "@components/steps/AddSiteSteps";
import AppLogo from "@components/logos/AppLogo";
import Breadcrumbs from "@components/breadcrumbs";
import HowToSetup from "@components/sites/HowToSetup";
import Layout from "@components/layouts";
import Loader from "@components/loader";
import MobileSidebarButton from "@components/buttons/MobileSidebarButton";
import Sidebar from "@components/layouts/Sidebar";
import Footer from "@components/layouts/Footer";

const AddNewSite = () => {
	const [componentReady, setComponentReady] = React.useState(false);

	const pageTitle = "Sites";
	const pageDetailTitle = "Add New Site";

	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

	const { user } = useUser({
		redirectIfFound: false,
		redirectTo: LoginLink
	});

	React.useEffect(() => {
		user ? setComponentReady(true) : setComponentReady(false);

		return user;
	}, [user]);

	return (
		<Layout user={user}>
			<NextSeo title={pageDetailTitle} />

			<section tw="h-screen flex overflow-hidden bg-white">
				<Sidebar
					ref={ref}
					user={user}
					openSidebar={isComponentVisible}
					setOpenSidebar={setIsComponentVisible}
				/>

				{componentReady ? (
					<div tw="flex flex-col w-0 flex-1 overflow-hidden">
						<div tw="relative flex-shrink-0 flex bg-white">
							<div tw="border-b flex-shrink-0 flex">
								<MobileSidebarButton
									openSidebar={isComponentVisible}
									setOpenSidebar={setIsComponentVisible}
								/>
							</div>

							<Link href={SitesLink} passHref>
								<a tw="p-1 block w-full cursor-pointer lg:hidden">
									<AppLogo
										tw="w-48 h-auto"
										src={SiteLogoDark}
										alt={GlobalLabels[0].label}
										width={GlobalLabels[0].width}
										height={GlobalLabels[0].height}
									/>
								</a>
							</Link>
						</div>

						<Scrollbars universal>
							<main
								tw="flex-1 relative z-0 max-w-screen-2xl mx-auto overflow-y-auto focus:outline-none"
								tabIndex="0"
							>
								<div tw="max-w-full p-4 sm:px-6 md:px-8">
									<div tw="w-full py-6 mx-auto grid gap-16 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12">
										<div tw="lg:col-span-2 xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200">
											<div tw="max-w-full p-4">
												<Breadcrumbs
													isSites
													pageTitle={pageTitle}
													pageDetailTitle={pageDetailTitle}
												/>
											</div>

											<AddSiteSteps />
										</div>

										<div tw="lg:col-span-1">
											<HowToSetup />
										</div>
									</div>

									<div tw="static bottom-0 w-full mx-auto p-4 border-t border-gray-200 bg-white">
										<Footer />
									</div>
								</div>
							</main>
						</Scrollbars>
					</div>
				) : (
					<div tw="mx-auto">
						<Loader />
					</div>
				)}
			</section>
		</Layout>
	);
};

export default AddNewSite;
