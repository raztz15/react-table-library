import './TableFooter.css'
import React, { useState } from 'react'

interface ITableFooterProps {
    dataLength: number
    numOfItemsToShow: number
    updateCurrentIndex: (pageNum: number) => void
    currentPage: number
    handleNextButton: () => void
    handlePrevButton: () => void
}

export const TableFooter = ({ dataLength, numOfItemsToShow, updateCurrentIndex, currentPage, handleNextButton, handlePrevButton }: ITableFooterProps) => {

    const pages = Math.ceil(dataLength / numOfItemsToShow)

    const pageLinksToShow = 3;
    const halfPageLinksToShow = Math.floor(pageLinksToShow / 2);

    // Determine start and end page numbers
    let startPage = Math.max(currentPage - halfPageLinksToShow, 1);
    let endPage = Math.min(currentPage + halfPageLinksToShow, pages);

    // Adjust if we are at the beginning or end of the page range
    if (currentPage <= halfPageLinksToShow) {
        endPage = Math.min(pageLinksToShow, pages);
    } else if (currentPage + halfPageLinksToShow >= pages) {
        startPage = Math.max(pages - pageLinksToShow + 1, 1);
    }

    const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, idx) => startPage + idx);

    if (pages <= 1) return null

    return (
        <div className='table--footer'>
            <button onClick={handlePrevButton} disabled={currentPage === 1}>Previous</button>
            {startPage > 1 && <div className="table--footer__pages" onClick={() => updateCurrentIndex(1)}>1</div>}
            {startPage > 2 && <span>...</span>}
            {pageNumbers.map(pageNum => (
                <div
                    key={pageNum}
                    aria-current={currentPage === pageNum ? 'page' : undefined}
                    className={`table--footer__pages ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => updateCurrentIndex(pageNum)}
                >
                    {pageNum}
                </div>
            ))}
            {endPage < pages - 1 && <span>...</span>}
            {endPage < pages && <div className="table--footer__pages" onClick={() => updateCurrentIndex(pages)}>{pages}</div>}
            <button onClick={handleNextButton} disabled={currentPage === pages}>Next</button>
        </div>
    )
}
