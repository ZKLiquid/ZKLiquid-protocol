import React, { useState } from 'react';

const Pagination = ({ pageNumbers, currentPage, onPageChange }) => {
  const dataPerPage = 2; // Number of rows to show per page

  // State to keep track of the current page
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the index range for the current page
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = data.slice(indexOfFirstData, indexOfLastData);

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Generate pagination numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(data.length / dataPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className='flex items-center'>
      {currentPage !== 1 && (
        <button
          className='px-2 py-1 mr-2 text-sm font-semibold border rounded-lg bg-white text-[#6D7A86]'
          onClick={() => onPageChange(currentPage - 1)}
        >
          &lt; Previous
        </button>
      )}
      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          className={`px-2 py-1 mx-1 text-sm font-semibold border rounded-lg ${
            currentPage === pageNumber
              ? 'bg-white text-white border-white'
              : 'bg-[#6D7A86] text-white'
          }`}
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}
      {currentPage !== pageNumbers.length && (
        <button
          className='px-2 py-1 ml-2 text-sm font-semibold border rounded-lg bg-white text-[#6D7A86]'
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next &gt;
        </button>
      )}
    </div>
  );
};

export default Pagination;
