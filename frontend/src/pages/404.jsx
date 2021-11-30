import Layout from "@components/layouts";
import ErrorPageLayout from "@components/layouts/pages/Error";

/**
 * Memoized `Custom404` page.
 */
const Custom404 = () => {
	return (
		<Layout>
			<ErrorPageLayout statusCode={404} />
		</Layout>
	);
};

export default Custom404;
