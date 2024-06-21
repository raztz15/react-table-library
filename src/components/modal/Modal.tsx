import { createPortal } from 'react-dom'
import './Modal.css'
import React, { useState } from 'react'

interface IModalProps {
    component: React.ReactNode
    isOpen: boolean
    closeModal: () => void
}

export const Modal = ({ isOpen, component, closeModal }: IModalProps) => {


    return createPortal(
        isOpen && <div id='modal' className='modal--container' onClick={closeModal}>
            <div onClick={(e) => e.stopPropagation()} className='modal--wrapper'>
                <div className='close-modal' onClick={closeModal}>&times;</div>
                <div>{component}</div>
            </div>
        </div >, document.body
    )
}
