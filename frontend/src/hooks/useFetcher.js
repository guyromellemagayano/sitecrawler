import { FormSubmissionInterval } from "@configs/GlobalValues";
import AxiosApiInstance from "@utils/axios";
import { sleep } from "@utils/sleep";

const useFetcher = async (...args) => {
	return await AxiosApiInstance.get(...args)
		.then(sleep(FormSubmissionInterval))
		.then((response) => {
			return response;
		})
		.catch((error) => {
			return error;
		});
};

export default useFetcher;
