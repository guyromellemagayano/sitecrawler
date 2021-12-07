import { customAxiosHeaders } from "@constants/CustomAxiosHeaders";
import { SITE_URL } from "@constants/ServerEnv";
import * as Sentry from "@sentry/nextjs";
import axios from "axios";
import Cookies from "js-cookie";

const AppAxiosInstance = axios.create({
	baseURL: SITE_URL,
	headers: {
		...customAxiosHeaders,
		"X-CSRFToken": Cookies.get("csrftoken") ?? null
	},
	validateStatus: function (status) {
		return status >= 200 && status < 500;
	}
});

// Use `axios` interceptors for all HTTP methods (GET, POST, PUT, DELETE, etc.)
axios.interceptors.request.use(
	(req) => req,
	(config) => config,
	(err) => Promise.reject(err)
);

axios.interceptors.response.use(
	(res) => res,
	(err) => {
		if (err.response) {
			Sentry.captureException(err.response);

			return err.response;
		} else if (err.request) {
			Sentry.captureException(err.request);

			return err.request;
		} else {
			return Promise.reject(err);
		}
	}
);

export default AppAxiosInstance;
