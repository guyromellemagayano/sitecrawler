import { EndpointRefreshInterval } from "@configs/GlobalValues";
import AxiosApiInstance from "@utils/axios";
import { sleep } from "@utils/sleep";

const useFetcher = async (...args) => {
	return await AxiosApiInstance.get(...args)
		.then(sleep(EndpointRefreshInterval))
		.then((response) => response)
		.catch((error) => error.message);
};

export default useFetcher;
