import { useState, useEffect, useMemo } from "react";
import ReactPaginate from "react-paginate";

const Pagination = ({ pageCount, handlePageChange, currentPage }) => {
  return (
    <div className="py-4">
      <ReactPaginate
        pageCount={pageCount}
        onPageChange={handlePageChange}
        forcePage={currentPage}
        pageRangeDisplayed={5}
        marginPagesDisplayed={1}
        containerClassName="flex justify-center space-x-2"
        pageClassName="px-3 py-2 rounded-md text-blue-600 hover:bg-blue-200"
        previousClassName="px-3 py-2 rounded-md text-blue-600 hover:bg-blue-200"
        nextClassName="px-3 py-2 rounded-md text-blue-600 hover:bg-blue-200"
        activeClassName="bg-blue-600 text-white"
        previousLabel="Previous"
        nextLabel="Next"
      />
    </div>
  );
};

export default Pagination;
