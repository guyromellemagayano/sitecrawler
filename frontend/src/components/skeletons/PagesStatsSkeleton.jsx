// React
import * as React from "react";

// External
import "twin.macro";
import Skeleton from "react-loading-skeleton";

const PagesStatsSkeleton = () => {
	return (
		<div className="w-600 h-530" tw="flex flex-col items-center justify-start mx-auto">
			<span tw="flex justify-center">
				<Skeleton circle={true} duration={2} width={208.23} height={208.23} className="my-8" />
			</span>
			<div tw="flex flex-col space-y-3 mt-7">
				{[...Array(5)].map((value, key) => (
					<span key={key} tw="space-x-3" className="w-270">
						<Skeleton circle={true} width={20} height={20} />
						<Skeleton width={200} height={20} />
						<Skeleton width={20} height={20} />
					</span>
				))}
			</div>
		</div>
	);
};

export default PagesStatsSkeleton;
