import Router from "next/router";
import useSWR from "swr";

const addSite = ({ api, parameters }) => {
  const fetcher = (api) => fetch(api, parameters).then(res => res.json())

  const { data: site, error } = useSWR('/api/site/', fetcher);

  // if (!site) {
  //   return <div>Loading...</div>
  // } else {
  //   Router.push({
  //     pathname: '/sites/verify-url',
  //     query: { 
  //       sid: site.id,
  //       surl: site.url,
  //       vid: site.verification_id,
  //       v: false,
  //     },
  //   })
  // }

  return { site };
};

export default addSite;
