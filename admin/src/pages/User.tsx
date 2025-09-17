import { useState } from "react";
import UserFormModal from "../components/UserFormModal";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { UserForm } from "../types";
import { deleteUser, getUser } from "../services/apiUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import DeleteModal from "../components/DeleteModal";
import Pagination from "../components/Pagination";
import toast from "react-hot-toast";

export default function UserPage() {
    const queryClient = useQueryClient();
    const [show, setShow] = useState(false);
    const [del, setDel] = useState<boolean | string>(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { data, isLoading, error } = useQuery({
        queryKey: ['user', page, pageSize],
        queryFn: () => getUser({ page, pageSize }),
    });


    console.log(data);
    

    const columns: ColumnDef<UserForm>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            cell: (info) => info.getValue(),
        },
        {
            id: 'user',
            header: 'Name',
            cell: ({ row }) => (
                `${row.original.firstName} ${row.original.secondName}`
            ),
        },
        {
            accessorKey: 'phoneNumber',
            header: 'Phone Number',
            cell: (info) => info.getValue(),
        },
        {
            accessorKey: 'isTeacher',
            header: 'Is Teacher',
            cell: (info) => (info.getValue() ? 'Yes' : 'No'),
        },
        {
            accessorKey: 'createdAt',
            header: 'Created At',
            cell: (info) => format(info.getValue() as string, "yyyy-MM-dd"),
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => setDel(row.original.id!)}
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
        data: data?.response || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', page, pageSize] });
            toast.success("User deleted successfully!");
            setDel(false)
        },
        onError: () => {
            toast.error("Failed to delete user");
            setDel(false)

        },
    });

    if (isLoading) {
        return <p className="text-center text-gray-600">Loading...</p>;
    }

    if (error) {
        return <p className="text-center text-red-600">Error loading users 😢</p>;
    }

    return (
        <>
            <DeleteModal
                isOpen={del !== false}
                onClose={() => setDel(false)}
                onDelete={() => {
                    deleteMutation.mutate(del as string);
                }}
            />
            <UserFormModal
                isOpen={show}
                onClose={() => setShow(false)}
            />
            <section className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Users</h1>
                    <button
                        onClick={() => setShow(true)}
                        className="flex items-center gap-2 text-base bg-[#D4AF37] py-2 px-4 rounded text-white font-medium cursor-pointer hover:bg-opacity-90 transition-colors duration-150"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Add User
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