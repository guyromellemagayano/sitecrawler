import styled from 'styled-components'
import SiteDangerBadge from '../badges/SiteDangerBadge'
import SiteSuccessBadge from '../badges/SiteSuccessBadge'
import SiteWarningBadge from '../badges/SiteWarningBadge'

const LinkUrlTableDiv = styled.tbody``

const LinkUrlTable = props => {
  return (
    <LinkUrlTableDiv className={`bg-white`}>
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
          <SiteSuccessBadge text={'Good'} />
        </td>
        <td
          className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
        >
          /fat-cat/
        </td>
        <td
          className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
        >
          100
        </td>
      </tr>
    </LinkUrlTableDiv>
  )
}

export default LinkUrlTable

LinkUrlTable.propTypes = {}