import { ShieldExclamationIcon } from "@heroicons/react/solid";
import { memo } from "react";

const SiteDangerIcon = () => {
	return <ShieldExclamationIcon className="inline-block h-4 w-4 text-red-400" />;
};

export const MemoizedSiteDanagerIcon = memo(SiteDangerIcon);
