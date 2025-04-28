import { useState } from "react";
import CategoryFormModal from "../components/CategoryFormModal";
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
    ColumnDef,
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Category, CategoryForm } from "../types";
import { deleteCategory, getCategory } from "../services/apiCategory";
import DeleteModal from "../components/DeleteModal";
import toast from "react-hot-toast";

export default function CategoryPage() {
    const queryClient = useQueryClient();
    const [show, setShow] = useState<boolean>(false);
    const [editingCat, setEditingCat] = useState<CategoryForm | null>(null);
    const [del, setDel] = useState<boolean | string>(false);
    const { data, isLoading, error } = useQuery({
        queryKey: ['category'],
        queryFn: () => getCategory(),
    });

    const columns: ColumnDef<Category>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            cell: (info) => info.getValue(),
        },
        {
            accessorKey: 'title',
            header: 'Title',
            cell: (info) => info.getValue(),
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
                    <button
                        onClick={() => {
                            setDel(row.original.id as string);
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
        data: data?.response || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["category"] });
            toast.success("Meal deleted successfully!");
        },
        onError: () => {
            toast.error("Failed to delete meal");
        },
    });

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error loading categories 😢</p>;
    }



    return (
        <>
            <DeleteModal isOpen={del} onClose={() => setDel(false)} onDelete={() => {
                deleteMutation.mutate(del as string)
            }
            } />
            <CategoryFormModal isOpen={show} onClose={() => {
                setShow(false)
                setEditingCat(null)
            }} defaultValues={editingCat} />
            <section>
                <div className='flex justify-between items-center'>
                    <h1 className='text-2xl font-semibold'>Categories</h1>
                    <button
                        onClick={() => setShow(true)}
                        className='flex items-center gap-2 text-base bg-[#D4AF37] p-2 rounded text-white font-medium cursor-pointer hover:opacity-90 duration-150'
                    >
                        <PlusIcon className='w-5 h-5' />
                        Add Category
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
                </div>
            </section>
        </>
    );
}