// React
import { createContext, useState, useEffect, useContext } from 'react';

// NextJS
import { useRouter } from 'next/router';

const HistoryContext = createContext({});

export const HistoryProvider = ({ children }) => {
	const [history, setHistory] = useState([]);

	const { asPath, push, pathname } = useRouter();

	const back = () => {
		for (let i = history.length - 2; i >= 0; i--) {
			const route = history[i];
			if (!route.includes('#') && route !== pathname) {
				push(route);

				// if you want to pop history on back
				const newHistory = history.slice(0, i);
				setHistory(newHistory);

				break;
			}
		}
	};

	useEffect(() => {
		setHistory((previous) => [...previous, asPath]);
	}, [asPath]);

	return (
		<HistoryContext.Provider
			value={{
				back,
				history,
				setHistory
			}}
		>
			{children}
		</HistoryContext.Provider>
	);
};
