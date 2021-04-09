// NextJS
import Link from "next/link";
import { useRouter } from "next/router";

// External
import { NextSeo } from "next-seo";
import PropTypes from "prop-types";
import "twin.macro";

// JSON
import Custom404Label from "public/labels/pages/custom-404.json";

// Components
import Layout from "src/components/Layout";

const Custom404 = () => {
  const pageTitle = Custom404Label[0].label;

  return (
    <Layout>
      <NextSeo title={pageTitle} />

      <div tw="absolute inset-0 flex flex-col items-center justify-center w-full min-h-screen bg-gray-50">
        <div tw="flex flex-col items-start justify-center max-w-4xl space-y-4">
          <h1>{Custom404Label[0].label}</h1>
          <Link href="/" passHref>
            <a>{Custom404Label[1].label}</a>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Custom404;
