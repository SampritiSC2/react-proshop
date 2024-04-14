import React from 'react';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Paginate = ({ pages, page, isAdmin = false, pageName }) => {
  return (
    <>
      {pages > 1 && (
        <Pagination>
          {[...Array(pages).keys()].map((x) => (
            <LinkContainer
              key={x + 1}
              to={!isAdmin ? `/page/${x + 1}` : `/admin/${pageName}/page/${x + 1}`}>
              <Pagination.Item active={x + 1 === Number(page)}>{x + 1}</Pagination.Item>
            </LinkContainer>
          ))}
        </Pagination>
      )}
    </>
  );
};

export default Paginate;
