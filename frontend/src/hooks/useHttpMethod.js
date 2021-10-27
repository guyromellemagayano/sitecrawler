import { FormSubmissionInterval } from "@enums/GlobalValues";
import AxiosApiInstance from "@utils/axios";
import { sleep } from "@utils/sleep";
import Cookies from "js-cookie";

const customAxiosHeaders = {
	"Accept": "application/json",
	"Content-Type": "application/json",
	"X-CSRFToken": Cookies.get("csrftoken")
};

// Axios DELETE method
export const useDeleteMethod = async (endpoint) => {
	return await AxiosApiInstance.delete(endpoint, { headers: customAxiosHeaders })
		.then(sleep(FormSubmissionInterval))
		.then((response) => {
			console.log(response);

			return response;
		})
		.catch((error) => {
			return error;
		});
};

// Axios GET method
export const useGetMethod = async (endpoint) => {
	return await AxiosApiInstance.get(endpoint, { headers: customAxiosHeaders })
		.then(sleep(FormSubmissionInterval))
		.then((response) => {
			return response;
		})
		.catch((error) => {
			return error;
		});
};

// Axios PATCH method
export const usePatchMethod = async (endpoint, data) => {
	return await AxiosApiInstance.patch(endpoint, data, { headers: customAxiosHeaders })
		.then(sleep(FormSubmissionInterval))
		.then((response) => {
			return response;
		})
		.catch((error) => {
			return error;
		});
};

// Axios POST method
export const usePostMethod = async (endpoint, data) => {
	return await AxiosApiInstance.post(endpoint, data, { headers: customAxiosHeaders })
		.then(sleep(FormSubmissionInterval))
		.then((response) => {
			return response;
		})
		.catch((error) => {
			return error;
		});
};

// Axios PUT method
export const usePutMethod = async (endpoint, data) => {
	return await AxiosApiInstance.put(endpoint, data, { headers: customAxiosHeaders })
		.then(sleep(FormSubmissionInterval))
		.then((response) => {
			return response;
		})
		.catch((error) => {
			return error;
		});
};
