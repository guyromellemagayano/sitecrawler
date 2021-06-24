// External
import "twin.macro";

const Loader = () => {
	const loaderMessage = "Loading...";

	return (
		<section tw="flex flex-col justify-center min-h-screen">
			<div tw="px-4 py-5 sm:p-6 flex items-center justify-center">
				<h3 tw="text-lg leading-6 font-medium text-gray-500">{loaderMessage}</h3>
			</div>
		</section>
	);
};

export default Loader;
