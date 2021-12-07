import { createGlobalStyle } from "styled-components";
import tw from "twin.macro";

export const CustomTransitions = createGlobalStyle`
	.mobile-sidebar-first-child-enter {
    ${tw`transition-opacity ease-linear duration-300`}
  }

  .mobile-sidebar-first-child-enter-from {
    ${tw`opacity-0`}
  }

  .mobile-sidebar-first-child-enter-to {
    ${tw`opacity-100`}
  }

  .mobile-sidebar-first-child-leave {
    ${tw`transition-opacity ease-linear duration-300`}
  }

  .mobile-sidebar-first-child-leave-from {
    ${tw`opacity-100`}
  }

  .mobile-sidebar-first-child-leave-to {
    ${tw`opacity-0`}
  }

	.mobile-sidebar-second-child-enter {
    ${tw`transition ease-in-out duration-300 transform`}
  }

  .mobile-sidebar-second-child-enter-from {
    ${tw`-translate-x-full`}
  }

  .mobile-sidebar-second-child-enter-to {
    ${tw`translate-x-0`}
  }

  .mobile-sidebar-second-child-leave {
    ${tw`transition ease-in-out duration-300 transform`}
  }

  .mobile-sidebar-second-child-leave-from {
    ${tw`translate-x-0`}
  }

  .mobile-sidebar-second-child-leave-to {
    ${tw`-translate-x-full`}
  }

	.mobile-sidebar-third-child-enter {
    ${tw`ease-in-out duration-300`}
  }

  .mobile-sidebar-third-child-enter-from {
    ${tw`opacity-0`}
  }

  .mobile-sidebar-third-child-enter-to {
    ${tw`opacity-100`}
  }

  .mobile-sidebar-third-child-leave {
    ${tw`ease-in-out duration-300`}
  }

  .mobile-sidebar-third-child-leave-from {
    ${tw`opacity-100`}
  }

  .mobile-sidebar-third-child-leave-to {
    ${tw`opacity-0`}
  }

	.profile-menu-dropdown-enter {
    ${tw`transition ease-out duration-100`}
  }

  .profile-menu-dropdown-enter-from {
    ${tw`transform opacity-0 scale-95`}
  }

  .profile-menu-dropdown-enter-to {
    ${tw`transform opacity-100 scale-100`}
  }

  .profile-menu-dropdown-leave {
    ${tw`transition ease-in duration-75`}
  }

  .profile-menu-dropdown-leave-from {
    ${tw`transform opacity-100 scale-100`}
  }

  .profile-menu-dropdown-leave-to {
    ${tw`transform opacity-0 scale-95`}
  }

	.site-select-dropdown-enter {
    ${tw`transition ease-out duration-100`}
  }

  .site-select-dropdown-enter-from {
    ${tw`transform opacity-0 scale-95`}
  }

  .site-select-dropdown-enter-to {
    ${tw`transform opacity-100 scale-100`}
  }

  .site-select-dropdown-leave {
    ${tw`transition ease-in duration-75`}
  }

  .site-select-dropdown-leave-from {
    ${tw`transform opacity-100 scale-100`}
  }

  .site-select-dropdown-leave-to {
    ${tw`transform opacity-0 scale-95`}
  }
`;
