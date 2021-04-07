// React
import { useEffect, useState } from "react";

// NextJS
import Link from "next/link";
import Router, { useRouter } from "next/router";

// External
import { Formik } from "formik";
import { NextSeo } from "next-seo";
import { withResizeDetector } from "react-resize-detector";
import * as Yup from "yup";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import tw from "twin.macro";

// JSON
import InformationLabel from "public/labels/pages/add-site/information.json";

// Utils
import { getCookie } from "src/utils/cookie";

// Hooks
import useGetMethod from "src/hooks/useGetMethod";
import usePostMethod from "src/hooks/usePostMethod";
import usePatchMethod from "src/hooks/usePatchMethod";
import useUser from "src/hooks/useUser";
import { useSite, useSiteId } from "src/hooks/useSite";

// Layout
import Layout from "src/components/Layout";

// Components
const AppLogo = loadable(() => import("src/components/logo/AppLogo"));
const ChevronRightSvg = loadable(() =>
  import("src/components/svg/solid/ChevronRightSvg")
);
const ErrorNotification = loadable(() =>
  import("src/components/notifications/ErrorNotification")
);
const HomeSvg = loadable(() => import("src/components/svg/solid/HomeSvg"));
const HowToSetup = loadable(() => import("src/components/sites/HowToSetup"));
const HowToSetupSkeleton = loadable(() =>
  import("src/components/skeletons/HowToSetupSkeleton")
);
const MainSidebar = loadable(() =>
  import("src/components/sidebar/MainSidebar")
);
const MobileSidebarButton = loadable(() =>
  import("src/components/sidebar/MobileSidebarButton")
);
const SiteAdditionStepsSkeleton = loadable(() =>
  import("src/components/skeletons/SiteAdditionStepsSkeleton")
);
const SiteFooter = loadable(() => import("src/components/footer/SiteFooter"));

