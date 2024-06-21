import './TableFooter.css'
import React, { useState } from 'react'

interface ITableFooterProps {
    dataLength: number
    numOfItemsToShow: number
    updateCurrentIndex: (pageNum: number) => void
    currentPage: number
}

export const TableFooter = ({ dataLength, numOfItemsToShow, updateCurrentIndex, currentPage }: ITableFooterProps) => {

    const pages = Math.ceil(dataLength / numOfItemsToShow)

    if (pages <= 1) return null

    return (
        <div className='table--footer'>{Array.from({ length: pages }).map((_, idx) =>
            <div aria-current={currentPage === idx + 1 ? 'page' : undefined} className={`table--footer__pages ${currentPage === idx + 1 ? 'active' : ''}`} key={idx} onClick={() => updateCurrentIndex(idx + 1)}>{idx + 1}</div>)}
        </div>
    )
}
