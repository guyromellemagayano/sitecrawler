// External
import tw from "twin.macro";
import loadable from "@loadable/component";

// Components
const AppLogo = loadable(() => import("src/components/logos/AppLogo"));
const SkeletonEntries = loadable(() => import("src/components/skeletons/SkeletonEntries"));

const AddSiteSkeleton = () => {
	const skeletonLimit = 1;
	const skeletonEntry = (
		<div tw="absolute inset-0 flex flex-col items-center justify-center w-full min-h-screen bg-gray-50">
			<div tw="flex flex-col items-start justify-center max-w-4xl space-y-4">
				<AppLogo
					className={tw`h-12 w-auto mx-auto mb-16 md:mx-auto lg:mx-0`}
					src="/images/logos/site-logo-dark.svg"
					alt="app-logo"
				/>
			</div>
		</div>
	);

	return <SkeletonEntries str={skeletonEntry} limit={skeletonLimit} />;
};

export default AddSiteSkeleton;
