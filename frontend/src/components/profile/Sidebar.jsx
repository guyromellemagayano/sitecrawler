// React
import { useState, useEffect } from "react";

// NextJS
import Link from "next/link";

// External
import { Transition } from "@headlessui/react";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import tw from "twin.macro";
import useSWR from "swr";

// JSON
import SidebarLabel from "public/labels/components/profile/Sidebar.json";
import SidebarPages from "public/data/sidebar-pages.json";

// Hooks
import useDropdownOutsideClick from "src/hooks/useDropdownOutsideClick";
import useFetcher from "src/hooks/useFetcher";

// Components
const ChevronTopSvg = loadable(() =>
  import("src/components/svg/solid/ChevronTopSvg")
);
const ProfileSidebarSkeleton = loadable(() =>
  import("src/components/skeletons/ProfileSidebarSkeleton")
);

const Sidebar = () => {
  const [profileLoaded, setProfileLoaded] = useState(false);
  const {
    ref,
    isComponentVisible,
    setIsComponentVisible,
  } = useDropdownOutsideClick(false);

  const userApiEndpoint = "/api/auth/user/";

  const { data: user, error: userError } = useSWR(userApiEndpoint, useFetcher, {
    refreshInterval: 1000,
  });

  useEffect(() => {
    if (user && user !== undefined) {
      setTimeout(() => {
        setProfileLoaded(true);
      }, 500);
    }

    if (userError) {
      // TODO: add generic alert here
      console.log("ERROR: " + userError);
    }
  }, [user]);

  return (
    <div ref={ref} tw="flex-shrink-0 flex flex-col relative">
      {profileLoaded ? (
        <>
          <button
            type="button"
            className="group"
            tw="p-4 flex items-center justify-between flex-shrink-0 w-full focus:outline-none transition ease-in-out duration-150 bg-gray-900 hover:bg-gray-1100"
            id="options-menu"
            aria-haspopup="true"
            aria-expanded={isComponentVisible ? "true" : "false"}
            onClick={() => setIsComponentVisible(!isComponentVisible)}
          >
            <div tw="flex items-center">
              <div tw="flex flex-col flex-wrap text-left">
                <p tw="text-sm leading-tight mb-1 font-medium text-white">
                  {user.first_name}
                </p>
                <p tw="text-xs leading-4 font-medium text-white transition ease-in-out duration-150">
                  @{user.username}
                </p>
              </div>
            </div>
            <div>
              <ChevronTopSvg className={tw`w-4 h-4 text-white`} />
            </div>
          </button>

          <Transition
            show={isComponentVisible}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <div tw="z-10 mx-3 origin-top absolute right-0 left-0 bottom-0 mt-1 mb-20 rounded-md shadow-lg">
              <div
                tw="rounded-md bg-white"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <div tw="py-1">
                  <span
                    className="group"
                    tw="flex justify-between items-center my-1 px-4 py-2"
                  >
                    <span
                      css={[
                        tw`text-sm leading-5 font-medium`,
                        user.group.name === "Basic"
                          ? tw`text-green-800`
                          : user.group.name === "Pro"
                          ? tw`text-blue-800`
                          : tw`text-red-800`,
                      ]}
                    >
                      {user.group.name} {SidebarLabel[0].label}
                    </span>
                    {(user.group.name === "Basic" ||
                      user.group.name === "Pro") && (
                      <Link href="/settings/subscriptions" passHref>
                        <a
                          css={[
                            tw`text-xs leading-4 font-medium inline-flex items-center px-2 py-1 rounded hover:text-white cursor-pointer transition ease-in-out duration-150`,
                            user.group.name === "Basic"
                              ? tw`bg-green-200 text-green-800 hover:bg-green-600`
                              : tw`bg-blue-200 text-blue-800 hover:bg-blue-600`,
                          ]}
                        >
                          <small>{SidebarLabel[1].label}</small>
                        </a>
                      </Link>
                    )}
                  </span>
                </div>
                <div tw="border-t border-gray-300"></div>
                <div tw="py-1">
                  {SidebarPages.filter((page) => page.slug !== "logout").map(
                    (val, key) => {
                      return (
                        <Link key={key} href={val.url} passHref>
                          <a
                            tw="block px-4 py-2 text-sm leading-5 text-gray-700 cursor-pointer hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                            role="menuitem"
                          >
                            {val.label}
                          </a>
                        </Link>
                      );
                    }
                  )}
                </div>
                <div tw="border-t border-gray-300"></div>
                <div tw="py-1">
                  {SidebarPages.filter((page) => page.slug === "logout").map(
                    (val, key) => {
                      return (
                        <Link key={key} href={val.url}>
                          <a
                            tw="block px-4 py-2 text-sm leading-5 text-gray-700 cursor-pointer hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                            role="menuitem"
                          >
                            {val.label}
                          </a>
                        </Link>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </Transition>
        </>
      ) : (
        <ProfileSidebarSkeleton />
      )}
    </div>
  );
};

Sidebar.propTypes = {};

export default Sidebar;
