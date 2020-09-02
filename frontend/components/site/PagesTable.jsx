import { Fragment } from 'react'
import styled from 'styled-components'
import bytes from 'bytes'
import Skeleton from 'react-loading-skeleton';
import SiteSuccessIcon from '../icons/SiteSuccessIcon'
import SiteWarningIcon from '../icons/SiteWarningIcon'
import SiteDangerIcon from '../icons/SiteDangerIcon'
import SiteNotApplicableIcon from '../icons/SiteNotApplicableIcon'
import SiteDangerBadge from '../badges/SiteDangerBadge'
import SiteSuccessBadge from '../badges/SiteSuccessBadge'
import SiteWarningBadge from '../badges/SiteWarningBadge'

const LinksTableDiv = styled.tbody`
  a,
  div {
    max-width: 100%;
    display: block;
  }
`

const LinksTable = props => {
  if (!props) {
    return (
      <Fragment>
        <LinksTableDiv className={`bg-white`}>
          <tr>
            {[...Array(4)].map((val, index) => <td className={`flex-none px-6 py-4 whitespace-no-wrap border-b border-gray-200`} key={index}><Skeleton duration={2} /></td>)}
          </tr>
        </LinksTableDiv>
      </Fragment>
    )
  }

  return (
    <LinksTableDiv className={`bg-white`}>
      <tr>
        <td
          className={`flex-none px-6 py-4 whitespace-no-wrap border-b border-gray-200`}
        >
          <div className={`flex items-center`}>
            <div>
              <div className={`text-sm leading-5 font-medium text-gray-900`}>
                <a
                  href={props.val.url}
                  target={`_blank`}
                  title={props.val.url}
                  className={`text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}
                >
                  {props.val.url}
                </a>
              </div>
            </div>
          </div>
        </td>
        <td
          className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
        >
          {bytes(props.val.size_total, {thousandsSeparator: ' ', unitSeparator: ' '})}
        </td>
        <td
          className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
        >
          <SiteSuccessBadge text={'Good'} />
        </td>
        <td
          className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
        >
          <SiteSuccessIcon />
        </td>
        <td
          className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
        >
          {props.val.tls_status === 'OK' ? <SiteSuccessIcon /> : <SiteDangerIcon />}
        </td>
      </tr>
    </LinksTableDiv>
  )
}

export default LinksTable

LinksTable.propTypes = {}