import styled from 'styled-components'
import Sorting from 'components/site/Sorting'

const SeoSortingDiv = styled.div``

const SeoSorting = props => {
  return (
    <SeoSortingDiv className="flex flex-row mr-3">
      <button
        className={`inline-flex`}
        onClick={(e) => props.onSortHandler(props.slug)}
      >
        {props.slug == "page-url" ? (
          <Sorting direction={props.sortOrder.pageUrl} />
        ) : props.slug == "created-at" ? (
          <Sorting direction={props.sortOrder.createdAt} />
        ) : props.slug == "total-links" ? (
          <Sorting direction={props.sortOrder.totalLinks} />
        ) : props.slug == "total-ok-links" ? (
          <Sorting direction={props.sortOrder.totalOkLinks} />
        ) : props.slug == "total-non-ok-links" ? (
          <Sorting direction={props.sortOrder.totalNonOkLinks} />
        ) : (
          ""
        )}
      </button>
    </SeoSortingDiv>
  )
}

export default SeoSorting
