import { ComponentReadyInterval } from "@constants/GlobalValues";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

/**
 * Custom hook that will handle component loading
 *
 * @returns {object} isComponentReady, pathname
 */
export const useLoading = () => {
	const [isComponentReady, setIsComponentReady] = useState(false);

	// Router
	const { isReady, pathname } = useRouter();

	// Handle component loading
	const handleComponentLoading = useCallback(async () => {
		if (isReady && pathname) {
			setTimeout(() => {
				setIsComponentReady(true);
			}, ComponentReadyInterval);
		}

		return () => {
			setIsComponentReady(false);
		};
	}, [isReady, pathname]);

	useEffect(() => {
		handleComponentLoading();
	}, [handleComponentLoading]);

	return { isComponentReady, pathname };
};
