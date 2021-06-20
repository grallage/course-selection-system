import React, { useEffect } from "react";
import { Pagination as PaginationR } from "react-bootstrap";

const Pagination = ({
  count = 0,
  page = 1,
  pageSize = 1,
  handlePaginationChange,
  Wrapper,
}) => {
  const [totalPage, setTotalPage] = React.useState(0);
  const [hasPrevious, setHasPrevious] = React.useState(false);
  const [hasNext, setHasNext] = React.useState(false);
  const [pageList, setPageList] = React.useState([]);
  const [showPreviousEllipsis, setShowPreviousEllipsis] = React.useState(false);
  const [showNextEllipsis, setShowNextEllipsis] = React.useState(false);

  useEffect(() => {
    const temTotalPage = Math.ceil(count / pageSize);
    const showCount = 3;

    let temPageList = Array.from(Array(temTotalPage + 1).keys()).filter(
      (item) => Math.abs(item - page) < showCount && item > 0
    );

    setTotalPage(temTotalPage);
    setHasPrevious(1 < page && !(page in temPageList));
    setHasNext(page < temTotalPage);
    setPageList(temPageList);
    setShowPreviousEllipsis(
      !(page in temPageList) && temPageList.length > 0 && temPageList[0] > 2
    );
    setShowNextEllipsis(
      page in temPageList &&
        temPageList.length > 0 &&
        temTotalPage - temPageList[temPageList.length - 1] > 1
    );
  }, [page, count, pageSize]);

  const handleChange = (page) => {
    handlePaginationChange({ page });
  };
  return (
    <>
      {totalPage > 1 && (
        <Wrapper>
          <PaginationR>
            {hasPrevious && (
              <>
                <PaginationR.First
                  onClick={() => {
                    handleChange(1);
                  }}
                />
                <PaginationR.Prev
                  onClick={() => {
                    handleChange(page - 1);
                  }}
                />
              </>
            )}

            <PaginationR.Item
              active={page === 1 ? true : false}
              onClick={() => {
                handleChange(1);
              }}
            >
              {1}
            </PaginationR.Item>

            {showPreviousEllipsis && <PaginationR.Ellipsis />}

            {pageList
              .filter((item) => item > 1 && item < totalPage)
              .map((item) => (
                <PaginationR.Item
                  key={item}
                  active={item === page}
                  onClick={() => {
                    handleChange(item);
                  }}
                >
                  {item}
                </PaginationR.Item>
              ))}
            {showNextEllipsis && <PaginationR.Ellipsis />}
            {totalPage > 1 && (
              <PaginationR.Item
                active={page === totalPage}
                onClick={() => {
                  handleChange(totalPage);
                }}
              >
                {totalPage}
              </PaginationR.Item>
            )}

            {hasNext && (
              <>
                <PaginationR.Next
                  onClick={() => {
                    handleChange(page + 1);
                  }}
                />
                <PaginationR.Last
                  onClick={() => {
                    handleChange(totalPage);
                  }}
                />
              </>
            )}
          </PaginationR>
        </Wrapper>
      )}
    </>
  );
};

export default Pagination;
