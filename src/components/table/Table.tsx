import { formatDate, isValidDate } from '../../Utils'
import { LOCAL_STORAGE_CURR_IDX, LOCAL_STORAGE_CURR_PAGE, LOCAL_STORAGE_FILTER_FORM, LOCAL_STORAGE_HEADER } from '../../constants/LocalStorageConsts'
import { EmployeeDetails, IEmployeeDetailsProps } from '../employee-details/EmployeeDetails'
import { FilterMenu, IFilterMenuProps } from '../filter-menu/FilterMenu'
import { Modal } from '../modal/Modal'
import { TableFooter } from '../table-footer/TableFooter'
import './Table.css'
import React, { ReactNode, useEffect, useMemo, useState } from 'react'
import MuiTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Input } from '@mui/material'


interface ITableProps<T> {
    data: any[]
    headers: IHeader<T>[]
    keyField: keyof T
    filterMenuProps?: Pick<IFilterMenuProps, 'title' | 'inputs'>
    mainSearchInput?: IMainSearchInputProps
    numOfItemsToShow?: number
}

interface IMainSearchInputProps {
    placeHolderName: string
    searchKey: string
}

interface IHeader<T> {
    key?: keyof T
    title: string
    isAscending?: boolean
}

export const Table = <T,>({ data, headers, keyField, filterMenuProps, mainSearchInput, numOfItemsToShow = data.length }: ITableProps<T>) => {

    const localStorageForm = localStorage.getItem(LOCAL_STORAGE_FILTER_FORM)
    const localStorageHeader = localStorage.getItem(LOCAL_STORAGE_HEADER)
    const localStorageCurrPage = localStorage.getItem(LOCAL_STORAGE_CURR_PAGE)
    const localStorageCurrIdx = localStorage.getItem(LOCAL_STORAGE_CURR_IDX)

    const [filteredData, setFilteredData] = useState<T[]>([])
    const [selectedHeader, setSelectedHeader] = useState<string>((localStorageHeader && JSON.parse(localStorageHeader).title) ?? '')
    const [tableHeaders, setTableHeaders] = useState<IHeader<T>[]>(headers.map(({ key, title }) =>
        ({ key, title, isAscending: localStorageHeader && title === JSON.parse(localStorageHeader).title ? JSON.parse(localStorageHeader).isAscending : false })
    ))
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState<boolean>(false)
    const [inputValue, setInputValue] = useState<string>((localStorageForm && mainSearchInput?.searchKey) ? JSON.parse(localStorageForm)[mainSearchInput?.searchKey] : '')
    const [selectedItem, setSelectedItem] = useState<object>()
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
    const [currentIndex, setCurrentIndex] = useState((localStorageCurrIdx && JSON.parse(localStorageCurrIdx)) ?? 0)
    const [currentPage, setcurrentPage] = useState<number>((localStorageCurrPage && JSON.parse(localStorageCurrPage)) ?? 1)


    useEffect(() => {
        filterListByKeys()
    }, [localStorageForm])

    useEffect(() => {
        setInputValue((localStorageForm && mainSearchInput?.searchKey) ? JSON.parse(localStorageForm)[mainSearchInput?.searchKey] : undefined)
    }, [localStorageForm])

    useEffect(() => {
        if (!inputValue) {

            setCurrentIndex((localStorageCurrIdx && JSON.parse(localStorageCurrIdx)))
        }
    }, [inputValue])

    const filterListByKeys = () => {
        const objectEntries = Object.entries(localStorageForm ? JSON.parse(localStorageForm) : {})
        const filtered = data.filter(item => objectEntries.every(([key, value]) => item[key] && item[key].toString().toLowerCase().includes((value as string).toLowerCase())))
        setFilteredData(filtered)
    }

    const sortedData = useMemo(() => {
        const currentHeader = tableHeaders.find(header => header.title === selectedHeader)

        if (filteredData.length < numOfItemsToShow) setCurrentIndex(0)
        if (!currentHeader) return filteredData

        const sortedData = [...filteredData]
        sortedData.sort((a, b) => {
            if (currentHeader.key) {

                const aValue = a[currentHeader.key]
                const bValue = b[currentHeader.key]
                if (aValue === bValue) return 0
                if (typeof aValue === 'number' && typeof bValue === 'number') return currentHeader.isAscending ? aValue - bValue : bValue - aValue
                if (typeof aValue === 'string' && typeof bValue === 'string') return currentHeader.isAscending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
                if (aValue instanceof Date && bValue instanceof Date) return currentHeader.isAscending ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime()
            }
            return 0
        })

        return sortedData
    }, [selectedHeader, data, tableHeaders, filteredData])

    const handleHeaderClick = (header: IHeader<T>) => {
        if (header.key) {
            const currentHeader: IHeader<T> | undefined = tableHeaders.find(h => h.title === header.title)
            setTableHeaders(prevTableHeaders => prevTableHeaders.map(currentHeader => ({ ...currentHeader, isAscending: header.title === currentHeader.title ? !currentHeader.isAscending : false })))
            setSelectedHeader(header.title)
            localStorage.setItem(LOCAL_STORAGE_HEADER, JSON.stringify({ ...currentHeader, isAscending: !header.isAscending }))
        }
    }

    const closeFilterMenu = () => {
        setIsFilterMenuOpen(false)
    }

    const handleChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {

        if (mainSearchInput) {
            const { searchKey } = mainSearchInput
            const { value } = e.target
            setInputValue(value)
            localStorage.setItem(LOCAL_STORAGE_FILTER_FORM, JSON.stringify({ [searchKey]: value }))
            const filteredData = data.filter(item => item[searchKey].toString().toLowerCase().includes(value.toLowerCase()))
            setFilteredData(filteredData)
        }
    }

    const handleRowClick = (row: object) => {
        setSelectedItem(row)
        setIsOpenModal(true)
    }

    const closeModal = () => {
        setIsOpenModal(false)
    }

    const updateCurrentIndex = (pageNum: number) => {
        setcurrentPage(pageNum)
        localStorage.setItem(LOCAL_STORAGE_CURR_PAGE, JSON.stringify(pageNum))
        setCurrentIndex((pageNum - 1) * numOfItemsToShow)
        localStorage.setItem(LOCAL_STORAGE_CURR_IDX, JSON.stringify((pageNum - 1) * numOfItemsToShow))
    }

    const handleNextButton = () => {
        const pages = Math.ceil(sortedData.length / numOfItemsToShow)
        let currPage = currentPage
        if (currentPage < pages) currPage += 1
        setcurrentPage(currPage)
        setCurrentIndex((currPage - 1) * numOfItemsToShow)
        localStorage.setItem(LOCAL_STORAGE_CURR_IDX, JSON.stringify((currPage - 1) * numOfItemsToShow))
        localStorage.setItem(LOCAL_STORAGE_CURR_PAGE, JSON.stringify(currPage))
    }

    const handlePrevButton = () => {
        let currPage = currentPage
        if (currPage > 1) currPage -= 1
        setcurrentPage(currPage)
        setCurrentIndex((currPage - 1) * numOfItemsToShow)
        localStorage.setItem(LOCAL_STORAGE_CURR_IDX, JSON.stringify((currPage - 1) * numOfItemsToShow))
        localStorage.setItem(LOCAL_STORAGE_CURR_PAGE, JSON.stringify(currPage))
    }

    return (
        <React.Fragment>
            <div className='tools-bar'>
                {filterMenuProps && <Button onClick={() => setIsFilterMenuOpen(prevIsFilterMenuOpen => !prevIsFilterMenuOpen)}>Filter</Button>}
                {isFilterMenuOpen && filterMenuProps && <FilterMenu  {...filterMenuProps} filterListByKeys={filterListByKeys} closeFilterMenu={closeFilterMenu} />}
                {mainSearchInput && <div>
                    <Input placeholder={`Search By ${mainSearchInput?.placeHolderName}...`} value={inputValue} onChange={(e) => handleChangeSearchInput(e as React.ChangeEvent<HTMLInputElement>)} />
                </div>}
            </div>
            {filteredData.length > 0 ? <div style={{ minHeight: 587 }}><TableContainer component={Paper} >
                <MuiTable sx={{ minWidth: 650 }} aria-label="a dense table" className='main-table--container'>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "black", color: "white", fontWeight: "bold" }}>
                            {tableHeaders.map((header, idx) => <TableCell sx={{ color: "white", fontWeight: "600" }} align={idx === 0 ? 'left' : "right"} className='table-head'
                                style={{ cursor: header.key ? "pointer" : undefined }}
                                onClick={() => handleHeaderClick(header)}
                                key={header.title}>
                                {header.title}<span>{localStorageHeader && JSON.parse(localStorageHeader).title === header.title && (header.isAscending ? ' 🔼' : ' 🔽')}</span>
                            </TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedData.slice(currentIndex, currentIndex + numOfItemsToShow).map(item => <TableRow hover key={item[keyField] as string}>
                            {Object.entries(item as object).map(([key, value], idx) => {
                                if (typeof value === 'object' && value !== null) return null
                                return <TableCell align={idx === 0 ? 'left' : "right"} component={idx === 0 ? "th" : undefined} scope={idx === 0 ? "row" : undefined} className='table--body__td' onClick={() => handleRowClick(item as object)} key={key}>
                                    {(typeof value === 'string' && isValidDate(value) ?
                                        formatDate(value) :
                                        (typeof value === "string" || typeof value === "number") &&
                                        value as ReactNode)}</TableCell >
                            })}
                        </TableRow>)}
                        {isOpenModal && <Modal component={<EmployeeDetails {...selectedItem as IEmployeeDetailsProps} />} isOpen={isOpenModal} closeModal={closeModal} />}
                    </TableBody>
                </MuiTable> </TableContainer></div> : <h2>No data to display</h2>}
            <TableFooter dataLength={sortedData.length} numOfItemsToShow={numOfItemsToShow} updateCurrentIndex={updateCurrentIndex} currentPage={currentPage} handleNextButton={handleNextButton} handlePrevButton={handlePrevButton} />
        </React.Fragment>
    )
}