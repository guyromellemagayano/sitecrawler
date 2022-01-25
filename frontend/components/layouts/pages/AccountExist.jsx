import { MemoizedLogoLabel } from "@components/labels/LogoLabel";
import { LoginLink } from "@constants/PageLinks";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { memo } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import "twin.macro";

/**
 * Custom function to render the `AccountExistPageLayout` component
 */
const AccountExistPageLayout = () => {
	// Translations
	const { t } = useTranslation();
	const headline = t("accountExist:headline");
	const description = t("accountExist:description");
	const goBackLogin = t("common:goBackLogin");

	return (
		<div tw="bg-gray-50 overflow-auto h-screen">
			<Scrollbars universal>
				<div tw="flex flex-col justify-center h-full">
					<div tw="relative py-12 sm:px-6 lg:px-8">
						<MemoizedLogoLabel isAccountExist />

						<div tw="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
							<div tw="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
								<h3 tw="text-lg leading-6 font-medium text-red-600">{headline}</h3>
								<div tw="mt-3 text-sm leading-5 text-gray-500">
									<p>{description}</p>
								</div>
								<div tw="mt-6 text-sm leading-5">
									<Link href={LoginLink} passHref replace>
										<a tw="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
											{goBackLogin}
										</a>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Scrollbars>
		</div>
	);
};

/**
 * Memoized custom `AccountExistPageLayout` component
 */
export const MemoizedAccountExistPageLayout = memo(AccountExistPageLayout);
