import { EndpointRefreshInterval } from "@configs/GlobalValues";
import * as Sentry from "@sentry/nextjs";
import axios from "axios";

const AxiosApiInstance = axios.create({
	timeout: EndpointRefreshInterval
});

AxiosApiInstance.interceptors.request.use(
	(config) => {
		return config;
	},
	(error) => {
		Sentry.captureException(error);

		return Promise.reject(error);
	}
);

AxiosApiInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		Sentry.captureException(error);

		return Promise.reject(error);
	}
);

export default AxiosApiInstance;
