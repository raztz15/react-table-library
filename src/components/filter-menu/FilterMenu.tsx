import { Button, Card, FormControl, Input, MenuItem, Select, Typography } from '@mui/material'
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
        <Card className='filter-menu--container'>
            <Typography variant='h4'>{title}</Typography>
            <FormControl className='filter-menu--form'>
                {inputs.map(({ type, label, key, required, options }) => {
                    return <div key={key}>
                        <label htmlFor={key}>{label}: </label>
                        {type === InputTypes.select ?
                            <Select sx={{ width: '100%' }} name={key} value={inputValue[key] || (options && options[0].optionVal)} onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}>
                                {options?.map(option => <MenuItem value={option.optionVal} key={option.optionKey}>{option.optionVal}</MenuItem>)}
                            </Select> :
                            <Input value={inputValue[key] || ''} type={type} id={key} name={key} required={required} onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)} />}
                    </div>
                })}
                <div className='filter-menu--buttons'>
                    <Button onClick={(e) => handleSubmit(e as React.MouseEvent<HTMLInputElement, MouseEvent>)} variant='contained' color='success' type="submit" value="Submit" >Submit</Button>
                    <Button type="reset" value="Clear" color="primary" onClick={handleClear} >Clear</Button>
                </div>
            </FormControl>
        </Card>
    )
}
