import { memo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "twin.macro";
import { MemoizedSkeletonEntries } from "./common/SkeletonEntries";

/**
 * Custom function to render the `ProfileSidebarSkeleton` component
 */
export function ProfileSidebarSkeleton() {
	const skeletonLimit = 1;
	const skeletonEntry = (
		<>
			<Skeleton duration={2} width={85} height={15} tw="mb-1" />
			<Skeleton duration={2} width={130} height={15} />
		</>
	);

	return <MemoizedSkeletonEntries str={skeletonEntry} limit={skeletonLimit} />;
}

/**
 * Memoized custom `ProfileSidebarSkeleton` component
 */
export const MemoizedProfileSidebarSkeleton = memo(ProfileSidebarSkeleton);
