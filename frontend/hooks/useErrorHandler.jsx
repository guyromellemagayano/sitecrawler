/* eslint-disable react-hooks/exhaustive-deps */
import * as Sentry from "@sentry/nextjs";
import useTranslation from "next-translate/useTranslation";
import { useCallback, useEffect, useState } from "react";

/**
 * Custom hook that will handle error response and send them to Sentry
 *
 * @returns {object} errorMessage
 */
export const useGetErrorHandler = (type = null, data = null, error = undefined, isValidating = true) => {
	const [errorMessage, setErrorMessage] = useState([]);

	// Translations
	const { t } = useTranslation();
	const loginBadRequestPostError = t("alerts:loginBadRequestPostError");
	const loginUnknownError = t("alerts:loginUnknownError");

	// Handle SWR hook errors
	const handleErrorResponses = useCallback(async () => {
		let errorStatusCodeMessage = "";

		if (!isValidating) {
			if (error && typeof data === "undefined" && data == null && Math.round(data?.status / 200) !== 1) {
				const status = data?.status ?? null;

				switch (type) {
					case "login":
						switch (status) {
							case 400:
								errorStatusCodeMessage = loginBadRequestPostError;
								break;
							default:
								errorStatusCodeMessage = loginUnknownError;
								break;
						}
						break;
					default:
						errorStatusCodeMessage = error;
						break;
				}

				setErrorMessage((prevState) => [
					...prevState,
					prevState.indexOf(errorStatusCodeMessage) !== -1
						? prevState.find((prevState) => prevState === errorStatusCodeMessage)
						: errorStatusCodeMessage
				]);

				// Capture unknown errors and send to Sentry
				Sentry.captureException(new Error(error));
			}
		}
	}, [type, data, error, isValidating]);

	useEffect(() => {
		handleErrorResponses();
	}, [handleErrorResponses]);

	return errorMessage;
};
