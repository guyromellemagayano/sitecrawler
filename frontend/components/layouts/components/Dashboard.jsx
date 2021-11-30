import MobileSidebarButton from "@components/buttons/MobileSidebarButton";
// import AddSite from "@components/sites/AddSite";
import { useComponentVisible } from "@hooks/useComponentVisible";
import Script from "next/script";
import { memo } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import "twin.macro";
import Sidebar from "./Sidebar";

const Dashboard = memo(({ children }) => {
	// Custom hooks
	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

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

						{/* <AddSite /> */}
					</div>

					<Scrollbars universal>
						<div tw="absolute w-full h-full max-w-screen-2xl mx-auto left-0 right-0">
							<div tw="flex flex-col h-full">{children}</div>
						</div>
					</Scrollbars>
				</div>
			</section>
		</>
	);
});

export default Dashboard;
