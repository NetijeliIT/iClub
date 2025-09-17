import { useState, useMemo } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { BookingForm } from "../types";
import { deleteBooking, getBookings } from "../services/apiBookings";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import DeleteModal from "../components/DeleteModal";
import Pagination from "../components/Pagination";
import toast from "react-hot-toast";

export default function BookingPage() {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false); // Controls modal visibility
    const [deleteIds, setDeleteIds] = useState<{ bookingId: string; detailId: string } | null>(null); // Stores IDs to delete
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { data, isLoading, error } = useQuery({
        queryKey: ['bookings', page, pageSize],
        queryFn: () => getBookings({ page, pageSize }),
    });

    // Flatten bookings to one row per detail, exclude bookings with no details

// ... inside BookingPage
const flattenedData = useMemo(
  () =>
    (data?.response || [])
      .filter((booking: BookingForm) => booking.details && booking.details.length > 0)
      .flatMap((booking: BookingForm) =>
        booking.details.map((detail) => ({
          bookingId: booking.id,
          bookingDate: booking.bookingDate,
          createdAt: booking.createdAt,
          detailId: detail.id,
          lesson: detail.lesson,
          user: detail.user,
          tv: detail.tv,
        }))
      ),
  [data?.response]
);

    const columns: ColumnDef<{
        bookingId: string;
        bookingDate: string;
        createdAt: string;
        detailId: string;
        lesson: string;
        user: BookingForm['details'][0]['user'];
        tv: boolean;
    }>[] = [
        {
            accessorKey: 'bookingId',
            header: 'Booking ID',
            cell: (info) => info.getValue(),
        },
        {
            accessorKey: 'bookingDate',
            header: 'Booking Date',
            cell: (info) => format(info.getValue() as string, "yyyy-MM-dd"),
        },
        {
            accessorKey: 'lesson',
            header: 'Lesson',
            cell: (info) => info.getValue() || 'N/A',
        },
        {
            accessorKey: 'user',
            id: 'user',
            header: 'User',
            cell: ({ row }) => {
                const user = row.original.user;
                return user ? `${user.firstName} ${user.secondName}` : 'N/A';
            },
        },
        {
            accessorKey: 'tv',
            header: 'TV Enabled',
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
                    <button
                        onClick={() => {
                            setDeleteIds({ bookingId: row.original.bookingId, detailId: row.original.detailId });
                            setIsOpen(true);
                        }}
                        className="text-red-600 hover:text-red-800 transition-colors duration-150"
                        title="Delete"
                        disabled={deleteMutation.isPending} // Disable during mutation
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
            ),
        },
    ];

    const table = useReactTable({
        data: flattenedData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const deleteMutation = useMutation({
        mutationFn: ({ bookingId, detailId }: { bookingId: string; detailId: string }) =>
          deleteBooking({ bookingId, detailId }),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['bookings', page, pageSize] });
          toast.success("Booking detail deleted successfully!");
          setIsOpen(false);
          setDeleteIds(null);
        },
        onError: (error: any) => {
          console.error("Delete error:", error);
          toast.error(error?.message || "Failed to delete booking detail");
          setIsOpen(false);
          setDeleteIds(null);
        },
      });

      if (isLoading) {
        return <p className="text-center text-gray-600">Loading...</p>;
      }
      
      if (error) {
        return <p className="text-center text-red-600">Error loading bookings 😢</p>;
      }
      
      if (flattenedData.length === 0) {
        return <p className="text-center text-gray-600">No bookings available.</p>;
      }

    return (
        <>
            <DeleteModal
                isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false);
                    setDeleteIds(null);
                }}
                onDelete={() => {
                    if (deleteIds) {
                    deleteMutation.mutate(deleteIds);
                    }
                }}
                isDeleting={deleteMutation.isPending} // Pass mutation status
                />
            <section className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Bookings</h1>
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
                        {table.getRowModel().rows.map((row, index) => {
                            const rowKey = `${row.original.bookingId}-${row.original.detailId}`;
                            console.log("Row key:", rowKey); // Debug to ensure unique keys
                            return (
                            <tr
                                key={rowKey}
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
                            );
                        })}
                        </tbody>
                    </table>
                    <div className="p-4 border-t border-gray-200">
                        <Pagination
                            page={page}
                            totalItems={data?.count || flattenedData.length}
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
