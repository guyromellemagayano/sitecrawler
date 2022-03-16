import { MemoizedCardInformationForm } from "@components/forms/CardInformationForm";
import { SiteCrawlerAppContext } from "@pages/_app";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import useTranslation from "next-translate/useTranslation";
import { memo, useContext, useMemo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `BillingSettingsPageLayout` component
 */
const BillingSettingsPageLayout = () => {
	// Translations
	const { t } = useTranslation("settings");
	const cardInformationTitle = t("settings:cardInformationSettings.title");

	// Custom context
	const { isComponentReady, stripePromise } = useContext(SiteCrawlerAppContext);

	// `stripePromise` data state
	const stripePromiseData = useMemo(() => {
		if (isComponentReady && stripePromise) {
			// Handle `stripe` promise data
			const stripePromisePublishableKey = stripePromise?.data?.publishable_key ?? null;

			if (stripePromisePublishableKey) {
				const data = loadStripe(stripePromisePublishableKey);

				return data;
			}
		}
	}, [stripePromise, isComponentReady]);

	return (
		<div className="grid w-full grid-cols-1 gap-6 py-4 xl:max-w-md">
			<div className="pb-12">
				<h5 className="text-xl font-bold leading-6 text-gray-900">
					{isComponentReady ? cardInformationTitle : <Skeleton duration={2} width={175} height={24} />}
				</h5>

				{stripePromiseData ? (
					<Elements stripe={stripePromiseData}>
						<MemoizedCardInformationForm />
					</Elements>
				) : (
					<div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4">
						<div className="sm:col-span-1">
							<div className="block">
								<Skeleton duration={2} width={150} height={20} />
							</div>

							<div className="relative mt-1">
								<Skeleton duration={2} height={38} className="w-full" />
							</div>
						</div>

						<div className="sm:col-span-1">
							<div className="flex flex-col justify-between sm:flex-row md:flex-col lg:flex-row">
								<div className="order-1 flex justify-start sm:mr-1 sm:w-auto sm:flex-initial sm:flex-row lg:order-1 lg:w-full">
									<span className="inline-flex">
										<Skeleton duration={2} width={82.39} height={38} className="py-2 px-4" />
									</span>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

/**
 * Memoized custom `BillingSettingsPageLayout` component
 */
export const MemoizedBillingSettingsPageLayout = memo(BillingSettingsPageLayout);
