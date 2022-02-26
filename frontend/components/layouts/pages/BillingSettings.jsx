import { MemoizedPaymentMethodSettings } from "@components/settings/PaymentMethodSettings";
import { memo } from "react";

/**
 * Custom function to render the `BillingSettingsPageLayout` component
 */
const BillingSettingsPageLayout = () => {
	return (
		<div className="grid w-full grid-cols-1 gap-6 py-4 xl:max-w-md">
			<MemoizedPaymentMethodSettings />
		</div>
	);
};

/**
 * Memoized custom `BillingSettingsPageLayout` component
 */
export const MemoizedBillingSettingsPageLayout = memo(BillingSettingsPageLayout);
