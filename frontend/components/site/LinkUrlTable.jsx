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
            <div>
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
          {props.val.type === 'PAGE' ? 'Page' : props.val.type === 'EXTERNAL' ? 'External' : 'Other' }
        </td>
        <td
          className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
        >
          {props.val.status === 'OK' ? <SiteSuccessBadge text={'OK'} /> : props.val.status === 'TIMEOUT' ? <SiteWarningBadge text={'TIMEOUT'} /> : props.val.status === 'HTTP_ERROR' ? <SiteDangerBadge text={'HTTP ERROR'} /> : <SiteDangerBadge text={'OTHER ERROR'} />}
        </td>
        <td
          className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
        >
          /fat-cat/
        </td>
        <td
          className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
        >
          {props.val.occurences}
        </td>
      </tr>
    </LinkUrlTableDiv>
  )
}

export default LinkUrlTable

LinkUrlTable.propTypes = {}