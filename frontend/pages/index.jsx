import { MemoizedLayout } from "@components/layouts";
import { MemoizedLoginPageLayout } from "@components/layouts/pages/Login";
import { MemoizedLoader } from "@components/loaders";
import { useUser } from "@hooks/useUser";
import "twin.macro";

export default function Home() {
	// SWR hooks
	const { user, validatingUser, errorUser } = useUser();

	const userResponseData = user?.data ?? null;
	const userResponseStatus = user?.status ?? null;

	return userResponseStatus !== null && userResponseStatus === 403 && userResponseData?.detail?.length > 0 ? (
		<MemoizedLoginPageLayout />
	) : (
		<MemoizedLoader />
	);
}

Home.getLayout = function getLayout(page) {
	return <MemoizedLayout>{page}</MemoizedLayout>;
};