const Information = ({ width, token, sid, edit }) => {
  const [errorMsg, setErrorMsg] = useState("");
  const [errorMsgLoaded, setErrorMsgLoaded] = useState(false);
  const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [siteData, setSiteData] = useState([]);
  const [siteName, setSiteName] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [userData, setUserData] = useState([]);

  const router = useRouter();

  const pageTitle = "Information";
  const homeLabel = "Home";
  const homePageLink = "/";
  const verifyUrlLink = "/add-site/verify-url";
  const siteApiEndpoint = "/api/site/?ordering=name";
  const urlRegex = /^(www.)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;

  const { user: user, error: userError } = useUser({ refreshInterval: 1000 });
  const { site: site, siteError: siteError } = useSite({
    endpoint: siteApiEndpoint,
  });
  const { siteId: siteId, siteIdError: siteIdError } = useSiteId({
    querySid: router.query.sid,
  });

  useEffect(() => {
    if (siteId && siteId !== undefined && Object.keys(siteId).length > 0) {
      setSiteName(siteId.name);
      setSiteUrl(siteId.url);
    }
  }, [siteId]);

  useEffect(() => {
    if (userError || siteError || siteIdError) {
      // TODO: add generic alert here
      console.log(
        "ERROR: " + userError ? userError : siteError ? siteError : siteIdError
      );
    }

    if (
      token &&
      token !== undefined &&
      token !== "" &&
      user &&
      user !== undefined &&
      Object.keys(user).length > 0 &&
      site &&
      site !== undefined &&
      Object.keys(site).length > 0
    ) {
      setUserData(user);
      setSiteData(site);
      setPageLoaded(true);
    }
  }, [user, site, siteId, token]);

  useEffect(() => {
    if (errorMsg && errorMsg !== "") {
      setTimeout(() => {
        setErrorMsgLoaded(true);
      }, 500);
    }
  }, [errorMsg]);

  useEffect(() => {
    if (errorMsgLoaded) {
      setTimeout(() => {
        setErrorMsgLoaded(false);
      }, 3500);
    }
  }, [errorMsgLoaded]);

  return (
    <Layout user={userData}>
      <NextSeo title={pageTitle} />

      <ErrorNotification
        errorMsg={errorMsg}
        errorMsgLoaded={errorMsgLoaded}
        setErrorMsgLoaded={setErrorMsgLoaded}
        errorMsgTitle={InformationLabel[16].label}
      />

      <section tw="h-screen flex overflow-hidden bg-white">
        <MainSidebar
          width={width}
          user={userData}
          site={siteData}
          openMobileSidebar={openMobileSidebar}
          setOpenMobileSidebar={setOpenMobileSidebar}
        />

        <div tw="flex flex-col w-0 flex-1 overflow-hidden">
          <div tw="relative z-10 flex-shrink-0 flex h-16 lg:h-0 bg-white border-b lg:border-0 border-gray-200 lg:mb-4">
            <MobileSidebarButton
              openMobileSidebar={openMobileSidebar}
              setOpenMobileSidebar={setOpenMobileSidebar}
            />
            <Link href={homePageLink} passHref>
              <a tw="p-1 block w-full cursor-pointer lg:hidden">
                <AppLogo
                  className={tw`mt-4 mx-auto h-8 w-auto`}
                  src="/images/logos/site-logo-dark.svg"
                  alt="app-logo"
                />
              </a>
            </Link>
          </div>

          <main
            tw="flex-1 relative z-0 overflow-y-auto focus:outline-none"
            tabIndex="0"
          >
            <div tw="w-full p-6 mx-auto grid gap-16 xl:grid-cols-1 2xl:grid-cols-3 lg:col-gap-5 lg:row-gap-12">
              <div tw="lg:col-span-2 xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200">
                {pageLoaded ? (
                  <>
                    <div tw="max-w-full py-4 px-8">
                      <nav tw="flex pt-4 pb-8" aria-label="Breadcrumb">
                        <ol tw="flex items-center space-x-4">
                          <li>
                            <div>
                              <Link href={homePageLink} passHref>
                                <a tw="text-gray-400 hover:text-gray-500">
                                  <HomeSvg
                                    className={tw`flex-shrink-0 h-5 w-5`}
                                  />
                                  <span tw="sr-only">{homeLabel}</span>
                                </a>
                              </Link>
                            </div>
                          </li>
                          <li>
                            <div tw="flex items-center">
                              <ChevronRightSvg
                                className={tw`flex-shrink-0 h-5 w-5 text-gray-400`}
                              />
                              <p
                                aria-current="page"
                                tw="cursor-default ml-4 text-sm font-medium text-gray-700"
                              >
                                {pageTitle}
                              </p>
                            </div>
                          </li>
                        </ol>
                      </nav>
                      <div tw="pt-4 m-auto">
                        <h4 tw="text-2xl leading-6 font-medium text-gray-900">
                          {InformationLabel[0].label}
                        </h4>
                        <p tw="max-w-full mt-2 text-sm leading-5 text-gray-500">
                          {InformationLabel[0].description}
                        </p>
                      </div>
                    </div>
                    <nav
                      aria-label="Site Addition Progress"
                      tw="max-w-full p-8 pb-2"
                    >
                      <ol tw="space-y-4 md:flex md:space-y-0 md:space-x-8">
                        <li tw="md:flex-1">
                          <span
                            tw="pl-4 py-2 flex flex-col border-l-4 border-indigo-600 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4"
                            aria-current="step"
                          >
                            <span tw="text-xs text-indigo-600 font-semibold tracking-wide uppercase">
                              {InformationLabel[13].label}
                            </span>
                            <span tw="text-sm font-medium">
                              {InformationLabel[1].label}
                            </span>
                          </span>
                        </li>

                        <li tw="md:flex-1">
                          <span
                            className="group"
                            tw="pl-4 py-2 flex flex-col border-l-4 border-gray-200 hover:border-gray-300 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4"
                          >
                            <span tw="text-xs text-gray-500 font-semibold tracking-wide uppercase group-hover:text-gray-700">
                              {InformationLabel[14].label}
                            </span>
                            <span tw="text-sm font-medium">
                              {InformationLabel[2].label}
                            </span>
                          </span>
                        </li>
                      </ol>
                    </nav>

                    <div tw="block pt-8 pb-12 px-8">
                      <div tw="max-w-full py-4 m-auto">
                        <div tw="block mb-12">
                          <h4 tw="text-lg leading-7 font-medium text-gray-900">
                            {InformationLabel[3].label}
                          </h4>
                          <span tw="max-w-full mt-1 block">
                            <p tw="text-sm leading-5 text-gray-500">
                              {InformationLabel[3].description}
                            </p>
                          </span>
                        </div>

                        <Formik
                          enableReinitialize={
                            sid && sid !== undefined && edit ? true : false
                          }
                          initialValues={{
                            siteurlprotocol: "https://",
                            siteurl:
                              sid && sid !== undefined && edit
                                ? siteUrl.replace(/^\/\/|^.*?:(\/\/)?/, "")
                                : "",
                            sitename:
                              sid && sid !== undefined && edit ? siteName : "",
                          }}
                          validationSchema={Yup.object({
                            siteurl: Yup.string()
                              .matches(urlRegex, InformationLabel[8].label)
                              .required(InformationLabel[7].label),
                            sitename: Yup.string().required(
                              InformationLabel[7].label
                            ),
                          })}
                          onSubmit={async (
                            values,
                            { setSubmitting, resetForm }
                          ) => {
                            if (sid && sid !== undefined && edit) {
                              try {
                                const response = await useGetMethod(
                                  "/api/site/" + router.query.sid + "/"
                                );

                                if (Math.floor(response.status / 200) === 1) {
                                  const body = {
                                    name: values.sitename,
                                  };

                                  const siteResponse = await usePatchMethod(
                                    "/api/site/" + router.query.sid + "/",
                                    body
                                  );

                                  if (
                                    Math.floor(siteResponse.status / 200) === 1
                                  ) {
                                    setSubmitting(false);

                                    Router.push({
                                      pathname: verifyUrlLink,
                                      query: {
                                        sid: siteResponse.data.id,
                                        sname: siteResponse.data.name,
                                        surl: siteResponse.data.url,
                                        vid: siteResponse.data.verification_id,
                                        v: false,
                                      },
                                    });
                                  } else {
                                    // FIXME: Error handling for siteResponse
                                    if (siteResponse.data) {
                                      console.log(
                                        "ERROR: " + siteResponse.data
                                      );
                                    } else {
                                      setSubmitting(false);
                                      resetForm({ values: "" });
                                      setErrorMsg(InformationLabel[12]);
                                      setErrorMsgLoaded(!errorMsgLoaded);
                                    }
                                  }
                                } else {
                                  // FIXME: Error handling for response
                                  if (response.data) {
                                    console.log("ERROR: " + response.data);
                                  } else {
                                    setSubmitting(false);
                                    resetForm({ values: "" });
                                    setErrorMsg(InformationLabel[12]);
                                    setErrorMsgLoaded(!errorMsgLoaded);
                                  }
                                }
                              } catch (error) {
                                throw error.message;
                              }
                            } else {
                              const body = {
                                url: values.siteurlprotocol + values.siteurl,
                                name: values.sitename,
                              };

                              try {
                                const response = await useGetMethod(
                                  siteApiEndpoint
                                );

                                if (Math.floor(response.status / 200) === 1) {
                                  const siteResult = response.data.results.find(
                                    (site) => site.url === body.url
                                  );

                                  if (siteResult !== undefined) {
                                    setErrorMsg(InformationLabel[11].label);
                                    setErrorMsgLoaded(!errorMsgLoaded);
                                  } else {
                                    const siteResponse = await usePostMethod(
                                      siteApiEndpoint,
                                      body
                                    );

                                    if (
                                      Math.floor(siteResponse.status / 200) ===
                                      1
                                    ) {
                                      setSubmitting(false);
                                      resetForm({ values: "" });

                                      Router.push({
                                        pathname: verifyUrlLink,
                                        query: {
                                          sid: siteResponse.data.id,
                                          sname: siteResponse.data.name,
                                          surl: siteResponse.data.url,
                                          vid:
                                            siteResponse.data.verification_id,
                                          v: false,
                                          edit: false,
                                        },
                                      });
                                    } else {
                                      // FIXME: Error handling for siteResponse
                                      if (siteResponse.data) {
                                        console.log(
                                          "ERROR: " + siteResponse.data
                                        );
                                      } else {
                                        setSubmitting(false);
                                        resetForm({ values: "" });
                                        setErrorMsg(InformationLabel[12]);
                                        setErrorMsgLoaded(!errorMsgLoaded);
                                      }
                                    }
                                  }
                                } else {
                                  // FIXME: Error handling for response
                                  if (response.data) {
                                    console.log("ERROR: " + response.data);
                                  } else {
                                    setSubmitting(false);
                                    resetForm({ values: "" });
                                    setErrorMsg(InformationLabel[12]);
                                    setErrorMsgLoaded(!errorMsgLoaded);
                                  }
                                }
                              } catch (error) {
                                throw error.message;
                              }
                            }
                          }}
                        >
                          {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting,
                          }) => (
                            <form
                              tw="space-y-8 divide-y divide-gray-200"
                              onSubmit={handleSubmit}
                            >
                              <div tw="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                <div tw="sm:col-span-3">
                                  <label
                                    htmlFor="sitename"
                                    tw="block text-sm font-medium leading-5 text-gray-700"
                                  >
                                    {InformationLabel[4].label}
                                  </label>
                                  <div tw="my-1">
                                    <input
                                      id="sitename"
                                      type="text"
                                      name="sitename"
                                      disabled={isSubmitting}
                                      placeholder={
                                        InformationLabel[4].placeholder
                                      }
                                      css={[
                                        tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md`,
                                        isSubmitting &&
                                          tw`opacity-50 bg-gray-200 cursor-not-allowed`,
                                        (errors.sitename && touched.sitename) ||
                                        errorMsg
                                          ? tw`border-red-300`
                                          : tw`border-gray-300`,
                                      ]}
                                      aria-describedby="sitename"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values.sitename}
                                    />

                                    {errors.sitename && touched.sitename && (
                                      <span tw="block mt-2 text-xs leading-5 text-red-700">
                                        {errors.sitename &&
                                          touched.sitename &&
                                          errors.sitename}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div tw="sm:col-span-3">
                                  <label
                                    htmlFor="siteurl"
                                    tw="block text-sm font-medium leading-5 text-gray-700"
                                  >
                                    {InformationLabel[5].label}
                                  </label>
                                  <div tw="mt-1 relative rounded-md shadow-sm">
                                    <div tw="absolute inset-y-0 left-0 flex items-center">
                                      <label
                                        htmlFor="siteurlprotocol"
                                        tw="sr-only"
                                      >
                                        Site URL Protocol
                                      </label>
                                      <select
                                        id="siteurlprotocol"
                                        name="siteurlprotocol"
                                        css={[
                                          tw`focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-3 pr-7 border-transparent bg-transparent sm:text-sm rounded-md`,
                                          sid !== undefined &&
                                            edit &&
                                            tw`opacity-50 bg-gray-200 cursor-not-allowed`,
                                        ]}
                                        disabled={
                                          isSubmitting ||
                                          (sid !== undefined && edit)
                                            ? true
                                            : false
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.siteurlprotocol}
                                      >
                                        <option value="https://">
                                          https://
                                        </option>
                                        <option value="http://">http://</option>
                                      </select>
                                    </div>
                                    <input
                                      id="siteurl"
                                      type="text"
                                      name="siteurl"
                                      disabled={
                                        isSubmitting ||
                                        (sid !== undefined && edit)
                                          ? true
                                          : false
                                      }
                                      css={[
                                        tw`focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-24 sm:text-sm border-gray-300 rounded-md`,
                                        sid !== undefined && edit
                                          ? tw`opacity-50 bg-gray-200 cursor-not-allowed`
                                          : isSubmitting &&
                                            tw`text-gray-500 opacity-50 bg-gray-200 cursor-not-allowed`,
                                        (errors.siteurl && touched.siteurl) ||
                                        errorMsg
                                          ? tw`border-red-300`
                                          : tw`border-gray-300`,
                                      ]}
                                      placeholder={
                                        InformationLabel[5].placeholder
                                      }
                                      aria-describedby="siteurl"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={
                                        sid !== undefined && edit
                                          ? siteUrl.replace(
                                              /^\/\/|^.*?:(\/\/)?/,
                                              ""
                                            )
                                          : values.siteurl
                                      }
                                    />
                                  </div>

                                  {errors.siteurl && touched.siteurl && (
                                    <span tw="block mt-2 text-xs leading-5 text-red-700">
                                      {errors.siteurl &&
                                        touched.siteurl &&
                                        errors.siteurl}
                                    </span>
                                  )}
                                </div>

                                <div tw="sm:col-span-6">
                                  <div tw="flex justify-start">
                                    <button
                                      type="submit"
                                      disabled={
                                        isSubmitting ||
                                        Object.keys(errors).length > 0 ||
                                        (!Object.keys(values.siteurl).length >
                                          0 &&
                                          !urlRegex.test(values.siteurl) &&
                                          !Object.keys(values.sitename).length >
                                            0)
                                      }
                                      css={[
                                        tw`mt-3 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600`,
                                        isSubmitting ||
                                        Object.keys(errors).length > 0 ||
                                        (!Object.keys(values.siteurl).length >
                                          0 &&
                                          !urlRegex.test(values.siteurl) &&
                                          !Object.keys(values.sitename).length >
                                            0)
                                          ? tw`opacity-50 bg-indigo-300 cursor-not-allowed`
                                          : tw`hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`,
                                      ]}
                                    >
                                      {isSubmitting
                                        ? InformationLabel[10].label
                                        : sid === undefined && !edit
                                        ? InformationLabel[6].label
                                        : InformationLabel[9].label}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </form>
                          )}
                        </Formik>
                      </div>
                    </div>
                  </>
                ) : (
                  <SiteAdditionStepsSkeleton />
                )}
              </div>
              <div tw="lg:col-span-1">
                {pageLoaded ? <HowToSetup /> : <HowToSetupSkeleton />}
              </div>
            </div>
            <div tw="static bottom-0 w-full mx-auto px-12 py-4 bg-white border-t border-gray-200">
              <SiteFooter />
            </div>
          </main>
        </div>
      </section>
    </Layout>
  );
};

Information.propTypes = {};

export default withResizeDetector(Information);

export async function getServerSideProps({ req, query }) {
  let token = getCookie("token", req);

  if (!token) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      token: token || "",
      sid: query.sid || "",
      edit: query.edit || false,
    },
  };
}
