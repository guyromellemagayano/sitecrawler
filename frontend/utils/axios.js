import { SITE_URL } from "@constants/ServerEnv";
import axios from "axios";
import Cookies from "js-cookie";

// Custom `axios` instance
const AppAxiosInstance = axios.create({
	baseURL: SITE_URL,
	headers: {
		"Accept": "application/json",
		"Content-Type": "application/json",
		"X-CSRFToken": Cookies.get("csrftoken") ?? null
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
	(err) => err
);

export default AppAxiosInstance;
