import { getOptions } from '../../Utils'
import { LOCAL_STORAGE_FILTER_FORM, LOCAL_STORAGE_HEADER } from '../../constants/LocalStorageConsts'
import { FilterMenu, IFilterMenuProps } from '../filter-menu/FilterMenu'
import './Table.css'
import React, { ReactNode, useEffect, useMemo, useState } from 'react'

interface ITableProps {
    data: any[]
    headers: IHeader[]
    keyField: string
    filterMenuProps?: Pick<IFilterMenuProps, 'title' | 'inputs'>
    mainSearchInput?: IMainSearchInputProps
}

interface IMainSearchInputProps {
    placeHolderName: string
    searchKey: string
}

interface IHeader {
    key: string
    title: string
    isAscending?: boolean
}

export const Table = ({ data, headers, keyField, filterMenuProps, mainSearchInput }: ITableProps) => {

    const localStorageForm = localStorage.getItem(LOCAL_STORAGE_FILTER_FORM)
    const localStorageHeader = localStorage.getItem(LOCAL_STORAGE_HEADER)

    const [filteredData, setFilteredData] = useState<any[]>([])
    const [selectedHeader, setSelectedHeader] = useState<string>((localStorageHeader && JSON.parse(localStorageHeader).title) ?? '')
    const [tableHeaders, setTableHeaders] = useState<IHeader[]>(headers.map(({ key, title }) =>
        ({ key, title, isAscending: localStorageHeader && title === JSON.parse(localStorageHeader).title ? JSON.parse(localStorageHeader).isAscending : false })
    ))
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState<boolean>(false)
    const [inputValue, setInputValue] = useState<string>('')

    useEffect(() => {
        filterListByKeys()
    }, [localStorageForm])


    const filterListByKeys = () => {
        const objectEntries = Object.entries(localStorageForm ? JSON.parse(localStorageForm) : {})
        const filteredData = data.filter(item => objectEntries.every(([key, value]) => item[key] && item[key].toString().toLowerCase().includes((value as string).toLowerCase())))
        setFilteredData(filteredData)
        return filteredData
    }

    const sortedData = useMemo(() => {
        const currentHeader = tableHeaders.find(header => header.title === selectedHeader)

        if (!currentHeader) return filteredData

        const sortedData = [...filteredData]
        sortedData.sort((a, b) => {
            const aValue = a[currentHeader.key]
            const bValue = b[currentHeader.key]
            if (aValue === bValue) return 0
            if (typeof aValue === 'number' && typeof bValue === 'number') return currentHeader.isAscending ? aValue - bValue : bValue - aValue
            if (typeof aValue === 'string' && typeof bValue === 'string') return currentHeader.isAscending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
            if (aValue instanceof Date && bValue instanceof Date) return currentHeader.isAscending ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime()
            return 0
        })
        return sortedData
    }, [selectedHeader, data, tableHeaders, filteredData])

    const handleHeaderClick = (header: IHeader) => {
        const currentHeader: IHeader | undefined = tableHeaders.find(h => h.title === header.title)
        setTableHeaders(prevTableHeaders => prevTableHeaders.map(currentHeader => ({ ...currentHeader, isAscending: header.title === currentHeader.title ? !currentHeader.isAscending : false })))
        setSelectedHeader(header.title)
        localStorage.setItem(LOCAL_STORAGE_HEADER, JSON.stringify({ ...currentHeader, isAscending: !header.isAscending }))
    }

    const closeFilterMenu = () => {
        setIsFilterMenuOpen(false)
    }

    const handleChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (mainSearchInput) {
            const { searchKey } = mainSearchInput
            const { value } = e.target
            setInputValue(value)
            const filteredData = data.filter(item => item[searchKey].toLowerCase().includes(value.toLowerCase()))
            setFilteredData(filteredData)
        }
    }

    return (
        <div>
            {mainSearchInput && <div>
                <input placeholder={`Search By ${mainSearchInput?.placeHolderName}...`} value={inputValue} onChange={(e) => handleChangeSearchInput(e)} />
            </div>}
            <div>
                {filterMenuProps && <button onClick={() => setIsFilterMenuOpen(prevIsFilterMenuOpen => !prevIsFilterMenuOpen)}>Filter</button>}
                {isFilterMenuOpen && filterMenuProps && <FilterMenu  {...filterMenuProps} filterListByKeys={filterListByKeys} closeFilterMenu={closeFilterMenu} />}
            </div>
            {filteredData.length > 0 ? <table>
                <thead>
                    <tr>
                        {tableHeaders.map(header => <th className='table-head'
                            onClick={() => handleHeaderClick(header)}
                            key={header.title}>
                            <div>{header.title}<span>{localStorageHeader && JSON.parse(localStorageHeader).title === header.title && (header.isAscending ? ' 🔼' : ' 🔽')}</span></div>
                        </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map(item => <tr key={item[keyField]}>
                        {Object.entries(item).map(([key, value]) => <td key={key}>{(typeof value === "string" || typeof value === "number") && value as ReactNode}</td>)}
                    </tr>)}
                </tbody>
            </table> : <h2>No data to display</h2>}
        </div>
    )
}