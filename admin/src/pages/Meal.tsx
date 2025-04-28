import { useState } from "react";
import MealFormModal from "../components/MealFormModal";
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
    ColumnDef,
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table';
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { Meal, MealForm } from "../types";
import { deleteMeal, getMeal } from "../services/apiMeal";
import { getCategory } from "../services/apiCategory";
import toast from "react-hot-toast";
import DeleteModal from "../components/DeleteModal";

export default function MealPage() {
    const queryClient = useQueryClient();
    const [show, setShow] = useState(false);
    const [page, setPage] = useState(1);
    const [editingMeal, setEditingMeal] = useState<MealForm | null>(null);
    const [del, setDel] = useState<boolean | string>(false);
    const pageSize = 10;
    const [data, cats] = useQueries({
        queries: [
            {
                queryKey: ['meal', page],
                queryFn: () => getMeal({ page, pageSize }),
            },
            {
                queryKey: ['category'],
                queryFn: () => getCategory(),
            }
        ]
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteMeal(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['meal', page] });
            toast.success("Meal deleted successfully!");
        },
        onError: () => {
            toast.error("Failed to delete meal");
        },
    });

    const columns: ColumnDef<MealForm>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            cell: (info) => info.getValue(),
        },
        {
            accessorKey: 'name',
            header: 'Name',
            cell: (info) => info.getValue(),
        },
        {
            accessorKey: 'price',
            header: 'Price',
            cell: (info) => info.getValue(),
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setEditingMeal(row.original);
                            setShow(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                    >
                        <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => {
                            setDel(row.original.id!)
                        }}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: data?.data?.response || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });


    const totalPages = Math.ceil((data?.data?.response?.length || 0) / pageSize);

    if (data.isLoading) {
        return <p>Loading...</p>;
    }

    if (data.error) {
        return <p>Error loading meals 😢</p>;
    }

    console.log(data);


    return (
        <>
            <DeleteModal isOpen={del} onClose={() => setDel(false)} onDelete={() => {
                deleteMutation.mutate(del as string);
            }} />
            <MealFormModal cats={cats.data} isOpen={show} onClose={() => {
                setShow(false)
                setEditingMeal(null)
            }} defaultValues={editingMeal} />
            <section>
                <div className='flex justify-between items-center'>
                    <h1 className='text-2xl font-semibold'>Meals</h1>
                    <button
                        onClick={() => setShow(true)}
                        className='flex items-center gap-2 text-base bg-[#D4AF37] p-2 rounded text-white font-medium cursor-pointer hover:opacity-90 duration-150'
                    >
                        <PlusIcon className='w-5 h-5' />
                        Add Meal
                    </button>
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
                    <div className="mt-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, data?.data?.length || 0)} of {data?.data?.length || 0} meals
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                disabled={page === 1}
                                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={page === totalPages}
                                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}