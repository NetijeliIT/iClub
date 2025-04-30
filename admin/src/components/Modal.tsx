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
        <div
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 sm:p-6"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh] p-4 sm:p-6 relative overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition-colors duration-200"
                >
                    <XMarkIcon className="w-5 h  sm:w-6 sm:h-6" />
                </button>
                {title && (
                    <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-800">
                        {title}
                    </h2>
                )}
                <div className="text-sm sm:text-base mb-4">{children}</div>
            </div>
        </div>
    );
};

export default Modal;