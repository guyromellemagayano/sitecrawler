import Breadcrumbs from "@components/breadcrumbs";
import DeleteUserAccountSettings from "@components/settings/DeleteUserAccountSettings";
import PasswordSettings from "@components/settings/PasswordSettings";
import PersonalSettings from "@components/settings/PersonalSettings";
import useTranslation from "next-translate/useTranslation";
import { memo } from "react";
import "twin.macro";
import Footer from "../components/Footer";

/**
 * Memoized function to render the `ProfileSettingsPageLayout` component
 */
const ProfileSettingsPageLayout = memo(() => {
	// Translations
	const { t } = useTranslation("common");
	const profileSettings = t("profileSettings");

	return (
		<div tw="max-w-full p-4 sm:px-6 md:px-8">
			<div tw="w-full py-6 mx-auto grid gap-16 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12">
				<div tw="lg:col-span-2 xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200">
					<div tw="max-w-full p-4">
						<Breadcrumbs isOther pageTitle={profileSettings} />

						<div tw="pt-4 m-auto">
							<h2 tw="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">{profileSettings}</h2>
						</div>
					</div>

					<div tw="space-y-12 divide-y divide-gray-200">
						<PersonalSettings />
						<PasswordSettings />
						<DeleteUserAccountSettings />
					</div>
				</div>
			</div>

			<div tw="static bottom-0 w-full mx-auto p-4 border-t border-gray-200 bg-white">
				<Footer />
			</div>
		</div>
	);
});

export default ProfileSettingsPageLayout;
