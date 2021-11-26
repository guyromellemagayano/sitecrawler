import { RegistrationForm } from "@components/forms/RegistrationForm";
import { LogoLabel } from "@components/labels/LogoLabel";
import { LoginLink } from "@configs/PageLinks";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { memo } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import ReactHtmlParser from "react-html-parser";
import "twin.macro";

/**
 * Memoized function to render the `RegistrationPageLayout` component.
 */
const RegistrationPageLayout = memo(() => {
	// Translations
	const { t } = useTranslation();
	const agreeTermsPrivacyPolicy = t("registration:agreeTermsPrivacyPolicy");
	const alreadyHaveAccount = t("common:alreadyHaveAccount");
	const isLogin = t("common:isLogin");

	return (
		<div tw="bg-gray-50 overflow-auto h-screen">
			<Scrollbars universal>
				<div tw="block mx-auto xl:max-w-screen-xl mb-8 sm:mb-16 md:mb-20 lg:mb-24">
					<div tw="relative my-8 sm:my-16 md:my-20 lg:my-24">
						<LogoLabel isSignUp />

						<div tw="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
							<div tw="bg-white mt-8 py-8 px-4 shadow-xl rounded-lg sm:px-10">
								<RegistrationForm />
							</div>

							<div tw="relative flex justify-center flex-wrap flex-row text-sm leading-5">
								<span tw="text-center px-2 py-5 text-gray-500">{ReactHtmlParser(agreeTermsPrivacyPolicy)}</span>
							</div>

							<div tw="relative flex justify-center flex-wrap flex-row text-sm leading-5">
								<span tw="p-2 text-gray-500">
									{alreadyHaveAccount}&nbsp;
									<Link href={LoginLink}>
										<a tw="font-medium text-indigo-600 cursor-pointer hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
											{isLogin}
										</a>
									</Link>
								</span>
							</div>
						</div>
					</div>
				</div>
			</Scrollbars>
		</div>
	);
});

export default RegistrationPageLayout;
