// External
import tw from "twin.macro";
import loadable from "@loadable/component";
import Skeleton from "react-loading-skeleton";

// Components
const SkeletonEntries = loadable(() => import("@components"), {
	resolveComponent: (components) => components.SkeletonEntries
});

const PaymentMethodsSkeleton = () => {
	const skeletonLimit = 1;
	const skeletonEntry = (
		<div tw="flex items-center space-x-3 my-0">
			<div>
				<Skeleton duration={2} width={50} height={20} />
			</div>
			<div tw="ml-3">
				<Skeleton duration={2} width={250} />
			</div>
		</div>
	);

	return <SkeletonEntries str={skeletonEntry} limit={skeletonLimit} />;
};

export default PaymentMethodsSkeleton;
