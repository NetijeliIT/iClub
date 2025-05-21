import { useState } from "react";
// import UserFormModal from "../components/UserFormModal";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { UserForm } from "../types";
import { deleteUser, getUser } from "../services/apiUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import DeleteModal from "../components/DeleteModal";
import toast from "react-hot-toast";

export default function UserPage() {
    const queryClient = useQueryClient();
    const [_show, setShow] = useState(false);
    const [del, setDel] = useState<boolean | string>(false);
    const { data, isLoading, error } = useQuery({
        queryKey: ['user'],
        queryFn: () => getUser(),
    });


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
            accessorKey: 'createdAt',
            header: 'Created At',
            cell: (info) => format(info.getValue() as string, "yyyy-MM-dd"),
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ }) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => {
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
        mutationFn: (id: string) => deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            toast.success("User deleted successfully!");
        },
        onError: () => {
            toast.error("Failed to delete user");
        },
    });

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error loading meals 😢</p>;
    }

    console.log(data);

    return (
        <>
            <DeleteModal isOpen={del} onClose={() => setDel(false)} onDelete={() => {
                deleteMutation.mutate(del as string)
            }} />
            {/* <UserFormModal isOpen={show} onClose={() => setShow(false)} /> */}
            <section>
                <div className='flex justify-between items-center'>
                    <h1 className='text-2xl font-semibold'>User</h1>
                    <button
                        onClick={() => setShow(true)}
                        className='flex items-center gap-2 text-base bg-[#D4AF37] p-2 rounded text-white font-medium cursor-pointer hover:opacity-90 duration-150'
                    >
                        <PlusIcon className='w-5 h-5' />
                        Add User
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
    )
}