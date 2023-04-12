import ReactPaginate from "react-paginate";

const Pagination = ({ pageCount, handlePageChange, currentPage }) => {
  return (
    <div className="flex items-center justify-center py-5">
      <ReactPaginate
        pageCount={pageCount}
        onPageChange={handlePageChange}
        forcePage={currentPage}
        pageRangeDisplayed={5}
        marginPagesDisplayed={1}
        containerClassName="flex items-center space-x-3 sm:space-x-5 lg:pl-24"
        pageClassName="flex items-center justify-center text-lg rounded-md text-gray-800 hover:bg-black hover:text-slate-100 transition duration-150 ease"
        pageLinkClassName="w-10 h-10 flex items-center justify-center"
        previousClassName="hidden sm:flex p-2 rounded-md text-gray-800 hover:bg-black hover:text-slate-100 transition duration-150 ease"
        nextClassName="hidden sm:flex p-2 rounded-md text-gray-800 hover:bg-black hover:text-slate-100 transition duration-150 ease"
        activeClassName="bg-white"
        previousLabel="Previous"
        nextLabel="Next"
      />
    </div>
  );
};

export default Pagination;
