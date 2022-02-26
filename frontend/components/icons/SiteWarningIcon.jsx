import { ExclamationIcon } from "@heroicons/react/solid";
import { memo } from "react";

const SiteWarningIcon = () => {
	return <ExclamationIcon className="inline-block h-5 w-5 text-yellow-400" />;
};

export const MemoizedSiteWarningIcon = memo(SiteWarningIcon);
