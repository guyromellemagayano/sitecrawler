import { MemoizedLayout } from "@components/layouts";
import { MemoizedLoginPageLayout } from "@components/layouts/pages/Login";
import { MemoizedLoader } from "@components/loaders";
import { useNotificationMessage } from "@hooks/useNotificationMessage";
import { useUser } from "@hooks/useUser";
import { useMemo } from "react";
import "twin.macro";

export default function Home() {
	// SWR hooks
	const { user, validatingUser, errorUser } = useUser();

	useMemo(() => {
		let isMounted = true;

		(async () => {
			if (!isMounted) return;

			const userResponseData = user?.data ?? null;
			const userResponseStatus = user?.status ?? null;
			const userResponseMethod = user?.config?.method ?? null;

			if (userResponseData !== null && Math.round(userResponseStatus / 200) === 1) {
				// Show alert message after success response is issued
				setConfig({
					isUser: true,
					method: userResponseMethod,
					status: userResponseStatus
				});
			} else {
				// Show alert message after failed response is issued
				setConfig({
					isUser: true,
					method: userResponseMethod,
					status: userResponseStatus
				});
			}
		})();

		return () => {
			isMounted = false;
		};
	}, [user, errorUser, validatingUser]);

	// Custom hooks
	const { state, setConfig } = useNotificationMessage();

	return (
		<MemoizedLayout>
			{user && user?.status === 403 && user?.data?.detail ? (
				<MemoizedLoginPageLayout />
			) : !state?.responses?.length ? (
				<MemoizedLoader />
			) : (
				state?.responses?.map((value, key) => {
					// Alert Messsages
					const responseTitle = value?.responseTitle ?? null;
					const responseText = value?.responseText ?? null;
					const isSuccess = value?.isSuccess ?? null;

					return <MemoizedLoader key={key} message={responseTitle + ": " + responseText} />;
				})
			)}
		</MemoizedLayout>
	);
}

Home.getLayout = (page) => page;
