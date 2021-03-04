import { useState, useEffect, useRef } from 'react';

const useShowPassword = (initialState) => {
	const [isPasswordShown, setIsPasswordShown] = useState(initialState);
	const passwordRef = useRef(null);

	const handleShowHidePassword = (props) => {
		if (props.current) {
			props.current.type = isPasswordShown ? 'text' : 'password';
		}
	};

	useEffect(() => {
		document.addEventListener(
			'toggle',
			handleShowHidePassword(passwordRef),
			true
		);

		return () => {
			document.removeEventListener(
				'toggle',
				handleShowHidePassword(passwordRef),
				true
			);
		};
	});

	return { passwordRef, isPasswordShown, setIsPasswordShown };
};

export default useShowPassword;
