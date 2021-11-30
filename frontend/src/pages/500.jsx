import Layout from "@components/layouts";
import ErrorPageLayout from "@components/layouts/pages/Error";

/**
 * Memoized `Custom500` page.
 */
const Custom500 = () => {
	return (
		<Layout>
			<ErrorPageLayout statusCode={404} />
		</Layout>
	);
};

export default Custom500;
