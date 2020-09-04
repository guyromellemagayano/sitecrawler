import styled from 'styled-components'
import Sorting from 'components/site/Sorting'

const SeoSortingDiv = styled.div``

const SeoSorting = props => {
  return (
    <SeoSortingDiv className="flex flex-row ml-3">
      <div className={`inline-flex`}>
        {props.slug == "page-url" ? (
          <Sorting direction={props.sortOrder.pageUrl} onSortHandler={props.onSortHandler} slug={props.slug} />
        ) : props.slug == "created-at" ? (
          <Sorting direction={props.sortOrder.createdAt} onSortHandler={props.onSortHandler} slug={props.slug} />
        ) : props.slug == "total-links" ? (
          <Sorting direction={props.sortOrder.totalLinks} onSortHandler={props.onSortHandler} slug={props.slug} />
        ) : props.slug == "total-ok-links" ? (
          <Sorting direction={props.sortOrder.totalOkLinks} onSortHandler={props.onSortHandler} slug={props.slug} />
        ) : props.slug == "total-non-ok-links" ? (
          <Sorting direction={props.sortOrder.totalNonOkLinks} onSortHandler={props.onSortHandler} slug={props.slug} />
        ) : (
          ""
        )}
      </div>
    </SeoSortingDiv>
  )
}

export default SeoSorting
