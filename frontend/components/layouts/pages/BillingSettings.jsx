import { MemoizedPaymentMethodSettings } from "@components/settings/PaymentMethodSettings";
import { memo } from "react";
import "twin.macro";

/**
 * Custom function to render the `BillingSettingsPageLayout` component
 */
const BillingSettingsPageLayout = () => {
	return (
		<div tw="py-4 grid grid-cols-1 w-full xl:max-w-md gap-6">
			<MemoizedPaymentMethodSettings />
		</div>
	);
};

/**
 * Memoized custom `BillingSettingsPageLayout` component
 */
export const MemoizedBillingSettingsPageLayout = memo(BillingSettingsPageLayout);
