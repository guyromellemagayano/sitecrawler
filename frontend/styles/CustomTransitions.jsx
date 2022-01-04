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

	.delete-user-account-modal-first-child-enter {
    ${tw`ease-out duration-300`}
  }

  .delete-user-account-modal-first-child-enter-from {
    ${tw`opacity-0`}
  }

  .delete-user-account-modal-first-child-enter-to {
    ${tw`opacity-100`}
  }

  .delete-user-account-modal-first-child-leave {
    ${tw`ease-in duration-200`}
  }

  .delete-user-account-modal-first-child-leave-from {
    ${tw`opacity-100`}
  }

  .delete-user-account-modal-first-child-leave-to {
    ${tw`opacity-0`}
	}

	.delete-user-account-modal-second-child-enter {
    ${tw`ease-out duration-300`}
  }

  .delete-user-account-modal-second-child-enter-from {
    ${tw`opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95`}
  }

  .delete-user-account-modal-second-child-enter-to {
    ${tw`opacity-100 translate-y-0 sm:scale-100`}
  }

  .delete-user-account-modal-second-child-leave {
    ${tw`ease-in duration-200`}
  }

  .delete-user-account-modal-second-child-leave-from {
    ${tw`opacity-100 translate-y-0 sm:scale-100`}
  }

  .delete-user-account-modal-second-child-leave-to {
    ${tw`opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95`}
  }

	.alerts-enter {
    ${tw`transition-opacity duration-75`}
  }

  .alerts-enter-from {
    ${tw`opacity-0`}
  }

  .alerts-enter-to {
    ${tw`opacity-100`}
  }

  .alerts-leave {
    ${tw`transition-opacity duration-150`}
  }

  .alerts-leave-from {
    ${tw`opacity-100`}
  }

  .alerts-leave-to {
    ${tw`opacity-0`}
  }

	.site-limit-reached-modal-first-child-enter {
    ${tw`ease-out duration-300`}
  }

  .site-limit-reached-modal-first-child-enter-from {
    ${tw`opacity-0`}
  }

  .site-limit-reached-modal-first-child-enter-to {
    ${tw`opacity-100`}
  }

  .site-limit-reached-modal-first-child-leave {
    ${tw`ease-in duration-200`}
  }

  .site-limit-reached-modal-first-child-leave-from {
    ${tw`opacity-100`}
  }

  .site-limit-reached-modal-first-child-leave-to {
    ${tw`opacity-0`}
  }

	.site-limit-reached-modal-second-child-enter {
    ${tw`ease-out duration-300`}
  }

  .site-limit-reached-modal-second-child-enter-from {
    ${tw`opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95`}
  }

  .site-limit-reached-modal-second-child-enter-to {
    ${tw`opacity-100 translate-y-0 sm:scale-100`}
  }

  .site-limit-reached-modal-second-child-leave {
    ${tw`ease-in duration-200`}
  }

  .site-limit-reached-modal-second-child-leave-from {
    ${tw`opacity-100 translate-y-0 sm:scale-100`}
  }

  .site-limit-reached-modal-second-child-leave-to {
    ${tw`opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95`}
  }

	.show-help-modal-first-child-enter {
    ${tw`ease-out duration-300`}
  }

  .show-help-modal-first-child-enter-from {
    ${tw`opacity-0`}
  }

  .show-help-modal-first-child-enter-to {
    ${tw`opacity-100`}
  }

  .show-help-modal-first-child-leave {
    ${tw`ease-in duration-200`}
  }

  .show-help-modal-first-child-leave-from {
    ${tw`opacity-100`}
  }

  .show-help-modal-first-child-leave-to {
    ${tw`opacity-0`}
  }

	.show-help-modal-second-child-enter {
    ${tw`ease-out duration-300`}
  }

  .show-help-modal-second-child-enter-from {
    ${tw`opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95`}
  }

  .show-help-modal-second-child-enter-to {
    ${tw`opacity-100 translate-y-0 sm:scale-100`}
  }

  .show-help-modal-second-child-leave {
    ${tw`ease-in duration-200`}
  }

  .show-help-modal-second-child-leave-from {
    ${tw`opacity-100 translate-y-0 sm:scale-100`}
  }

  .show-help-modal-second-child-leave-to {
    ${tw`opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95`}
  }

	.change-to-basic-modal-first-child-enter {
    ${tw`ease-out duration-300`}
  }

  .change-to-basic-modal-first-child-enter-from {
    ${tw`opacity-0`}
  }

  .change-to-basic-modal-first-child-enter-to {
    ${tw`opacity-100`}
  }

  .change-to-basic-modal-first-child-leave {
    ${tw`ease-in duration-200`}
  }

  .change-to-basic-modal-first-child-leave-from {
    ${tw`opacity-100`}
  }

  .change-to-basic-modal-first-child-leave-to {
    ${tw`opacity-0`}
  }

	.change-to-basic-modal-second-child-enter {
    ${tw`ease-out duration-300`}
  }

  .change-to-basic-modal-second-child-enter-from {
    ${tw`opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95`}
  }

  .change-to-basic-modal-second-child-enter-to {
    ${tw`opacity-100 translate-y-0 sm:scale-100`}
  }

  .change-to-basic-modal-second-child-leave {
    ${tw`ease-in duration-200`}
  }

  .change-to-basic-modal-second-child-leave-from {
    ${tw`opacity-100 translate-y-0 sm:scale-100`}
  }

  .change-to-basic-modal-second-child-leave-to {
    ${tw`opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95`}
  }

	.new-active-plan-modal-first-child-enter {
    ${tw`ease-out duration-300`}
  }

  .new-active-plan-modal-first-child-enter-from {
    ${tw`opacity-0`}
  }

  .new-active-plan-modal-first-child-enter-to {
    ${tw`opacity-100`}
  }

  .new-active-plan-modal-first-child-leave {
    ${tw`ease-in duration-200`}
  }

  .new-active-plan-modal-first-child-leave-from {
    ${tw`opacity-100`}
  }

  .new-active-plan-modal-first-child-leave-to {
    ${tw`opacity-0`}
  }

	.new-active-plan-modal-second-child-enter {
    ${tw`ease-out duration-300`}
  }

  .new-active-plan-modal-second-child-enter-from {
    ${tw`opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95`}
  }

  .new-active-plan-modal-second-child-enter-to {
    ${tw`opacity-100 translate-y-0 sm:scale-100`}
  }

  .new-active-plan-modal-second-child-leave {
    ${tw`ease-in duration-200`}
  }

  .new-active-plan-modal-second-child-leave-from {
    ${tw`opacity-100 translate-y-0 sm:scale-100`}
  }

  .new-active-plan-modal-second-child-leave-to {
    ${tw`opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95`}
  }

	.payment-method-modal-first-child-enter {
    ${tw`ease-out duration-300`}
  }

  .payment-method-modal-first-child-enter-from {
    ${tw`opacity-0`}
  }

  .payment-method-modal-first-child-enter-to {
    ${tw`opacity-100`}
  }

  .payment-method-modal-first-child-leave {
    ${tw`ease-in duration-200`}
  }

  .payment-method-modal-first-child-leave-from {
    ${tw`opacity-100`}
  }

  .payment-method-modal-first-child-leave-to {
    ${tw`opacity-0`}
  }

	.payment-method-modal-second-child-enter {
    ${tw`ease-out duration-300`}
  }

  .payment-method-modal-second-child-enter-from {
    ${tw`opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95`}
  }

  .payment-method-modal-second-child-enter-to {
    ${tw`opacity-100 translate-y-0 sm:scale-100`}
  }

  .payment-method-modal-second-child-leave {
    ${tw`ease-in duration-200`}
  }

  .payment-method-modal-second-child-leave-from {
    ${tw`opacity-100 translate-y-0 sm:scale-100`}
  }

  .payment-method-modal-second-child-leave-to {
    ${tw`opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95`}
  }
`;
