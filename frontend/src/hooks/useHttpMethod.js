import { ComponentReadyInterval } from "@enums/GlobalValues";
import AxiosApiInstance from "@helpers/axios";
import { sleep } from "@utils/sleep";

// Axios DELETE method
export const useDeleteMethod = async (endpoint) => {
	return await AxiosApiInstance.delete(endpoint)
		.then(await sleep(ComponentReadyInterval))
		.then((response) => response);
};

// Axios GET method
export const useGetMethod = async (endpoint) => {
	return await AxiosApiInstance.get(endpoint)
		.then(await sleep(ComponentReadyInterval))
		.then((response) => response);
};

// Axios PATCH method
export const usePatchMethod = async (endpoint, data) => {
	return await AxiosApiInstance.patch(endpoint, data)
		.then(await sleep(ComponentReadyInterval))
		.then((response) => response);
};

// Axios POST method
export const usePostMethod = async (endpoint, data) => {
	return await AxiosApiInstance.post(endpoint, data)
		.then(await sleep(ComponentReadyInterval))
		.then((response) => response);
};

// Axios PUT method
export const usePutMethod = async (endpoint, data) => {
	return await AxiosApiInstance.put(endpoint, data)
		.then(await sleep(ComponentReadyInterval))
		.then((response) => response);
};
