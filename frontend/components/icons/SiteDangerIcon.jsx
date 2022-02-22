import { ShieldExclamationIcon } from "@heroicons/react/solid";
import { memo } from "react";
import "twin.macro";

const SiteDangerIcon = () => {
	return <ShieldExclamationIcon tw="inline-block h-5 w-5 text-red-400" />;
};

export const MemoizedSiteDanagerIcon = memo(SiteDangerIcon);
