import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyBookings, deleteBooking } from "../services/apiBooking";
import { CalendarIcon, UserIcon } from '@heroicons/react/24/solid';
import { TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const MyBookingsPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["bookings"],
    queryFn: getMyBookings,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Deleted booking!");

    },
    onError: (error: Error) => {
      console.error('Error deleting booking:', error);
    },
  });

  const handleDelete = (bookingId: string, detailsId: string) => {
    deleteMutation.mutate({ bookingId, detailsId });
  };

  // Skeleton loader for the booking items
  const BookingSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-4 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
      <div className="h-5 bg-gray-200 rounded w-1/4"></div>
    </div>
  );

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-50 rounded-2xl shadow-lg p-6 text-red-600 font-medium">
          Error loading bookings: {error.message}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <UserIcon className="w-7 h-7 text-indigo-600" />
          My Bookings
        </h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <BookingSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <UserIcon className="w-7 h-7 text-indigo-600" />
        My Bookings
      </h2>
      {data?.response?.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 text-gray-500 italic">
          No bookings found.
        </div>
      )}
      <div className="space-y-4">
        {data?.response?.map((booking: any) => (
          <div
            key={booking.bookingId}
            className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm sm:text-base flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-indigo-600" />
                {booking.booking.bookingDate}
              </p>
              <button
                onClick={() => handleDelete(booking.bookingId, booking.id)}
                disabled={deleteMutation.isPending}
                className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete booking"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 text-sm mt-1">
              Booked by: {booking?.user?.firstName || 'Unknown'} {booking?.user?.secondName || ''} {booking?.user?.isTeacher ? '(Teacher)' : '(Student)'}
            </p>
            <p className="text-gray-500 text-sm">
              Booked on: {new Date(booking.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookingsPage;