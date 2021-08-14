// React
import * as React from "react";

// External
import "twin.macro";
import Skeleton from "react-loading-skeleton";

const PagesStatsSkeleton = () => {
	return (
		<div className="h-530" tw="flex flex-col items-start">
			<Skeleton circle={true} duration={2} width={208.23} height={208.23} className="mt-6 block" />
			<div tw="flex flex-col space-y-3 mt-8">
				{[...Array(4)].map((value, key) => (
					<span key={key} tw="space-x-3">
						<Skeleton circle={true} width={20} height={20} />
						<Skeleton width={150} height={20} />
						<Skeleton width={20} height={20} />
					</span>
				))}
			</div>
		</div>
	);
};

export default PagesStatsSkeleton;
