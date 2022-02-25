import { MemoizedLogoLabel } from "@components/labels/LogoLabel";
import { LoginLink } from "@constants/PageLinks";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { memo } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";

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
		<div className="h-screen overflow-auto bg-gray-50">
			<Scrollbars autoHide universal>
				<div className="flex h-full flex-col justify-center">
					<div className="relative py-12 sm:px-6 lg:px-8">
						<MemoizedLogoLabel isAccountExist />
						<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
							<div className="rounded-lg bg-white py-8 px-4 shadow-xl sm:px-10">
								<h3 className="text-lg font-medium leading-6 text-red-600">{headline}</h3>
								<div className="mt-3 text-sm leading-5 text-gray-500">
									<p>{description}</p>
								</div>
								<div className="mt-6 text-sm leading-5">
									<Link href={LoginLink} passHref replace>
										<a className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
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
