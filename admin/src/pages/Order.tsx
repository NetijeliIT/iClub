import { useState } from "react";
import { PencilIcon } from '@heroicons/react/24/outline';
import {
    ColumnDef,
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table';
import { useQuery } from "@tanstack/react-query";
// import { Category, CategoryForm } from "../types";
// import toast from "react-hot-toast";
import { getOrders } from "../services/apiOrder";
import UpdateStatusOrderModal from "../components/UpdateStatusOrderModal";
import { Order } from "../types";

export default function OrderPage() {
    // const queryClient = useQueryClient();
    const [show, setShow] = useState<boolean>(false);
    const [editingCat, setEditingCat] = useState<Order | null>(null);
    // const [del, setDel] = useState<boolean | string>(false);
    const { data, isLoading, error } = useQuery({
        queryKey: ['order'],
        queryFn: () => getOrders(),
    });

    console.log(data);

    const columns: ColumnDef<any>[] = [
        // {
        //     accessorKey: 'id',
        //     header: 'ID',
        //     cell: (info) => info.getValue(),
        // },
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
                    {/* <button
                        onClick={() => {
                            setDel(row.original.id as string);
                        }}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button> */}
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
        return <p>Error loading categories 😢</p>;
    }



    return (
        <>

            <UpdateStatusOrderModal details={editingCat!} isOpen={show} onClose={() => setShow(false)} />
            <section>
                <div className='flex justify-between items-center'>
                    <h1 className='text-2xl font-semibold'>Orders</h1>
                </div>
                <div className='mt-4'>
                    <table className="min-w-full border border-gray-300 rounded-xl">
                        <thead className="bg-gray-100">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="text-left px-4 py-2 border-b font-medium"
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-4 py-2 border-b">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
}