import { getOptions } from '../../Utils'
import { LOCAL_STORAGE_FILTER_FORM, LOCAL_STORAGE_HEADER } from '../../constants/LocalStorageConsts'
import { useDebounce } from '../../hooks/useDecounce'
import { FilterMenu, InputTypes } from '../filter-menu/FilterMenu'
import './Table.css'
import React, { ReactNode, useEffect, useMemo, useState } from 'react'

interface ITableProps {
    data: any[]
    headers: IHeader[]
}

interface IHeader {
    key: string
    title: string
    isAscending?: boolean
}

export const Table = ({ data, headers }: ITableProps) => {

    const localStorageForm = localStorage.getItem(LOCAL_STORAGE_FILTER_FORM)
    const localStorageHeader = localStorage.getItem(LOCAL_STORAGE_HEADER)

    // const [tableData, setTableData] = useState<any[]>(data)
    const [filteredData, setFilteredData] = useState<any[]>([])
    const [selectedHeader, setSelectedHeader] = useState<string>((localStorageHeader && JSON.parse(localStorageHeader).title) ?? '')
    const [tableHeaders, setTableHeaders] = useState<IHeader[]>(headers.map(({ key, title }) =>
        ({ key, title, isAscending: localStorageHeader && title === JSON.parse(localStorageHeader).title ? JSON.parse(localStorageHeader).isAscending : false })
    ))
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState<boolean>(false)

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

    const filterMenuProps =
    {
        title: 'Employees',
        inputs: [
            { key: "name", label: "Name", type: InputTypes.text },
            { key: "age", label: "Age", type: InputTypes.number },
            { key: "annualRating", label: "Annual Rating", type: InputTypes.number },
            { key: "dateOfJoining", label: "Date Of Joining", type: InputTypes.date },
            { key: "role", label: "Role", type: InputTypes.select, options: getOptions(data, "role") },
            { key: "department", label: "Department", type: InputTypes.select, options: getOptions(data, "department") },
        ],
        filterListByKeys,
        closeFilterMenu
    }

    return (
        <div>
            <div>
                <button onClick={() => setIsFilterMenuOpen(prevIsFilterMenuOpen => !prevIsFilterMenuOpen)}>Filter</button>
                {isFilterMenuOpen && <FilterMenu {...filterMenuProps} />}
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
                    {sortedData.map(item => <tr key={item.id}>
                        {Object.entries(item).map(([key, value]) => <td key={key}>{(typeof value === "string" || typeof value === "number") && value as ReactNode}</td>)}
                    </tr>)}
                </tbody>
            </table> : <h2>No data to display</h2>}
        </div>
    )
}