import { useCallback, useEffect, useState } from "react";

/**
 * Custom hook that will handle success responses
 *
 * @returns {object} successMessage
 */
export const useSuccessHandler = (data = null, error = undefined, isValidating = true) => {
	const [successMessage, setSuccessMessage] = useState([]);

	// Handle SWR hook errors
	const handleSuccessResponses = useCallback(async () => {
		let successStatusCodeMessage = "";

		switch (error) {
			default:
				successStatusCodeMessage = error;
				break;
		}

		setSuccessMessage((prevState) => [
			...prevState,
			prevState.indexOf(successStatusCodeMessage) !== -1
				? prevState.find((prevState) => prevState === successStatusCodeMessage)
				: successStatusCodeMessage
		]);
	}, [error]);

	useEffect(() => {
		if (!isValidating && !data && error) {
			handleSuccessResponses();
		} else {
			return;
		}
	}, [handleSuccessResponses, data, error, isValidating]);

	return successMessage;
};
