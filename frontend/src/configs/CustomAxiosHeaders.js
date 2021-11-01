import Cookies from "js-cookie";

export const customAxiosHeaders = {
	"Accept": "application/json",
	"Content-Type": "application/json",
	"X-CSRFToken": Cookies.get("csrftoken")
};
