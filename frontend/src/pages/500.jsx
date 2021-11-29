import Layout from "@components/layouts";
import dynamic from "next/dynamic";

/**
 * Dynamic imports
 */
const ErrorPageLayout = dynamic(() => import("@components/layouts/pages/Error"), { ssr: true });

/**
 * Memoized `Custom500` page.
 */
const Custom500 = () => {
	return <ErrorPageLayout statusCode={500} />;
};

Custom500.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};

export default Custom500;
