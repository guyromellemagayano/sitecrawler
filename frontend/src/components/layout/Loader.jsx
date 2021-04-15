// External
import loadable from "@loadable/component";
import tw from "twin.macro";

// Components
const AppLogo = loadable(() => import("src/components/logo/AppLogo"));

const Loader = () => {
	return (
		<section tw="flex flex-col justify-center min-h-screen">
			<AppLogo
				className={tw`h-12 w-auto mx-auto mb-16 md:mx-auto lg:mx-0`}
				src="/images/logos/site-logo-dark.svg"
				alt="app-logo"
			/>
		</section>
	);
};

export default Loader;
