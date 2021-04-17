// External
import loadable from "@loadable/component";
import tw from "twin.macro";

// Components
const AppLogo = loadable(() => import("src/components/logo/AppLogo"));

const Loader = () => {
	const loaderMessage = "Loading...";

	return (
		<section tw="flex flex-col justify-center min-h-screen">
			<AppLogo
				className={tw`h-12 w-auto mx-auto mb-2 md:mx-auto lg:mx-0`}
				src="/images/logos/site-logo-dark.svg"
				alt="app-logo"
			/>
			<div tw="px-4 py-5 sm:p-6 flex items-center justify-center">
				<h3 tw="text-lg leading-6 font-medium text-gray-500">{loaderMessage}</h3>
			</div>
		</section>
	);
};

export default Loader;
