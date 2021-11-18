import { ResetPasswordForm } from "@components/forms/ResetPasswordForm";
import { UpdatePasswordForm } from "@components/forms/UpdatePasswordForm";
import { LogoLabel } from "@components/labels/LogoLabel";
import { LoginLink } from "@configs/PageLinks";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import PropTypes from "prop-types";
import * as React from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import ReactHtmlParser from "react-html-parser";
import "twin.macro";

/**
 * Memoized function to render the reset password page layout.
 */
export const ResetPasswordPageLayout = React.memo(() => {
	// Translations
	const { t } = useTranslation();
	const alreadyHaveAccount = t("common:alreadyHaveAccount");
	const isLogin = t("common:isLogin");

	return (
		<div tw="bg-gray-50 overflow-auto h-screen">
			<Scrollbars universal>
				<div tw="flex flex-col justify-center h-full">
					<div tw="relative py-12 sm:px-6 lg:px-8">
						<LogoLabel isResetPassword />

						<div tw="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
							<div tw="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
								<ResetPasswordForm />
							</div>

							<div tw="relative flex justify-center flex-wrap flex-row text-sm leading-5">
								<span tw="px-2 py-5 text-gray-500">
									{ReactHtmlParser(alreadyHaveAccount)}&nbsp;
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

/**
 * Memoized function to render the reset password form page layout.
 *
 * @param {string} uid
 * @param {string} token
 */
export const ResetPasswordFormPageLayout = React.memo(({ uid, token }) => {
	// Translations
	const { t } = useTranslation();
	const alreadyHaveAccount = t("common:alreadyHaveAccount");
	const isLogin = t("common:isLogin");

	return (
		<div tw="bg-gray-50 overflow-auto h-screen">
			<Scrollbars universal>
				<div tw="flex flex-col justify-center h-full">
					<div tw="relative py-12 sm:px-6 lg:px-8">
						<LogoLabel isResetPasswordForm />

						<div tw="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
							<div tw="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
								<UpdatePasswordForm uid={uid} token={token} />
							</div>

							<div tw="relative flex justify-center flex-wrap flex-row text-sm leading-5">
								<span tw="px-2 py-5 text-gray-500">
									{ReactHtmlParser(alreadyHaveAccount)}&nbsp;
									<Link href={LoginLink} passHref replace>
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

ResetPasswordFormPageLayout.propTypes = {
	token: PropTypes.string,
	uid: PropTypes.string
};
