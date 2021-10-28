import { EndpointRefreshInterval } from "@configs/GlobalValues";
import * as Sentry from "@sentry/nextjs";
import axios from "axios";
import Cookies from "js-cookie";

const customAxiosHeaders = {
	"Accept": "application/json",
	"Content-Type": "application/json",
	"X-CSRFToken": Cookies.get("csrftoken")
};

const AxiosApiInstance = axios.create({
	timeout: EndpointRefreshInterval,
	headers: customAxiosHeaders,
	validateStatus: (status) => {
		return status > 200 && status <= 500;
	}
});

AxiosApiInstance.interceptors.request.use(
	async (config) => {
		return config;
	},
	(error) => {
		Sentry.captureException(error);

		return Promise.reject(error);
	}
);

AxiosApiInstance.interceptors.response.use(
	async (response) => {
		return response;
	},
	async (error) => {
		Sentry.captureException(error);

		return Promise.reject(error);
	}
);

export default AxiosApiInstance;
