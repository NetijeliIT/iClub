import { useState } from "react";

type PaginationProps = {
    page: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
};

export default function Pagination({ page, totalItems, pageSize, onPageChange, onPageSizeChange }: PaginationProps) {
    const [limit, setLimit] = useState(pageSize);
    const totalPages = Math.ceil(totalItems / pageSize);

    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLimit = parseInt(e.target.value);
        setLimit(newLimit);
        onPageSizeChange(newLimit);
        onPageChange(1); // Reset to first page when limit changes
    };

    return (
        <div className="mt-4 flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-700">
                    Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalItems)} of {totalItems} items
                </p>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <label htmlFor="pageSize" className="text-sm text-gray-700">Items per page:</label>
                    <select
                        id="pageSize"
                        value={limit}
                        onChange={handleLimitChange}
                        className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onPageChange(Math.max(page - 1, 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-[#D4AF37] text-white rounded-md hover:bg-opacity-90 transition-colors duration-150 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => onPageChange(Math.min(page + 1, totalPages))}
                        disabled={page === totalPages}
                        className="px-4 py-2 bg-[#D4AF37] text-white rounded-md hover:bg-opacity-90 transition-colors duration-150 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}