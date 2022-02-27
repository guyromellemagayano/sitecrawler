import { DefaultPaymentMethodApiEndpoint } from "@constants/ApiEndpoints";
import { SiteCrawlerAppContext } from "@pages/_app";
import { useContext, useMemo, useState } from "react";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle the current default payment method
 *
 * @param {object} options
 * @returns {object} defaultPaymentMethod, errorDefaultPaymentMethod, validatingDefaultPaymentMethod, defaultPaymentMethodId
 */
export const useDefaultPaymentMethod = (options = null) => {
	const [defaultPaymentMethodId, setDefaultPaymentMethodId] = useState(null);

	// Custom context
	const { setConfig: setDefaultPaymentMethodConfig } = useContext(SiteCrawlerAppContext);

	// Custom variable
	const currentEndpoint = DefaultPaymentMethodApiEndpoint;

	// SWR hook
	const {
		data: defaultPaymentMethod,
		error: errorDefaultPaymentMethod,
		isValidating: validatingDefaultPaymentMethod
	} = useMainSWRConfig(currentEndpoint, options);

	useMemo(async () => {
		if (defaultPaymentMethod) {
			// Show alert message after failed `user` SWR hook fetch
			defaultPaymentMethod
				? setDefaultPaymentMethodConfig({
						isDefaultPaymentMethod: true,
						method: defaultPaymentMethod?.config?.method ?? null,
						status: defaultPaymentMethod?.status ?? null
				  })
				: null;
		}
	}, [defaultPaymentMethod]);

	useMemo(async () => {
		if (defaultPaymentMethod?.id !== null) {
			setDefaultPaymentMethodId(defaultPaymentMethod.id);
		}

		return { defaultPaymentMethodId };
	}, [defaultPaymentMethod, defaultPaymentMethodId]);

	return { defaultPaymentMethod, errorDefaultPaymentMethod, validatingDefaultPaymentMethod, defaultPaymentMethodId };
};
