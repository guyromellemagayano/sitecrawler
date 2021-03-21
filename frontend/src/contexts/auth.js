// External
import jwt from 'jsonwebtoken';

export const getUserData = (token) => {
	let user = null;

	if (token) {
		try {
		} catch (error) {
			user = null;
		}
	}

	return user;
};

export const redirectUnauth = (token, res) => {
	let user = null;

	if (token) {
		try {
			user = getValidateToken(token).user;
		} catch (error) {
			user = null;
		}
	}

	if (!user) {
		res.setHeader('Location', '/');
		res.statusCode = 307;
		res.end();
	}
};

export const redirectAuth = (token, res) => {
	let user = null;

	if (token) {
		try {
			user = getValidateToken(token).user;
		} catch (error) {
			user = null;
		}
	}

	if (user) {
		res.setHeader('Location', '/');
		res.statusCode = 307;
		res.end();
	}
};

export const getUserDataFromToken = (token) => {
	try {
		let decodedToken = jwt.verify(token, 'SiteCrawlerApp2020');

		console.log('decodedToken', decodedToken);

		if (!decodedToken) {
			typeof localStorage !== 'undefined' && localStorage.removeItem('token');

			return {
				token: null,
				user: null,
				isLoggedIn: false
			};
		} else {
			return {
				token,
				user: {
					...decodedToken,
					isLoggedIn: true
				}
			};
		}
	} catch (error) {
		console.log(error);
		typeof localStorage !== 'undefined' && localStorage.removeItem('token');
		return {
			user: null,
			isLoggedIn: false
		};
	}
};

export const getValidateToken = (token) => {
	try {
		let decodedToken = jwt.verify(token, 'SiteCrawlerApp2020');

		console.log('decoded token', decodedToken);

		if (!decodedToken) {
			typeof localStorage !== 'undefined' && localStorage.removeItem('token');

			return {
				token: null,
				user: null,
				isLoggedIn: false
			};
		} else {
			return {
				token,
				user: {
					...decodedToken,
					isLoggedIn: true
				}
			};
		}
	} catch (error) {
		console.log(error);

		typeof localStorage !== 'undefined' && localStorage.removeItem('token');

		return {
			user: null,
			user: null,
			isLoggedIn: false
		};
	}
};

export const logoutUser = () => {
	typeof localStorage !== 'undefined' && localStorage.removeItem('token');
	window.location.href = '/';
};
