// External
import tw from "twin.macro";
import loadable from "@loadable/component";
import Skeleton from "react-loading-skeleton";

// Components
const SkeletonEntries = loadable(() => import("src/components/skeletons/SkeletonEntries"));

const PaymentMethodsSkeleton = () => {
	const skeletonLimit = 1;
	const skeletonEntry = (
		<ul tabIndex="-1" role="listbox" aria-labelledby="listbox-label" tw="max-h-60 overflow-auto focus:outline-none">
			<li tw="select-none relative py-2 pl-3 pr-9 focus:outline-none">
				<div tw="flex items-center space-x-3 my-1">
					<div>
						<Skeleton duration={2} width={50} height={20} />
					</div>
					<div tw="ml-3">
						<Skeleton duration={2} width={250} />
					</div>
				</div>
			</li>
		</ul>
	);

	return <SkeletonEntries str={skeletonEntry} limit={skeletonLimit} />;
};

export default PaymentMethodsSkeleton;
