import { PaymentMethodApiEndpoint } from "@constants/ApiEndpoints";
import { SiteCrawlerAppContext } from "@pages/_app";
import { useContext } from "react";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle all the payment methods
 *
 * @param {object} options
 * @returns {object} paymentMethods, errorPaymentMethods, validatingPaymentMethods
 */
export const usePaymentMethods = (options = null) => {
	// Custom context
	const { setConfig: setPaymentMethodsConfig } = useContext(SiteCrawlerAppContext);

	// Custom variable
	const currentEndpoint = PaymentMethodApiEndpoint;

	// SWR hook
	const {
		data: paymentMethods,
		error: errorPaymentMethods,
		isValidating: validatingPaymentMethods
	} = useMainSWRConfig(currentEndpoint, options);

	// TODO: Figure out what object this endpoint outputs

	return { paymentMethods, errorPaymentMethods, validatingPaymentMethods };
};
