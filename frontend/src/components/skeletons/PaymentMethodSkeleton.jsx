// External
import tw from "twin.macro";
import Skeleton from "react-loading-skeleton";

// Components
import SkeletonEntries from "@components/skeletons/common/SkeletonEntries";

const PaymentMethodSkeleton = () => {
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

export default PaymentMethodSkeleton;
