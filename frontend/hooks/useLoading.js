import { ComponentReadyInterval } from "@constants/GlobalValues";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

/**
 * Custom hook that will handle component loading
 *
 * @returns {object} isComponentReady, pathname
 */
export const useLoading = () => {
	const [isComponentReady, setIsComponentReady] = useState(false);

	// Router
	const { isReady } = useRouter();

	// Handle component loading
	useEffect(() => {
		(async () => {
			if (isReady) {
				setIsComponentReady(true);
			}

			return await new Promise((resolve) => {
				setTimeout(() => resolve(isComponentReady), ComponentReadyInterval);
			}).then((result) => result);
		})();
	}, [isReady]);

	return { isComponentReady };
};
