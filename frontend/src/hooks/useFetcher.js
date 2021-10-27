import { EndpointRefreshInterval } from "@configs/GlobalValues";
import { sleep } from "@helpers/sleep";
import AxiosApiInstance from "@utils/axios";

const useFetcher = async (...args) => {
	return await AxiosApiInstance.get(...args)
		.then(sleep(EndpointRefreshInterval))
		.then((response) => response)
		.catch((error) => error.message);
};

export default useFetcher;
