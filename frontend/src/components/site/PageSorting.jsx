import styled from 'styled-components'
import Sorting from 'components/site/Sorting'

const PageSortingDiv = styled.div``

const PageSorting = props => {
  return (
    <PageSortingDiv className="flex flex-row mr-3">
      <div className={`inline-flex`}>
        {props.slug == "page-url" ? (
          <Sorting direction={props.sortOrder.pageUrl} onSortHandler={props.onSortHandler} slug={props.slug} />
        ) : props.slug == "page-size" ? (
          <Sorting direction={props.sortOrder.pageSize} onSortHandler={props.onSortHandler} slug={props.slug} />
        ) : props.slug == "page-ssl" ? (
          <Sorting direction={props.sortOrder.pageSsl} onSortHandler={props.onSortHandler} slug={props.slug} />
        ) : null}
      </div>
    </PageSortingDiv>
  )
}

export default PageSorting
