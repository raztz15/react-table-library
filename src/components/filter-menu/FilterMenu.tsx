import { LOCAL_STORAGE_FILTER_FORM } from '../../constants/LocalStorageConsts'
import './FilterMenu.css'
import React, { FormEvent, useEffect, useState } from 'react'

export interface IFilterMenuProps {
    title: string
    inputs: IInput[],
    filterListByKeys: (value: {}) => void
    closeFilterMenu: () => void
}

interface IInput {
    type: InputTypes
    label: string
    key: string
    options?: any[]
    required?: boolean
}

export enum InputTypes {
    date = 'date',
    text = 'text',
    number = 'number',
    select = 'select'
}

export const FilterMenu = ({ title, inputs, filterListByKeys, closeFilterMenu }: IFilterMenuProps) => {

    const localStorageForm = localStorage.getItem(LOCAL_STORAGE_FILTER_FORM)
    const [form, setForm] = useState<Record<string, string>>(localStorageForm ? JSON.parse(localStorageForm) : {})
    const [inputValue, setInputValue] = useState<Record<string, string>>(form)

    const handleSubmit = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        localStorage.setItem(LOCAL_STORAGE_FILTER_FORM, JSON.stringify(form))
        e.preventDefault()
        filterListByKeys(form)
        closeFilterMenu()
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { value, name } = e.target
        setInputValue(prevInputValue => ({ ...prevInputValue, [name]: value }))
        setForm(prevForm => ({ ...prevForm, [name]: value }))
    }

    const handleClear = () => {
        setForm({})
        setInputValue({})
        localStorage.setItem(LOCAL_STORAGE_FILTER_FORM, JSON.stringify({}))
    }

    return (
        <div className='filter-menu--container'>
            <h1>{title}</h1>
            <form className='filter-menu--form'>
                {inputs.map(({ type, label, key, required, options }) => {
                    return <div key={key}>
                        <label htmlFor={key}>{label}: </label>
                        {type === InputTypes.select ?
                            <select name={key} value={inputValue[key] || ''} onChange={(e) => handleChange(e)}>
                                {options?.map(option => <option key={option.optionKey}>{option.optionVal}</option>)}
                            </select> :
                            <input value={inputValue[key] || ''} type={type} id={key} name={key} required={required} onChange={(e) => handleChange(e)} />}
                    </div>
                })}
                <div className='filter-menu--buttons'>
                    <input onClick={(e) => handleSubmit(e)} type="submit" value="Submit" />
                    <input type="reset" value="Clear" onClick={handleClear} />
                </div>
            </form>
        </div>
    )
}
