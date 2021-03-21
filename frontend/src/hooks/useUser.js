// React
import { useEffect } from "react";

// NextJS
import Router, { useRouter } from "next/router";

// External
import useSWR from "swr";
import PropTypes from "prop-types";

// Hooks
import useFetcher from "src/hooks/useFetcher";

// Contexts
import { redirectAuth, redirectUnauth } from "src/contexts/auth";

const useUser = ({ token = "", userInfo = [] }) => {
	const userApiEndpoint = "/api/auth/user/";

	// const { asPath } = useRouter();

	const { data: user, mutate: mutateUser, error: userError } = useSWR(userApiEndpoint, useFetcher);

	useEffect(() => {
		console.log(user, userError, userInfo);
	}, [user, userError, userInfo]);

	return { user, mutateUser, userError };
};

useUser.propTypes = {};

export default useUser;
