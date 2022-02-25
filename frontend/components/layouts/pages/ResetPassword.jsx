import { MemoizedResetPasswordForm } from "@components/forms/ResetPasswordForm";
import { MemoizedLogoLabel } from "@components/labels/LogoLabel";
import { LoginLink } from "@constants/PageLinks";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { memo } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";

/**
 * Custom function to render the `ResetPasswordPageLayout` component
 */
const ResetPasswordPageLayout = () => {
	// Translations
	const { t } = useTranslation();
	const alreadyHaveAccount = t("common:alreadyHaveAccount");
	const isLogin = t("common:isLogin");

	return (
		<div className="h-screen overflow-auto bg-gray-50">
			<Scrollbars autoHide universal>
				<div className="flex h-full flex-col justify-center">
					<div className="relative py-12 sm:px-6 lg:px-8">
						<MemoizedLogoLabel isResetPassword />

						<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
							<div className="rounded-lg bg-white py-8 px-4 shadow-xl sm:px-10">
								<MemoizedResetPasswordForm />
							</div>

							<div className="relative flex flex-row flex-wrap justify-center text-sm leading-5">
								<span className="px-2 py-5 text-gray-500">
									{alreadyHaveAccount}&nbsp;
									<Link href={LoginLink} passHref>
										<a className="cursor-pointer font-medium text-indigo-600 transition duration-150 ease-in-out hover:text-indigo-500 focus:underline focus:outline-none">
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
