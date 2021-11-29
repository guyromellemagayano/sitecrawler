import Layout from "@components/layouts";
import dynamic from "next/dynamic";
import { memo } from "react";

/**
 * Dynamic imports
 */
const ErrorPageLayout = dynamic(() => import("@components/layouts/pages/Error"), { ssr: true });

/**
 * Memoized `Custom404` page.
 */
const Custom404 = memo(() => {
	return <ErrorPageLayout statusCode={404} />;
});

Custom404.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};

export default Custom404;
