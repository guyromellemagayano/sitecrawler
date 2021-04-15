// React
import { useState, useEffect } from "react";

// External
import loadable from "@loadable/component";
import PropTypes from "prop-types";

// Hooks
import useUser from "src/hooks/useUser";

// Layout
import Layout from "src/components/Layout";

// Components
const Dashboard = loadable(() => import("src/components/layout/Dashboard"));
const Loader = loadable(() => import("src/components/layout/Loader"));

const Home = () => {
  const [userData, setUserData] = useState([]);
  const [pageLoaded, setPageLoaded] = useState(false);

  const { user: user } = useUser({
    redirectIfFound: false,
    redirectTo: "/login",
  });

  useEffect(() => {
    if (user && user !== undefined && Object.keys(user).length > 0) {
      setUserData(user);

      setTimeout(() => {
        setPageLoaded(true);
      }, 3000);
    }
  }, [user]);

  return pageLoaded ? (
    <Layout user={userData}>
      <Dashboard user={userData} />
    </Layout>
  ) : null;
};

Home.propTypes = {};

export default Home;
