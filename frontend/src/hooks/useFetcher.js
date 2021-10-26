import { ComponentReadyInterval } from "@enums/GlobalValues";
import AxiosApiInstance from "@helpers/axios";
import { sleep } from "@utils/sleep";

const useFetcher = async (...args) => {
	return await AxiosApiInstance.get(...args)
		.then(sleep(ComponentReadyInterval))
		.then((response) => response)
		.catch((error) => error.message);
};

export default useFetcher;
