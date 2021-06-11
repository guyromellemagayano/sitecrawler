// NextJS
import Link from "next/link";

// External
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/solid";
import tw from "twin.macro";

// JSON
import ComingSoonLabel from "public/labels/components/layout/ComingSoon.json";

// Components
import AppLogo from "src/components/logos/AppLogo";
import ComingSoonSkeleton from "src/components/skeletons/ComingSoonSkeleton";
import MainSidebar from "src/components/sidebar/MainSidebar";
import MobileSidebarButton from "src/components/buttons/MobileSidebarButton";
import SiteFooter from "src/components/layouts/Footer";

const ComingSoon = ({ width, user, pageTitle, openMobileSidebar, setOpenMobileSidebar }) => {
	const homeLabel = "Home";
	const homePageLink = "/";

	return (
		<>
			<MainSidebar
				width={width}
				user={user}
				openMobileSidebar={openMobileSidebar}
				setOpenMobileSidebar={setOpenMobileSidebar}
			/>

			<div tw="flex flex-col w-0 flex-1 overflow-hidden">
				<div tw="relative z-10 flex-shrink-0 flex  lg:h-0 bg-white border-b lg:border-0 border-gray-200 lg:mb-4">
					<MobileSidebarButton openMobileSidebar={openMobileSidebar} setOpenMobileSidebar={setOpenMobileSidebar} />
					<Link href={homePageLink} passHref>
						<a tw="p-1 block w-full cursor-pointer lg:hidden">
							<AppLogo className={tw`mt-4 mx-auto h-8 w-auto`} src="/images/logos/site-logo-dark.svg" alt="app-logo" />
						</a>
					</Link>
				</div>

				<main tw="flex-1 relative z-0 overflow-y-auto focus:outline-none" tabIndex="0">
					<div tw="w-full p-6 mx-auto grid gap-16 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12">
						<div tw="lg:col-span-2 xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200">
							{user ? (
								<>
									<div tw="max-w-full py-4 px-8">
										<nav tw="flex pt-4 pb-8" aria-label="Breadcrumb">
											<ol tw="flex items-center space-x-4">
												<li>
													<div>
														<Link href={homePageLink} passHref>
															<a tw="text-gray-400 hover:text-gray-500">
																<HomeIcon tw="flex-shrink-0 h-5 w-5" />
																<span tw="sr-only">{homeLabel}</span>
															</a>
														</Link>
													</div>
												</li>
												<li>
													<div tw="flex items-center">
														<ChevronRightIcon tw="flex-shrink-0 h-5 w-5 text-gray-400" />
														<p aria-current="page" tw="cursor-default ml-4 text-sm font-medium text-gray-700">
															{pageTitle}
														</p>
													</div>
												</li>
											</ol>
										</nav>
										<div tw="pt-4 m-auto">
											<h4 tw="text-2xl leading-6 font-medium text-gray-900">{ComingSoonLabel[0].label}</h4>
											<p tw="max-w-full mt-2 text-sm leading-5 text-gray-500">{ComingSoonLabel[1].label}</p>
										</div>
									</div>
									<div tw="max-w-full p-8 pt-0 pb-2">{/* Content Here */}</div>
								</>
							) : (
								<ComingSoonSkeleton />
							)}
						</div>
					</div>
					<div tw="static bottom-0 w-full mx-auto px-12 py-4 bg-white border-t border-gray-200">
						<SiteFooter />
					</div>
				</main>
			</div>
		</>
	);
};

ComingSoon.propTypes = {};

export default ComingSoon;
