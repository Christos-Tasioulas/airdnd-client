import React, { useState } from 'react';
import { Grid, Button } from '@mui/material';
import './PaginatedGrid.css';

const itemsPerPage = 10; // Number of items/places to display per page

function PaginatedGrid(props) {

    const results = props.results

    // Current Page is the first one
    const [currentPage, setCurrentPage] = useState(1);

    // Paging the results
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = results.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(results.length / itemsPerPage);

    // Page handling for each button 
    function handleFirstPage() {
        setCurrentPage(1)
    };

    function handleNextPage() {
        if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
        }
    };

    function handlePrevPage() {
        if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
        }
    };

    function handleLastPage() {
        setCurrentPage(totalPages);
    };

    return (
        <div className='grid'>
        {/* This is a 5x2 grid displaying the items given */}
        <Grid container spacing={2} columns={5}>
            {currentItems.map((item, index) => (
            <Grid key={index} item xs={1}>
                {item}
            </Grid>
            ))}
        </Grid>
        {/* Page Buttons enabled and disabled accordingly */}
        <div className='grid-buttons'>
            <Button onClick={handleFirstPage} disabled={currentPage === 1}>
                First Page
            </Button>
            <Button onClick={handlePrevPage} disabled={currentPage === 1}>
                Previous Page
            </Button>
            <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
                Next Page
            </Button>
            <Button onClick={handleLastPage} disabled={currentPage === totalPages}>
                Last Page
            </Button>
        </div>
        </div>
    );
};

export default PaginatedGrid;
