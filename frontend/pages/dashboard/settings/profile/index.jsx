import { MobileSidebarButton } from "@components/buttons/MobileSidebarButton";
import Sidebar from "@components/layouts/components/Sidebar";
import ProfileSettingsPageLayout from "@components/layouts/pages/ProfileSettings";
import { UserApiEndpoint } from "@configs/ApiEndpoints";
import { LoginLink } from "@configs/PageLinks";
import { server } from "@configs/ServerEnv";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useGetMethod } from "@hooks/useHttpMethod";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import "twin.macro";

// Pre-render `user` data with NextJS SSR. Redirect to a login page if current user is not allowed to access that page (403 Forbidden) or redirect to the sites dashboard page if the user is still currently logged in (200 OK).
export async function getServerSideProps() {
	const userResponse = await useGetMethod(`${server + UserApiEndpoint}`);
	const userData = userResponse?.data ?? null;
	const userStatus = userResponse?.status ?? null;

	if (
		typeof userData !== "undefined" &&
		userData !== null &&
		!userData?.detail &&
		Object.keys(userData)?.length > 0 &&
		Math.round(userStatus / 200 === 1)
	) {
		return {
			props: {}
		};
	} else {
		return {
			redirect: {
				destination: LoginLink,
				permanent: false
			}
		};
	}
}

export default function ProfileSettings() {
	// Translations
	const { t } = useTranslation("common");
	const profileSettings = t("profileSettings");

	return (
		<>
			<NextSeo title={profileSettings} />
			<ProfileSettingsPageLayout />
		</>
	);
}

ProfileSettings.getLayout = function getLayout(page) {
	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

	return (
		<Layout>
			<section tw="h-screen overflow-hidden bg-gray-50 flex flex-col justify-center">
				<Sidebar ref={ref} openSidebar={isComponentVisible} setOpenSidebar={setIsComponentVisible} />

				{/* Main content */}
				<div tw="flex flex-col w-0 flex-1 overflow-hidden min-h-screen">
					<div tw="relative flex-shrink-0 flex">
						<div tw="border-b flex-shrink-0 flex">
							<MobileSidebarButton openSidebar={isComponentVisible} setOpenSidebar={setIsComponentVisible} />
						</div>

						{/* <AddSite /> */}
					</div>

					<Scrollbars universal>
						<div tw="absolute w-full h-full max-w-screen-2xl mx-auto left-0 right-0">
							<div tw="flex flex-col h-full">{page}</div>
						</div>
					</Scrollbars>
				</div>
			</section>
		</Layout>
	);
};
