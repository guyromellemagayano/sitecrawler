import { MemoizedResetPasswordForm } from "@components/forms/ResetPasswordForm";
import { MemoizedLogoLabel } from "@components/labels/LogoLabel";
import { LoginLink } from "@constants/PageLinks";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { memo } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import "twin.macro";

/**
 * Custom function to render the `ResetPasswordPageLayout` component
 */
const ResetPasswordPageLayout = () => {
	// Translations
	const { t } = useTranslation();
	const alreadyHaveAccount = t("common:alreadyHaveAccount");
	const isLogin = t("common:isLogin");

	return (
		<div tw="bg-gray-50 overflow-auto h-screen">
			<Scrollbars autoHide universal>
				<div tw="flex flex-col justify-center h-full">
					<div tw="relative py-12 sm:px-6 lg:px-8">
						<MemoizedLogoLabel isResetPassword />

						<div tw="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
							<div tw="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
								<MemoizedResetPasswordForm />
							</div>

							<div tw="relative flex justify-center flex-wrap flex-row text-sm leading-5">
								<span tw="px-2 py-5 text-gray-500">
									{alreadyHaveAccount}&nbsp;
									<Link href={LoginLink} passHref>
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
};

/**
 * Memoized custom `ResetPasswordPageLayout` component
 */
export const MemoizedResetPasswordPageLayout = memo(ResetPasswordPageLayout);
