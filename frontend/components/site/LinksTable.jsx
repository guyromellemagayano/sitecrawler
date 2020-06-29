import styled from 'styled-components'
import SiteSuccessIcon from '../icons/SiteSuccessIcon'
import SiteWarningIcon from '../icons/SiteWarningIcon'
import SiteDangerIcon from '../icons/SiteDangerIcon'
import SiteNotApplicableIcon from '../icons/SiteNotApplicableIcon'

const LinksTableDiv = styled.tbody``

const LinksTable = props => {
  return (
    <LinksTableDiv className={`bg-white`}>
      <tr>
        <td
          className={`flex-none px-6 py-4 whitespace-no-wrap border-b border-gray-200`}
        >
          <div className={`flex items-center`}>
            <div className={`flex-shrink-0 h-10 w-10`}>
              <img
                className={`h-10 w-10 rounded-full`}
                src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
                alt={``}
              />
            </div>
            <div className={`ml-4`}>
              <div className={`text-sm leading-5 font-medium text-gray-900`}>
                {props.val.url}
              </div>
              <div className={`text-sm leading-5 text-gray-500`}>
                <a
                  href={`${props.val.url}`}
                  target={`_blank`}
                  title={`${props.val.url}`}
                  className={`text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}
                >
                  Visit Link
                </a>
              </div>
            </div>
          </div>
        </td>
        <td
          className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
        >
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800`}
          >
            Good
          </span>
          {/* <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800`}
          >
            404
          </span>
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800`}
          >
            301 Redirect
          </span> */}
        </td>
        <td
          className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
        >
          <SiteSuccessIcon />
        </td>
        <td
          className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
        >
          <SiteSuccessIcon />
          {/* <SiteDangerIcon /> */}
          {/* <SiteNotApplicableIcon /> */}
        </td>
        <td
          className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
        >
          10 MB
        </td>
      </tr>
    </LinksTableDiv>
  )
}

export default LinksTable

LinksTable.propTypes = {}