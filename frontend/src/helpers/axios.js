import { EndpointRefreshInterval } from "@enums/GlobalValues";
import * as Sentry from "@sentry/nextjs";
import axios from "axios";
import Cookies from "js-cookie";

const ApplicationJson = "application/json";

// Global axios defaults
axios.defaults.headers.common["Accept"] = ApplicationJson;
axios.defaults.headers.common["Content-Type"] = ApplicationJson;
axios.defaults.headers.common["X-CSRFToken"] = Cookies.get("csrftoken");

const AxiosApiInstance = axios.create({
	timeout: EndpointRefreshInterval
});

AxiosApiInstance.interceptors.request.use(
	async (config) => config,
	async (error) => {
		Sentry.captureException(error);

		return Promise.reject(error);
	}
);

AxiosApiInstance.interceptors.response.use(
	async (response) => response,
	async (error) => {
		Math.floor(error.response.status / 400) === 1
			? Cookies.remove("csrftoken")
			: (() => {
					Sentry.captureException(error);

					return Promise.reject(error);
			  })();
	}
);

export default AxiosApiInstance;
