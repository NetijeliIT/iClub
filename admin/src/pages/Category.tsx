import { useState } from "react";
import {
    ColumnDef,
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CategoryForm } from "../types";
import { deleteCategory, getCategory } from "../services/apiCategory";
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import CategoryFormModal from "../components/CategoryFormModal";
import DeleteModal from "../components/DeleteModal";
import Pagination from "../components/Pagination";
import toast from "react-hot-toast";

export default function CategoryPage() {
    const queryClient = useQueryClient();
    const [show, setShow] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [editingCategory, setEditingCategory] = useState<CategoryForm | null>(null);
    const [del, setDel] = useState<boolean | string>(false);

    const { data, isLoading, error } = useQuery({
        queryKey: ['category', page, pageSize],
        queryFn: () => getCategory({ page, pageSize }),
    });

    console.log(data);
    

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['category', page, pageSize] });
            toast.success("Category deleted successfully!");
            setDel(false);

        },
        onError: () => {
            toast.error("Failed to delete category");
            setDel(false);

        },
    });

    const columns: ColumnDef<CategoryForm>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            cell: (info) => info.getValue(),
        },
        {
            accessorKey: 'title',
            header: 'Name',
            cell: (info) => info.getValue(),
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setEditingCategory(row.original);
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
            <DeleteModal
                isOpen={!!del}
                onClose={() => setDel(false)}
                onDelete={() => {
                    deleteMutation.mutate(del as string);
                }}
            />
            <CategoryFormModal
                isOpen={show}
                onClose={() => {
                    setShow(false);
                    setEditingCategory(null);
                }}
                defaultValues={editingCategory}
            />
            <section className="p-6">
                <div className='flex justify-between items-center'>
                    <h1 className='text-2xl font-semibold text-gray-800'>Categories</h1>
                    <button
                        onClick={() => setShow(true)}
                        className='flex items-center gap-2 text-base bg-[#708238] p-2 rounded text-white font-medium cursor-pointer hover:bg-opacity-90 transition-colors duration-150'
                    >
                        <PlusIcon className='w-5 h-5' />
                        Add Category
                    </button>
                </div>
                <div className='mt-4 bg-white shadow rounded-xl'>
                    <table className="min-w-full border border-gray-200 rounded-xl">
                        <thead className="bg-gray-50">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="text-left px-4 py-3 font-medium text-gray-700 uppercase text-sm"
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-4 py-3 text-sm text-gray-600">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination
                        page={page}
                        totalItems={data?.count || 0}
                        pageSize={pageSize}
                        onPageChange={setPage}
                        onPageSizeChange={setPageSize}
                    />
                </div>
            </section>
        </>
    );
}