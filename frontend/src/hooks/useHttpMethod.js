import { FormSubmissionInterval } from "@enums/GlobalValues";
import AxiosApiInstance from "@helpers/axios";
import { sleep } from "@helpers/sleep";

// Axios DELETE method
export const useDeleteMethod = async (endpoint) => {
	return await AxiosApiInstance.delete(endpoint)
		.then(sleep(FormSubmissionInterval))
		.then((response) => response)
		.catch((error) => error.config);
};

// Axios GET method
export const useGetMethod = async (endpoint) => {
	return await AxiosApiInstance.get(endpoint)
		.then(sleep(FormSubmissionInterval))
		.then((response) => response)
		.catch((error) => error.config);
};

// Axios PATCH method
export const usePatchMethod = async (endpoint, data) => {
	return await AxiosApiInstance.patch(endpoint, data)
		.then(sleep(FormSubmissionInterval))
		.then((response) => response)
		.catch((error) => error.config);
};

// Axios POST method
export const usePostMethod = async (endpoint, data) => {
	return await AxiosApiInstance.post(endpoint, data)
		.then(sleep(FormSubmissionInterval))
		.then((response) => response)
		.catch((error) => error.config);
};

// Axios PUT method
export const usePutMethod = async (endpoint, data) => {
	return await AxiosApiInstance.put(endpoint, data)
		.then(sleep(FormSubmissionInterval))
		.then((response) => response)
		.catch((error) => error.config);
};
