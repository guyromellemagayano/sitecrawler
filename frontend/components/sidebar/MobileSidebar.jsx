import { useState, useEffect } from "react";
import { Transition } from "@tailwindui/react";
import AppLogo from "components/logo/AppLogo";
import Link from "next/link";
import MobilePrimaryMenu from "components/sidebar/MobilePrimaryMenu";
import MobileSettingsMenu from "components/sidebar/MobileSettingsMenu";
import MobileSiteMenu from "components/sidebar/MobileSiteMenu";
import ProfileSidebar from "components/profile/Sidebar";
import PropTypes from "prop-types";
import styled from "styled-components";
import useUser from "hooks/useUser";

const MobileSidebarDiv = styled.aside``;

const MobileSidebar = (props) => {
  const [updateProps, setUpdateProps] = useState(props.show);
  const [windowSiteLocation, setWindowSiteLocation] = useState(false);
  const [windowSettingsLocation, setWindowSettingsLocation] = useState(false);

  const handleUpdateProps = () => {
    setUpdateProps(props.show);
  };

  const { user: user } = useUser({
    redirectTo: "/",
    redirectIfFound: false,
  });

  useEffect(() => {
    if (window.location.href.indexOf("/site/") > -1) {
      setWindowSiteLocation(!windowSiteLocation);
    }

    if (window.location.href.indexOf("/settings/") > -1) {
      setWindowSettingsLocation(!windowSettingsLocation);
    }
  }, []);

  return (
    <>
      {user ? (
        <MobileSidebarDiv className={`md:hidden`}>
          <Transition show={props.show ? !updateProps : updateProps}>
            <Transition.Child
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              className="fixed inset-0 flex z-40"
            >
              <div className={`fixed inset-0`}>
                <div
                  className={`absolute inset-0 bg-gray-600 opacity-75`}
                ></div>
              </div>
              <Transition.Child
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
                className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-1000"
              >
                <div className={`absolute top-0 right-0 mt-4 mr-4 p-1`}>
                  <button
                    className={`btn-close-sidebar flex items-center justify-center h-8 w-8 rounded-full focus:outline-none focus:bg-gray-600`}
                    aria-label={`Close sidebar`}
                    onClick={handleUpdateProps}
                  >
                    <svg
                      className={`h-6 w-5 text-gray-400`}
                      stroke={`currentColor`}
                      fill={`none`}
                      viewBox={`0 0 24 24`}
                    >
                      <path
                        strokeLinecap={`round`}
                        strokeLinejoin={`round`}
                        strokeWidth={`2`}
                        d={`M6 18L18 6M6 6l12 12`}
                      />
                    </svg>
                  </button>
                </div>
                <div className={`flex-1 h-0 pt-5 pb-4 overflow-y-auto`}>
                  <div className={`flex-shrink-0 flex items-center px-4`}>
                    <Link href="/dashboard/sites">
                      <a className={`block w-full`}>
                        <AppLogo
                          className={`h-8 w-auto`}
                          src={`/img/logos/site-logo-white.svg`}
                          alt={`app-logo`}
                        />
                      </a>
                    </Link>
                  </div>
                  {windowSiteLocation ? (
                    <MobileSiteMenu crawlableHandler={props.crawlableHandler} />
                  ) : windowSettingsLocation ? (
                    <MobileSettingsMenu />
                  ) : (
                    <MobilePrimaryMenu />
                  )}
                </div>
                <ProfileSidebar />
              </Transition.Child>
              <div className={`flex-shrink-0 w-14`}>
                {/* Force sidebar to shrink to fit close icon */}
              </div>
            </Transition.Child>
          </Transition>
        </MobileSidebarDiv>
      ) : null}
    </>
  );
};

export default MobileSidebar;

MobileSidebar.propTypes = {
  props: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
    PropTypes.array,
    PropTypes.string,
    PropTypes.shape({ current: PropTypes.any })
  ]),
  handleUpdateProps: PropTypes.func,
  updateProps: PropTypes.bool,
  user: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
    PropTypes.array,
    PropTypes.string,
    PropTypes.shape({ current: PropTypes.any })
  ]),
  windowSettingsLocation: PropTypes.bool,
  windowSiteLocation: PropTypes.bool
};
