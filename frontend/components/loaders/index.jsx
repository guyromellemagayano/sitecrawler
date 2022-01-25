import { MemoizedLoadingMessage } from "@components/messages/LoadingMessage";
import { memo } from "react";
import "twin.macro";

/**
 * Custom function to render the `Loader` component
 */
const Loader = () => {
	return <MemoizedLoadingMessage />;
};

/**
 * Memoized custom `Loader` component
 */
export const MemoizedLoader = memo(Loader);
