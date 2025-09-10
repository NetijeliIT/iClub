import { useState } from "react";
import { PencilIcon } from '@heroicons/react/24/outline';
import {
    ColumnDef,
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table';
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../services/apiOrder";
import UpdateStatusOrderModal from "../components/UpdateStatusOrderModal";
import { Order } from "../types";
import Pagination from "../components/Pagination";

export default function OrderPage() {
    const [show, setShow] = useState<boolean>(false);
    const [editingCat, setEditingCat] = useState<Order | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { data, isLoading, error } = useQuery({
        queryKey: ['order', page, pageSize],
        queryFn: () => getOrders({ page, pageSize }),
    });

    console.log(data);

    const columns: ColumnDef<any>[] = [
        {
            id: 'meals',
            header: 'Meals',
            cell: ({ row }) => (
                row.original?.orderItems.map((el: any, index: number) => {
                    return row.original?.orderItems.length == index + 1 ? `${el.quantity}x ${el.product.name}` : `${el.quantity}x ${el.product.name}, `;
                })
            ),
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: (info) => info.getValue(),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: (info) => info.getValue(),
        },
        {
            id: "user",
            header: "User",
            cell: ({ row }) => (
                <div>
                    {row.original.user.firstName} {row.original.user.secondName}
                </div>
            )
        },
        {
            id: "phoneNumber",
            header: "Phone Number",
            cell: ({ row }) => (
                <div>
                    {row.original.user.phoneNumber}
                </div>
            )
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setEditingCat(row.original);
                            setShow(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                    >
                        <PencilIcon className="w-5 h-5" />
                    </button>
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: data?.response || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error loading orders 😢</p>;
    }

    return (
        <>
            <UpdateStatusOrderModal details={editingCat!} isOpen={show} onClose={() => setShow(false)} />
            <section className="p-6">
                <div className='flex justify-between items-center mb-6'>
                    <h1 className='text-2xl font-semibold'>Orders</h1>
                </div>
                <div className='bg-white shadow-lg rounded-xl overflow-hidden'>
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="text-left px-6 py-4 font-medium text-gray-700 uppercase text-sm tracking-wider"
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row, index) => (
                                <tr
                                    key={row.id}
                                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors duration-150`}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-6 py-4 text-sm text-gray-600">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="p-4 border-t border-gray-200">
                        <Pagination
                            page={page}
                            totalItems={data?.count || 0}
                            pageSize={pageSize}
                            onPageChange={setPage}
                            onPageSizeChange={setPageSize}
                        />
                    </div>
                </div>
            </section>
        </>
    );
}