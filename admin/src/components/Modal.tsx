// components/ui/Modal.tsx
import { XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500 cursor-pointer"
                >
                    <XMarkIcon className='w-5 h-5' />
                </button>
                {title && <h2 className="text-lg font-bold mb-4">{title}</h2>}
                <div>{children}</div>
            </div>
        </div>
    );
};

export default Modal;
