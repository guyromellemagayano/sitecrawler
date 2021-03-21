// External
import 'twin.macro';

const Layout = ({ children }) => {
	return (
		<div id='root-auth'>
			<main tw='min-h-screen'>{children}</main>
		</div>
	);
};

export default Layout;
