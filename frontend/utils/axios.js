import { customAxiosHeaders } from "@constants/CustomAxiosHeaders";
import { SITE_URL } from "@constants/ServerEnv";
import axios from "axios";

// Custom `axios` instance
const AppAxiosInstance = axios.create({
	baseURL: SITE_URL,
	headers: {
		...customAxiosHeaders
	},
	validateStatus: function (status) {
		return status >= 200 && status < 600;
	},
	withCredentials: true
});

// Use `axios` interceptors for all HTTP methods (GET, POST, PUT, DELETE, etc.)
AppAxiosInstance.interceptors.request.use(
	(req) => req,
	(err) => Promise.reject(err)
);

AppAxiosInstance.interceptors.response.use(
	(res) => res,
	(err) => Promise.reject(err)
);

export default AppAxiosInstance;
