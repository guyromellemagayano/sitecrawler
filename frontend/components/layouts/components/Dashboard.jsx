import MobileSidebarButton from "@components/buttons/MobileSidebarButton";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useUser } from "@hooks/useUser";
import dynamic from "next/dynamic";
import Script from "next/script";
import { useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import "twin.macro";
import Sidebar from "./Sidebar";

/**
 * Dynamic imports
 */
const AddSite = dynamic(() => import("@components/sites/AddSite"), { ssr: true });
const Loader = dynamic(() => import("@components/loaders"), { ssr: true });

export default function Dashboard({ children }) {
	const [isComponentReady, setIsComponentReady] = useState(false);

	// SWR hooks
	const { user, errorUser, validatingUser } = useUser();

	// Custom hooks
	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

	useEffect(() => {
		if (
			!validatingUser &&
			!errorUser &&
			typeof user !== "undefined" &&
			user !== null &&
			Object.keys(user)?.length > 0 &&
			Math.round(user / 200 === 1)
		) {
			setIsComponentReady(true);
		}
	}, [user, errorUser, validatingUser]);

	return (
		<>
			<Script src="/scripts/beacon.js" strategy="lazyOnload" />
			<Script src="/scripts/usetiful.js" strategy="beforeInteractive" />

			<section tw="h-screen overflow-hidden bg-gray-50 flex">
				<Sidebar ref={ref} openSidebar={isComponentVisible} setOpenSidebar={setIsComponentVisible} />

				<div tw="flex flex-col w-0 flex-1 overflow-hidden min-h-screen">
					<div tw="relative flex-shrink-0 flex">
						<div tw="border-b flex-shrink-0 flex">
							<MobileSidebarButton openSidebar={isComponentVisible} setOpenSidebar={setIsComponentVisible} />
						</div>

						<AddSite />
					</div>

					<Scrollbars universal>
						<div tw="absolute w-full h-full max-w-screen-2xl mx-auto left-0 right-0">
							<div tw="flex flex-col h-full">
								{isComponentReady ? (
									children
								) : (
									<div tw="mx-auto">
										<Loader />
									</div>
								)}
							</div>
						</div>
					</Scrollbars>
				</div>
			</section>
		</>
	);
}
