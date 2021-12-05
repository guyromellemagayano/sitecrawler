import { customAxiosHeaders } from "@constants/CustomAxiosHeaders";
import { FormSubmissionInterval } from "@constants/GlobalValues";
import { SITE_URL } from "@constants/ServerEnv";
import * as Sentry from "@sentry/nextjs";
import axios from "axios";

const AppAxiosInstance = axios.create({
	baseURL: SITE_URL,
	timeout: FormSubmissionInterval,
	headers: customAxiosHeaders,
	validateStatus: function (status) {
		return status >= 200 && status < 500;
	}
});

// Use `axios` interceptors for all HTTP methods (GET, POST, PUT, DELETE, etc.)
axios.interceptors.request.use((req) => {
	req.headers = {
		...req.headers,
		...customAxiosHeaders
	};

	return req.data;
});

axios.interceptors.response.use(
	(res) => res,
	(err) => {
		if (err.response) {
			// The request was made and the server responsded with a status code
			// that falls out of the the range of 2xx
			Sentry.captureException(err.response);

			return err.response;
		} else if (err.request) {
			// The request was made but no response was received
			// `err.request` is an instance of XMLHttpRequest in the browser and an instance of
			// http.ClientRequest in node.js
			Sentry.captureException(err.request);

			return err.request;
		} else {
			// Something happened in setting up the request that triggered an Error
			return new Promise((resolve) => {
				resolve(axios(err.config));
			});
		}
	}
);

export default AppAxiosInstance;
