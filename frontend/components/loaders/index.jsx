import LoadingMessage from "@components/messages/LoadingMessage";
import { memo } from "react";
import "twin.macro";

export const Loader = memo(() => {
	return <LoadingMessage />;
});
