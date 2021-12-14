import { customAxiosHeaders } from "@constants/CustomAxiosHeaders";
import { SITE_URL } from "@constants/ServerEnv";
import * as Sentry from "@sentry/nextjs";
import axios from "axios";

const AppAxiosInstance = axios.create({
	baseURL: SITE_URL,
	headers: {
		...customAxiosHeaders
	},
	validateStatus: function (status) {
		return status >= 200 && status < 500;
	},
	withCredentials: true
});

// Use `axios` interceptors for all HTTP methods (GET, POST, PUT, DELETE, etc.)
axios.interceptors.request.use(
	(req) => req,
	(err) => Promise.reject(err)
);

axios.interceptors.response.use(
	(res) => res,
	(err) => {
		if (err.response) {
			// Capture `response` errors and send to Sentry
			Sentry.captureException(err.response);

			return err.response;
		} else if (err.request) {
			// Capture `request` errors and send to Sentry
			Sentry.captureException(err.request);

			return err.request;
		} else {
			// Capture other errors and send to Sentry
			Sentry.captureException(err);

			return Promise.reject(err);
		}
	}
);

export default AppAxiosInstance;
