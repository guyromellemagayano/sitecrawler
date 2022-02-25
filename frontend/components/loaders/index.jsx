import { MemoizedLoadingMessage } from "@components/messages/LoadingMessage";
import { memo } from "react";

/**
 * Custom function to render the `Loader` component
 */
const Loader = ({ message = null }) => {
	return (
		<main className="flex h-screen items-center justify-center">
			<MemoizedLoadingMessage message={message} />
		</main>
	);
};

/**
 * Memoized custom `Loader` component
 */
export const MemoizedLoader = memo(Loader);
