import styled from 'styled-components'
import Sorting from 'components/site/Sorting'

const StylesheetSortingDiv = styled.div``

const StylesheetSorting = (props) => {
  return (
    <StylesheetSortingDiv className="flex flex-row mr-3">
      <button
        className={`inline-flex`}
        onClick={(e) => props.onSortHandler(props.slug)}
      >
        {props.slug == "stylesheet-url" ? (
          <Sorting direction={props.sortOrder.stylesheetUrl} />
        ) : props.slug == "url-type" ? (
          <Sorting direction={props.sortOrder.urlType} />
        ) : props.slug == "status" ? (
          <Sorting direction={props.sortOrder.status} />
        ) : props.slug == "http-code" ? (
          <Sorting direction={props.sortOrder.httpCode} />
        ) : props.slug == "occurences" ? (
          <Sorting direction={props.sortOrder.occurences} />
        ) : (
          null
        )}
      </button>
    </StylesheetSortingDiv>
  )
}

export default StylesheetSorting
