import styled from 'styled-components'
import Sorting from 'components/site/Sorting'

const LinkSortingDiv = styled.div``

const LinkSorting = (props) => {
  return (
    <LinkSortingDiv className="flex flex-row mr-3">
      <button
        className={`inline-flex`}
        onClick={(e) => props.onSortHandler(props.slug)}
      >
        {props.slug == "link-url" ? (
          <Sorting direction={props.sortOrder.linkUrl} />
        ) : props.slug == "url-type" ? (
          <Sorting direction={props.sortOrder.urlType} />
        ) : props.slug == "status" ? (
          <Sorting direction={props.sortOrder.status} />
        ) : props.slug == "http-code" ? (
          <Sorting direction={props.sortOrder.httpCode} />
        ) : props.slug == "occurrences" ? (
          <Sorting direction={props.sortOrder.occurrences} />
        ) : (
          ""
        )}
      </button>
    </LinkSortingDiv>
  )
}

export default LinkSorting
