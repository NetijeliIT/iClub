import { useState } from "react";
import MealFormModal from "../components/MealFormModal";
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
    ColumnDef,
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table';
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { MealForm } from "../types";
import { deleteMeal, getMeal } from "../services/apiMeal";
import { getCategory } from "../services/apiCategory";
import toast from "react-hot-toast";
import DeleteModal from "../components/DeleteModal";
import Pagination from "../components/Pagination";

export default function MealPage() {
    const queryClient = useQueryClient();
    const [show, setShow] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [editingMeal, setEditingMeal] = useState<MealForm | null>(null);
    const [del, setDel] = useState<boolean | string>(false);

    const [data, cats] = useQueries({
        queries: [
            {
                queryKey: ['meal', page, pageSize],
                queryFn: () => getMeal({ page, pageSize }),
            },
            {
                queryKey: ['category'],
                queryFn: () => getCategory({ page, pageSize }),
            }
        ]
    });

    console.log(data.data);
    

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteMeal(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['meal', page, pageSize] });
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
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-150"
                        title="Edit"
                    >
                        <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => {
                            setDel(row.original.id!)
                        }}
                        className="text-red-600 hover:text-red-800 transition-colors duration-150"
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

    if (data.isLoading) {
        return <p className="text-center text-gray-600">Loading...</p>;
    }

    if (data.error) {
        return <p className="text-center text-red-600">Error loading meals 😢</p>;
    }

    return (
        <>
            <DeleteModal
                isOpen={del}
                onClose={() => setDel(false)}
                onDelete={() => {
                    deleteMutation.mutate(del as string);
                }}
            />
            <MealFormModal
                cats={cats.data}
                isOpen={show}
                onClose={() => {
                    setShow(false);
                    setEditingMeal(null);
                }}
                defaultValues={editingMeal}
            />
            <section className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Meals</h1>
                    <button
                        onClick={() => setShow(true)}
                        className="flex items-center gap-2 text-base bg-[#D4AF37] py-2 px-4 rounded text-white font-medium cursor-pointer hover:bg-opacity-90 transition-colors duration-150"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Add Meal
                    </button>
                </div>
                <div className="bg-white shadow-lg rounded-xl overflow-hidden">
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
                                    className={`${
                                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    } hover:bg-gray-100 transition-colors duration-150`}
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
                            totalItems={data?.data?.count || 0}
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