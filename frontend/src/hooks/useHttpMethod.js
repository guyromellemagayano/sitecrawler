import { FormSubmissionInterval } from "@enums/GlobalValues";
import AxiosApiInstance from "@utils/axios";
import { sleep } from "@utils/sleep";

// Axios DELETE method
export const useDeleteMethod = async (endpoint) => {
	return await AxiosApiInstance.delete(endpoint)
		.then(sleep(FormSubmissionInterval))
		.then((response) => {
			return response;
		})
		.catch((error) => {
			return error;
		});
};

// Axios GET method
export const useGetMethod = async (endpoint) => {
	return await AxiosApiInstance.get(endpoint)
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
	return await AxiosApiInstance.patch(endpoint, data)
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
	return await AxiosApiInstance.post(endpoint, data)
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
	return await AxiosApiInstance.put(endpoint, data)
		.then(sleep(FormSubmissionInterval))
		.then((response) => {
			return response;
		})
		.catch((error) => {
			return error;
		});
};
